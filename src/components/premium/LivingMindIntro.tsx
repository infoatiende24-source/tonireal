"use client";

import { useEffect, useRef, useState } from "react";

type Particle = { brainX: number; brainY: number; noiseX: number; noiseY: number; phase: number; size: number };

const story = [
  ["EL ORIGEN", "Todo cambio comienza por comprender cómo estás pensando."],
  ["EL RUIDO", "No te falta capacidad. Te sobran interrupciones."],
  ["LA CLARIDAD", "Cuando te observas con intención, eliges mejor dónde poner tu atención."],
  ["LA IA ÚTIL", "La IA no viene a pensar por ti. Viene a ayudarte a decidir, crear y trabajar mejor."],
  ["LA SOLUCIÓN", "Menos tareas dispersas y repetitivas. Más soluciones que funcionan."],
  ["LA PRESENCIA", "La IA que devuelve tiempo a las personas."],
  ["EL UMBRAL", "Entra en lo que podemos construir juntos."],
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const side = Math.random() > 0.5 ? 1 : -1;
    const lower = Math.random() < 0.13;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    return {
      brainX: side * (lower ? 0.2 : 0.19) + Math.cos(angle) * radius * (lower ? 0.15 : 0.31),
      brainY: (lower ? 0.26 : -0.04) + Math.sin(angle) * radius * (lower ? 0.13 : 0.37),
      noiseX: (Math.random() - 0.5) * 1.5,
      noiseY: (Math.random() - 0.5) * 1.05,
      phase: Math.random() * Math.PI * 2,
      size: 0.55 + Math.random() * 1.45,
    };
  });
}

