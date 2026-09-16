"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  brainX: number; brainY: number; noiseX: number; noiseY: number; phase: number; size: number;
};

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
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let index = 0; index < count; index += 1) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const lower = Math.random() < 0.13;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    const centerX = side * (lower ? 0.2 : 0.19);
    const centerY = lower ? 0.26 : -0.04;
    const radiusX = lower ? 0.15 : 0.31;
    const radiusY = lower ? 0.13 : 0.37;
    particles.push({
      brainX: centerX + Math.cos(angle) * radius * radiusX,
      brainY: centerY + Math.sin(angle) * radius * radiusY,
      noiseX: (Math.random() - 0.5) * 1.5,
      noiseY: (Math.random() - 0.5) * 1.05,
      phase: Math.random() * Math.PI * 2,
      size: 0.55 + Math.random() * 1.45,
    });
  }
  return particles;
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
      if (direction === 1 && stageRef.current === story.length - 1) {
        setVisible(false);
      } else {
        setStage((current) => Math.max(0, Math.min(story.length - 1, current + direction)));
      }
      window.setTimeout(() => { lockedRef.current = false; }, 680);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) > 10) move(event.deltaY > 0 ? 1 : -1);
    };
    const keys = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
      if (["ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
    };
    const touchStart = (event: TouchEvent) => { touchStartRef(event); };
    const touchEnd = (event: TouchEvent) => {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientY;
      if (start !== null && end !== undefined && Math.abs(start - end) > 34) move(start > end ? 1 : -1);
      touchStart.current = null;
    };
    const touchStartRef = (event: TouchEvent) => { touchStart.current = event.changedTouches[0]?.clientY ?? null; };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keys);
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keys);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const particleCount = window.innerWidth < 640 ? 190 : 390;
    const particles = createParticles(particleCount);
    const links: Array<[number, number]> = [];
    for (let i = 0; i < particles.length; i += 1) {
      const closest: Array<{ index: number; distance: number }> = [];
      for (let j = 0; j < particles.length; j += 1) {
        if (i === j) continue;
        const dx = particles[i].brainX - particles[j].brainX;
        const dy = particles[i].brainY - particles[j].brainY;
        closest.push({ index: j, distance: dx * dx + dy * dy });
      }
      closest.sort((a, b) => a.distance - b.distance);
      closest.slice(0, 2).forEach(({ index }) => links.push([i, index]));
    }
    let animation = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const render = (time: number) => {
      const progress = stageRef.current / (story.length - 1);
      const shape = smooth((progress + 0.03) / 0.72);
      const order = smooth((progress - 0.16) / 0.6);
      const portal = smooth((progress - 0.78) / 0.22);
      context.clearRect(0, 0, width, height);
      const background = context.createRadialGradient(width / 2, height * 0.48, 0, width / 2, height * 0.48, Math.max(width, height) * 0.7);
      background.addColorStop(0, `rgba(81, 53, 21, ${0.28 + order * 0.18})`);
      background.addColorStop(0.5, "rgba(10, 9, 8, 0.36)");
      background.addColorStop(1, "#020202");
      context.fillStyle = background; context.fillRect(0, 0, width, height);
      const scale = Math.min(width, height) * 0.95;
      const cx = width / 2;
      const cy = height * 0.47;
      const points: Array<[number, number]> = [];
      for (const particle of particles) {
        const waveX = Math.sin(time * 0.00075 + particle.phase) * (0.006 + (1 - order) * 0.012);
        const waveY = Math.cos(time * 0.00062 + particle.phase) * (0.005 + (1 - order) * 0.01);
        const x = cx + ((particle.noiseX * (1 - shape) + (particle.brainX + waveX) * shape) * scale);
        const y = cy + ((particle.noiseY * (1 - shape) + (particle.brainY + waveY) * shape) * scale);
        points.push([x, y]);
      }
      context.lineWidth = 0.55;
      context.strokeStyle = `rgba(220, 173, 104, ${0.025 + order * 0.17})`;
      for (const [from, to] of links) {
        context.beginPath(); context.moveTo(...points[from]); context.lineTo(...points[to]); context.stroke();
      }
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const [x, y] = points[index];
        const pulse = 0.55 + Math.sin(time * 0.002 + particle.phase) * 0.25;
        context.beginPath();
        context.fillStyle = `rgba(255, ${190 + Math.floor(order * 45)}, ${95 + Math.floor(order * 85)}, ${0.22 + pulse * 0.54})`;
        context.arc(x, y, particle.size * (0.6 + order * 0.7), 0, Math.PI * 2);
        context.fill();
      }
      if (portal > 0) {
        const radius = Math.min(width, height) * (0.11 + portal * 0.28);
        const glow = context.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.25);
        glow.addColorStop(0, `rgba(255, 249, 232, ${portal * 0.2})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = glow; context.fillRect(0, 0, width, height);
        context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255, 249, 232, ${portal * 0.9})`;
        context.lineWidth = 1 + portal * 2.2; context.stroke();
      }
      animation = window.requestAnimationFrame(render);
    };
    resize(); animation = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => { window.cancelAnimationFrame(animation); window.removeEventListener("resize", resize); };
  }, [visible]);

  if (!visible) return null;
  const [eyebrow, line] = story[stage];
  return (
    <section aria-label="Introducción Toni Real. Usa el desplazamiento para avanzar." className="fixed inset-0 z-[100] overflow-hidden bg-[#020202] text-[#f7f1e7]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
        <div className="flex justify-between text-[10px] font-medium tracking-[0.34em] text-[#d6ad72] sm:text-xs"><span>TONI REAL</span><span>{String(stage + 1).padStart(2, "0")} / {String(story.length).padStart(2, "0")}</span></div>
        <div className="mb-[16vh] max-w-3xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,.95)" }}>
          <div className="mb-3 flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-[#d6ad72] sm:text-base"><span className="text-lg">↗</span>{eyebrow}</div>
          <p className="font-serif text-3xl leading-[1.08] sm:text-5xl md:text-6xl">{line}</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] tracking-[0.22em] text-white/65"><span>{stage === story.length - 1 ? "DESLIZA PARA ATRAVESAR EL UMBRAL" : "DESLIZA PARA CONTINUAR"}</span><button onClick={() => setVisible(false)} className="pointer-events-auto transition hover:text-white">SALTAR</button></div>
      </div>
    </section>
  );
}
