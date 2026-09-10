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
type Particle = { x: number; y: number; z: number; seed: number; light: number };

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
    const ctx = node.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const imageNames = ["frame-1-origin", "frame-2-noise", "frame-3-clarity", "frame-4-ai", "frame-5-solutions", "frame-6-presence"];
    const artworks = imageNames.map(() => new Image());
    const origin = artworks[0], portal = new Image();
    let particles: Particle[] = [], width = 1, height = 1, raf = 0, disposed = false;
    let mouseX = 0, mouseY = 0;
    let active = -1;

    // Sample the actual artwork: the moving field preserves the original brain's silhouette.
    origin.onload = () => {
      if (disposed) return;
      const buffer = document.createElement("canvas");
      buffer.width = 256; buffer.height = 144;
      const sample = buffer.getContext("2d", { willReadFrequently: true });
      if (sample) {
        sample.drawImage(origin, 0, 0, 256, 144);
        const pixels = sample.getImageData(0, 0, 256, 144).data;
        for (let y = 29; y < 115; y += 1) for (let x = 85; x < 169; x += 1) {
          const index = (y * 256 + x) * 4;
          if (pixels[index] < 90 || pixels[index + 1] < 48) continue;
          const seed = ((x * 127 + y * 311) % 997) / 997;
          if (seed > 0.65) continue;
          const px = (x - 128) / 43, py = (y - 72) / 43;
          particles.push({ x: px, y: py, z: Math.sin(seed * 23) * Math.sqrt(Math.max(0, 1 - px * px - py * py)) * 0.6, seed, light: pixels[index] / 255 });
        }
      }
      surface.dataset.loaded = "true";
      schedule();
    };
    origin.onerror = () => schedule();
    portal.onload = () => schedule();
    artworks.forEach((image, index) => {
      if (index > 0) image.onload = () => { if (!disposed) schedule(); };
      image.onerror = () => schedule();
      image.src = `/intro-v2/${imageNames[index]}.webp`;
    });
    portal.src = "/intro-v2/frame-7-threshold.webp";

    const point = (v: Particle, p: number, fusion: number, trail = 0) => {
      const scatter = ease(0.06, 0.20, p) * (1 - ease(0.27, 0.41, p));
      const orbit = ease(0.39, 0.54, p) * (1 - ease(0.65, 0.76, p));
      const gate = ease(0.76, 0.89, p);
      const angle = p * Math.PI * 2.2 + v.seed * 6.283 + trail;
      let x = v.x + scatter * (Math.cos(v.seed * 49 + p * 9 + trail) * 1.7 + v.x * 0.5);
      let y = v.y + scatter * Math.sin(v.seed * 39 + p * 7 + trail) * 1.3;
      let z = v.z + scatter * Math.sin(v.seed * 29 + p * 8) * 1.4;
      x = x * (1 - orbit) + Math.cos(angle) * (1.1 + v.seed * 0.4) * orbit;
      y = y * (1 - orbit) + Math.sin(angle) * (0.52 + Math.sin(v.seed * 24) * 0.24) * orbit;
      z = z * (1 - orbit) + Math.sin(angle + 1) * orbit;
      x = x * (1 - gate) + Math.cos(v.seed * 6.283 + trail) * 0.85 * gate;
      y = y * (1 - gate) + Math.sin(v.seed * 6.283 + trail) * 1.2 * gate;
      z *= 1 - gate;
      const rotation = (p * 3.3 + mouseX * 0.08) * (1 - gate);
      const rx = x * Math.cos(rotation) + z * Math.sin(rotation);
      const rz = z * Math.cos(rotation) - x * Math.sin(rotation);
      const perspective = 3.8 / (3.8 + rz);
      // At rest, every point lands on its exact source pixel; motion peels it away
      // and returns it to the same registered folds as the next artwork emerges.
      return {
        x: v.x + (rx * perspective - v.x) * fusion,
        y: v.y + ((y + mouseY * 0.035) * perspective - v.y) * fusion,
        scale: 1 + (perspective - 1) * fusion,
      };
    };

    function draw() {
      raf = 0;
      if (disposed || !root || !surface || !ctx) return;
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
      ctx.clearRect(0, 0, width, height);
      const mobile = width < 760;
      const cx = width * (mobile ? 0.5 : 0.68);
      const cy = height * (mobile ? 0.32 : 0.49);
      const size = Math.min(width * (mobile ? 0.35 : 0.235), height * (mobile ? 0.235 : 0.34));
      const still = reduced.matches;
      const phase = Math.min(p * 7, 5);
      const imageIndex = Math.floor(phase);
      const blend = ease(0.22, 0.96, phase - imageIndex);
      // Each dissolve has a release and a reunion. The brain stays visible beneath it.
      const fusion = still ? 0 : Math.sin(blend * Math.PI) * 0.78;
      const portalAlpha = ease(0.85, 0.96, p);
      const imageOpacity = (1 - fusion * 0.42) * (1 - portalAlpha);
      const current = artworks[imageIndex].naturalWidth ? artworks[imageIndex] : origin;
      const next = artworks[Math.min(imageIndex + 1, 5)];
      const mix = next.complete && next.naturalWidth ? blend : 0;
      const paintArtwork = (image: HTMLImageElement, alpha: number) => {
        if (!image.complete || !image.naturalWidth || alpha <= 0) return;
        ctx.globalAlpha = alpha;
        // 256/43 matches the sampling coordinates exactly, avoiding a floating overlay.
        const w = size * (256 / 43), h = w * image.height / image.width;
        ctx.drawImage(image, cx - w / 2, cy - h / 2, w, h);
      };
      ctx.globalCompositeOperation = "source-over";
      paintArtwork(current, imageOpacity * (1 - mix));
      ctx.globalCompositeOperation = "lighter";
      paintArtwork(next, imageOpacity * mix);
      if (!still && particles.length) {
        ctx.globalCompositeOperation = "lighter";
        const alpha = (0.12 + fusion * 0.88) * (1 - portalAlpha);
        const stretch = fusion;
        // Fine trails follow the same continuous paths as the artwork's sampled points.
        for (let i = 0; i < particles.length; i += 24) {
          const v = particles[i];
          ctx.beginPath();
          for (let j = 0; j <= 18; j++) {
            const t = j / 18;
            const q = point(v, p, fusion, t * stretch * 0.9);
            // The root stays attached to its fold while the luminous tip flows outward.
            const x = cx + (v.x + (q.x - v.x) * t) * size;
            const y = cy + (v.y + (q.y - v.y) * t) * size;
            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(221,175,99,${alpha * 0.48})`;
          ctx.lineWidth = 0.65;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
        for (const v of particles) {
          const q = point(v, p, fusion);
          const radius = Math.max(0.65, size / 230 * q.scale * (0.6 + v.light));
          ctx.globalAlpha = alpha * (0.32 + v.light * 0.58);
          ctx.fillStyle = v.light > 0.8 ? "#fff0cc" : "#c89848";
          ctx.fillRect(cx + q.x * size, cy + q.y * size, radius, radius);
        }
      }
      ctx.globalCompositeOperation = "source-over";
      if (portal.complete && portal.naturalWidth && portalAlpha > 0) {
        ctx.globalAlpha = portalAlpha;
        const zoom = 1 + ease(0.93, 1, p) * (still ? 0 : 1.1);
        const w = Math.max(width, height * portal.width / portal.height) * zoom;
        const h = w * portal.height / portal.width;
        ctx.drawImage(portal, (width - w) / 2, (height - h) / 2, w, h);
      }
      ctx.globalAlpha = 1;
    }
    function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
    const resize = () => {
      width = surface.clientWidth; height = surface.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      node.width = Math.round(width * dpr); node.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      artworks.forEach(image => { image.onload = null; image.onerror = null; });
      portal.onload = null; particles = [];
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
