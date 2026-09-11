"use client";

import { useEffect, useRef } from "react";
import styles from "./CinematicIntro.module.css";

const chapters = [
  ["EL ORIGEN", "Todo cambio comienza por comprender cómo estás pensando."],
  ["EL RUIDO", "No te falta capacidad. Te sobran interrupciones."],
  ["LA CLARIDAD", "Cuando te observas con intención, eliges mejor dónde poner tu atención."],
  ["LA IA ÚTIL", "La IA no viene a pensar por ti. Viene a ayudarte a mejorar en todos los aspectos."],
  ["LA SOLUCIÓN", "Menos tareas dispersas y repetitivas, para obtener más soluciones que funcionan."],
  ["LA PRESENCIA", "La IA que devuelve tiempo a las personas."],
  ["EL UMBRAL", "Entra en lo que podemos construir juntos."],
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (a: number, b: number, n: number) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };


export default function CinematicIntro() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = section.current, surface = stage.current, node = canvas.current;
    if (!root || !surface || !node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, raf = 0, disposed = false;
    let mouseX = 0, mouseY = 0, active = -1;
    let scene: ReturnType<typeof import("@/lib/brain-scene").createBrainScene> | undefined;
    const controller = new AbortController();
    Promise.all([
      import("@/lib/brain-scene"),
      fetch("/models/brain-cortex.json", { signal: controller.signal }).then(response => {
        if (!response.ok) throw new Error("Brain model unavailable");
        return response.json();
      }),
    ]).then(([{ createBrainScene }, model]) => {
      if (disposed) return;
      try {
        scene = createBrainScene(node, model);
        surface.dataset.loaded = "true";
        schedule();
      } catch {
        // Keep the introduction copy and direct entrance usable without WebGL.
        surface.dataset.loaded = "unavailable";
      }
    }).catch(() => { if (!disposed) surface.dataset.loaded = "unavailable"; });

    function draw() {
      raf = 0;
      if (disposed || !root || !surface) return;
      const rect = root.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, root.offsetHeight - surface.offsetHeight));
      const chapter = Math.min(6, Math.floor(p * 7));
      if (active !== chapter) {
        active = chapter;
        if (counter.current) counter.current.textContent = `0${chapter + 1} / 07`;
        Array.from(copy.current?.children ?? []).forEach((child, i) => {
          (child as HTMLElement).dataset.active = String(i === chapter);
          child.setAttribute("aria-hidden", String(i !== chapter));
        });
      }
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
      const exit = ease(0.94, 1, p);
      surface.style.opacity = String(1 - exit);
      surface.style.pointerEvents = exit > 0.95 ? "none" : "auto";
      surface.setAttribute("aria-hidden", String(exit > 0.95));
      surface.inert = exit > 0.95;
      const web = document.getElementById("toni-web");
      if (web) web.inert = exit <= 0.95;
      if (rect.bottom < 0 || rect.top > height) return;
      scene?.render(p, width, height, mouseX, mouseY, reduced.matches);
    }

    function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
    const resize = () => {
      width = surface.clientWidth; height = surface.clientHeight;
      schedule();
    };
    const pointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced.matches) return;
      mouseX = e.clientX / width - 0.5; mouseY = e.clientY / height - 0.5;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    window.addEventListener("scroll", schedule, { passive: true });
    surface.addEventListener("pointermove", pointer, { passive: true });
    reduced.addEventListener("change", schedule);
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect();
      window.removeEventListener("scroll", schedule);
      surface.removeEventListener("pointermove", pointer);
      reduced.removeEventListener("change", schedule);
      controller.abort();
      scene?.dispose();
      const web = document.getElementById("toni-web");
      if (web) web.inert = false;
    };
  }, []);

  const enter = () => {
    const root = section.current;
    if (!root) return;
    const destination = window.scrollY + (document.getElementById("toni-web")?.getBoundingClientRect().top ?? root.getBoundingClientRect().bottom);
    window.scrollTo({ top: destination, behavior: "instant" });
    const web = document.getElementById("toni-web");
    if (web) { web.inert = false; web.focus({ preventScroll: true }); }
  };

  return (
    <section ref={section} className={styles.journey} aria-label="IA, consciencia y autoconocimiento">
      <div ref={stage} className={styles.stage}>
        <div className={styles.fallback} aria-hidden="true" />
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.top}>
          <a href="#" className={styles.brand}>TONI REAL<span>IA · CONSCIENCIA · AUTOCONOCIMIENTO</span></a>
          <button onClick={enter} className={styles.skip}>Entrar en la web <span aria-hidden="true">↗</span></button>
        </div>
        <div ref={copy} className={styles.copy}>
          {chapters.map(([title, line], i) => (
            <div key={title} className={styles.chapter} data-active={i === 0 ? "true" : "false"} aria-hidden={i !== 0}>
              <div className={styles.label}><span className={styles.rule} />{title}</div>
              <h1 className={styles.headline}>{line}</h1>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span className={styles.scroll}><span aria-hidden="true">↓</span> Desliza para explorar</span>
          <span ref={counter} className={styles.count}>01 / 07</span>
        </div>
        <div className={styles.track}><div ref={progress} className={styles.progress} /></div>
      </div>
    </section>
  );
}
