"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const frames = [
  { image: "/intro-v2/frame-1-origin.webp", eyebrow: "EL ORIGEN", line: "Todo cambio real empieza por comprender cómo estás pensando." },
  { image: "/intro-v2/frame-2-noise.webp", eyebrow: "EL RUIDO", line: "No te falta capacidad. Te sobran interrupciones." },
  { image: "/intro-v2/frame-3-clarity.webp", eyebrow: "LA CLARIDAD", line: "Cuando te observas con claridad, eliges mejor dónde poner tu atención." },
  { image: "/intro-v2/frame-4-ai.webp", eyebrow: "LA IA ÚTIL", line: "La IA no viene a pensar por ti. Viene a ayudarte a pensar mejor." },
  { image: "/intro-v2/frame-5-solutions.webp", eyebrow: "LA SOLUCIÓN", line: "Menos tareas dispersas. Más soluciones que funcionan." },
  { image: "/intro-v2/frame-6-presence.webp", eyebrow: "LA PRESENCIA", line: "IA que devuelve tiempo a las personas." },
];

export default function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("toni-intro-seen")) return;
    setVisible(true);
    const timer = window.setInterval(() => setFrame((current) => current + 1), 2100);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (frame < frames.length) return;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("toni-intro-seen", "true");
      setVisible(false);
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [frame]);

  const close = () => {
    sessionStorage.setItem("toni-intro-seen", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          aria-label="Introducción Toni Real"
          className="fixed inset-0 z-[100] overflow-hidden bg-black text-[#f7f1e7]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.9 } }}
        >
          <AnimatePresence mode="wait">
            {frame < frames.length && (
              <motion.div key={frame} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: 1.15, ease: "easeOut" }}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${frames[frame].image})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
            <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.34em] text-[#d6ad72] sm:text-xs">
              <span>TONI REAL</span><span>0{Math.min(frame + 1, 6)} / 06</span>
            </div>
            <div className="mb-[16vh] max-w-3xl">
              {frame < frames.length ? <motion.div key={frame} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7 }}><div className="mb-3 flex items-center gap-3 text-[10px] tracking-[0.3em] text-[#d6ad72]"><span className="text-lg leading-none">↗</span>{frames[frame].eyebrow}</div><p className="font-serif text-3xl leading-[1.08] sm:text-5xl md:text-6xl">{frames[frame].line}</p></motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><p className="text-xs tracking-[0.35em] text-[#d6ad72]">TONI REAL</p><h1 className="mt-4 font-serif text-5xl leading-none sm:text-7xl">Menos ruido.<br />Más presencia.</h1></motion.div>}
            </div>
            {frame < frames.length && (
              <motion.div
                key={`arrow-${frame}`}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[57%] flex -translate-x-1/2 flex-col items-center text-[#d6ad72]"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 0.82, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <svg width="28" height="68" viewBox="0 0 28 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2V58M5 49L14 58L23 49" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </motion.div>
            )}
            <button onClick={close} className="self-start text-[10px] tracking-[0.25em] text-white/60 transition hover:text-white">SALTAR INTRODUCCIÓN</button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