export default function LivingMindIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(0);
  const lockedRef = useRef(false);
  const touchStart = useRef<number | null>(null);
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    if (!visible) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const move = (direction: 1 | -1) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      if (direction === 1 && stageRef.current === story.length - 1) setVisible(false);
      else setStage((current) => Math.max(0, Math.min(story.length - 1, current + direction)));
      window.setTimeout(() => { lockedRef.current = false; }, 650);
    };
    const wheel = (event: WheelEvent) => { event.preventDefault(); if (Math.abs(event.deltaY) > 10) move(event.deltaY > 0 ? 1 : -1); };
    const keys = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
      if (["ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
    };
    const startTouch = (event: TouchEvent) => { touchStart.current = event.changedTouches[0]?.clientY ?? null; };
    const endTouch = (event: TouchEvent) => {
      const end = event.changedTouches[0]?.clientY;
      if (touchStart.current !== null && end !== undefined && Math.abs(touchStart.current - end) > 34) move(touchStart.current > end ? 1 : -1);
      touchStart.current = null;
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keys);
    window.addEventListener("touchstart", startTouch, { passive: true });
    window.addEventListener("touchend", endTouch, { passive: true });
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keys);
      window.removeEventListener("touchstart", startTouch);
      window.removeEventListener("touchend", endTouch);
    };
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const particles = createParticles(window.innerWidth < 640 ? 145 : 290);
    const links: Array<[number, number]> = [];
    for (let i = 0; i < particles.length; i += 1) {
      particles
        .map((particle, index) => ({ index, distance: (particles[i].brainX - particle.brainX) ** 2 + (particles[i].brainY - particle.brainY) ** 2 }))
        .filter(({ index }) => index !== i).sort((a, b) => a.distance - b.distance).slice(0, 2)
        .forEach(({ index }) => links.push([i, index]));
    }
    let animation = 0; let width = 0; let height = 0; let dpr = 1;
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const render = (time: number) => {
      const progress = stageRef.current / (story.length - 1);
      // The mind is already legible at the origin; it gains coherence rather than appearing from nowhere.\n      const shape = 0.32 + smooth((progress + 0.03) / 0.58) * 0.68;
      const clarity = smooth((progress - 0.16) / 0.55);
      const portal = smooth((progress - 0.77) / 0.23);
      const scale = Math.min(width, height) * (width < 640 ? 0.87 : 0.94);
      const cx = width / 2; const cy = height * 0.47;
      context.clearRect(0, 0, width, height);
      const bg = context.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.73);
      bg.addColorStop(0, `rgba(81, 53, 21, ${0.18 + clarity * 0.22})`);
      bg.addColorStop(0.54, "rgba(9, 8, 7, .5)"); bg.addColorStop(1, "#020202");
      context.fillStyle = bg; context.fillRect(0, 0, width, height);
      const points: Array<[number, number]> = [];
      particles.forEach((particle) => {
        const wobble = 1 - clarity;
        const waveX = Math.sin(time * 0.0007 + particle.phase) * (0.005 + wobble * 0.012);
        const waveY = Math.cos(time * 0.00058 + particle.phase) * (0.004 + wobble * 0.011);
        points.push([cx + (particle.noiseX * (1 - shape) + (particle.brainX + waveX) * shape) * scale, cy + (particle.noiseY * (1 - shape) + (particle.brainY + waveY) * shape) * scale]);
      });
      context.lineWidth = 0.45; context.strokeStyle = `rgba(224, 183, 113, ${0.015 + clarity * 0.18})`;
      links.forEach(([from, to]) => { context.beginPath(); context.moveTo(...points[from]); context.lineTo(...points[to]); context.stroke(); });
      particles.forEach((particle, index) => {
        const [x, y] = points[index]; const pulse = 0.58 + Math.sin(time * 0.0018 + particle.phase) * 0.22;
        context.beginPath(); context.fillStyle = `rgba(255, ${188 + Math.floor(clarity * 48)}, ${94 + Math.floor(clarity * 105)}, ${0.18 + pulse * 0.62})`;
        context.arc(x, y, particle.size * (0.55 + clarity * 0.85), 0, Math.PI * 2); context.fill();
      });
      if (portal > 0) {
        const radius = Math.min(width, height) * (0.12 + portal * 0.29);
        const glow = context.createRadialGradient(cx, cy, radius * 0.58, cx, cy, radius * 1.35);
        glow.addColorStop(0, `rgba(255, 251, 240, ${portal * 0.34})`); glow.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = glow; context.fillRect(0, 0, width, height);
        context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255, 251, 239, ${portal * .95})`; context.lineWidth = 1 + portal * 2.2; context.stroke();
      }
      animation = window.requestAnimationFrame(render);
    };
    resize(); animation = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => { window.cancelAnimationFrame(animation); window.removeEventListener("resize", resize); };
  }, [visible]);

  if (!visible) return null;
  const [eyebrow, line] = story[stage];
  const openness = Math.min(1, stage / 4);
  const portalStage = stage >= 5;
  const leftTransform = `translate3d(calc(-50% - ${120 + openness * 290}px), -50%, ${openness * -180}px) rotateY(${18 - openness * 10}deg) rotateZ(-1.5deg)`;
  const rightTransform = `translate3d(calc(-50% + ${120 + openness * 290}px), -50%, ${openness * -180}px) rotateY(${-18 + openness * 10}deg) rotateZ(1.5deg)`;

  return (
    <section aria-label="Introducción Toni Real. Usa el desplazamiento para avanzar." className="fixed inset-0 z-[100] overflow-hidden bg-[#020202] text-[#f7f1e7]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.23)_62%,rgba(0,0,0,.87)_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1500px]">
        <div className="absolute left-1/2 top-1/2 h-[72vh] w-[40vw] rounded-[4px] border border-[#e6c583]/[.18] bg-[linear-gradient(115deg,rgba(255,255,255,.10),rgba(207,165,90,.035)_28%,rgba(0,0,0,.12)_68%,rgba(255,255,255,.035))] shadow-[inset_1px_0_0_rgba(255,246,220,.14),0_30px_110px_rgba(0,0,0,.55)] backdrop-blur-[1px] transition-transform duration-700 ease-out sm:h-[105vh] sm:w-[33vw] sm:min-w-[340px] sm:backdrop-blur-[2px]" style={{ transform: leftTransform }} />
        <div className="absolute left-1/2 top-1/2 h-[84vh] w-[48vw] rounded-[4px] border border-[#e6c583]/[.18] bg-[linear-gradient(245deg,rgba(255,255,255,.10),rgba(207,165,90,.035)_28%,rgba(0,0,0,.12)_68%,rgba(255,255,255,.035))] shadow-[inset_-1px_0_0_rgba(255,246,220,.14),0_30px_110px_rgba(0,0,0,.55)] backdrop-blur-[1px] transition-transform duration-700 ease-out sm:h-[105vh] sm:w-[33vw] sm:min-w-[340px] sm:backdrop-blur-[2px]" style={{ transform: rightTransform }} />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(68vw,68vh)] w-[min(68vw,68vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e7c17d]/[.12] transition-all duration-700" style={{ opacity: portalStage ? .62 : .18, transform: `translate(-50%,-50%) scale(${portalStage ? 1 : .72})` }} />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
        <div className="flex justify-between text-[10px] font-medium tracking-[0.34em] text-[#d6ad72] sm:text-xs"><span>TONI REAL</span><span>{String(stage + 1).padStart(2, "0")} / {String(story.length).padStart(2, "0")}</span></div>
        <div className="mb-[15vh] max-w-3xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,.95)" }}>
          <div className="mb-3 flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-[#d6ad72] sm:text-base"><span className="text-lg">↗</span>{eyebrow}</div>
          <p className="font-display text-3xl leading-[1.08] sm:text-5xl md:text-6xl">{line}</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] tracking-[0.22em] text-white/65"><span>{stage === story.length - 1 ? "DESLIZA PARA ATRAVESAR EL UMBRAL" : "DESLIZA PARA CONTINUAR"}</span><button onClick={() => setVisible(false)} className="pointer-events-auto transition hover:text-white">SALTAR</button></div>
      </div>
    </section>
  );
}
