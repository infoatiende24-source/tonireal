"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const frames = [
  { image: "/intro-v2/frame-1-origin.webp", eyebrow: "EL ORIGEN", line: "Todo cambio comienza por comprender cómo estás pensando." },
  { image: "/intro-v2/frame-2-noise.webp", eyebrow: "EL RUIDO", line: "No te falta capacidad. Te sobran interrupciones." },
  { image: "/intro-v2/frame-3-clarity.webp", eyebrow: "LA CLARIDAD", line: "Cuando te observas con intención, eliges mejor dónde poner tu atención." },
  { image: "/intro-v2/frame-4-ai.webp", eyebrow: "LA IA ÚTIL", line: "La IA no viene a pensar por ti. Viene a ayudarte a decidir, crear y trabajar mejor." },
  { image: "/intro-v2/frame-5-solutions.webp", eyebrow: "LA SOLUCIÓN", line: "Menos tareas dispersas y repetitivas. Más soluciones que funcionan." },
  { image: "/intro-v2/frame-6-presence.webp", eyebrow: "LA PRESENCIA", line: "La IA que devuelve tiempo a las personas." },
  { image: "/intro-v2/frame-7-threshold.webp", eyebrow: "EL UMBRAL", line: "Entra en lo que podemos construir juntos." },
];

export default function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const [frame, setFrame] = useState(0);
  const locked = useRef(false);
  const touchStart = useRef<number | null>(null);

  const move = (direction: 1 | -1) => {
    if (locked.current) return;
    locked.current = true;

    if (direction === 1 && frame === frames.length - 1) {
      setVisible(false);
    } else {
      setFrame((current) => Math.max(0, Math.min(frames.length - 1, current + direction)));
    }

    window.setTimeout(() => {
      locked.current = false;
    }, 780);
  };

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 12) return;
      move(event.deltaY > 0 ? 1 : -1);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        move(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStart.current = event.changedTouches[0]?.clientY ?? null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientY;
      if (start === null || end === undefined || Math.abs(start - end) < 35) return;
      move(start > end ? 1 : -1);
      touchStart.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [frame, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          aria-label="Introducción Toni Real. Usa el desplazamiento para avanzar."
          className="fixed inset-0 z-[100] overflow-hidden bg-black text-[#f7f1e7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, transition: { duration: 0.9, ease: "easeIn" } }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={frame}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.005 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${frames[frame].image})` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/85" />
            </motion.div>
          </AnimatePresence>

          <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
            <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.34em] text-[#d6ad72] sm:text-xs">
              <span>TONI REAL</span>
              <span>{String(frame + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}</span>
            </div>

            <div className="mb-[16vh] max-w-3xl">
              <motion.div key={`copy-${frame}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }} style={{ textShadow: "0 2px 16px rgba(0, 0, 0, 0.92)" }}>
                <div className="mb-3 flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-[#d6ad72] sm:text-base">
                  <span className="text-lg leading-none">↗</span>{frames[frame].eyebrow}
                </div>
                <p className="font-serif text-3xl leading-[1.08] sm:text-5xl md:text-6xl">{frames[frame].line}</p>
              </motion.div>
            </div>

            <motion.div
              key={`arrow-${frame}`}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[57%] flex -translate-x-1/2 flex-col items-center text-[#d6ad72]"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 0.82, y: 0 }}
              transition={{ delay: 0.45, duration: 0.48 }}
            >
              <svg width="28" height="68" viewBox="0 0 28 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2V58M5 49L14 58L23 49" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </motion.div>

            <div className="flex items-center gap-4 text-[10px] tracking-[0.25em] text-white/60">
              <span>{frame === frames.length - 1 ? "DESLIZA PARA ATRAVESAR EL UMBRAL" : "DESLIZA PARA CONTINUAR"}</span>
              <button onClick={() => setVisible(false)} className="transition hover:text-white">SALTAR</button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
