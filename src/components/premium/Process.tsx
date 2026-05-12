"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const GoldIconChat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="procChat" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="url(#procChat)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <path d="M8 9h8M8 13h5" stroke="url(#procChat)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GoldIconSearch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="procSearch" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <circle cx="11" cy="11" r="8" stroke="url(#procSearch)" strokeWidth="1.5" fill="none" />
    <path d="M21 21l-4.35-4.35" stroke="url(#procSearch)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 11h6" stroke="url(#procSearch)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const GoldIconCode = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="procCode" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="url(#procCode)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4l-4 16" stroke="url(#procCode)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const GoldIconTrophy = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="procTrophy" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <path d="M6 9H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" stroke="url(#procTrophy)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M6 4h12v5a6 6 0 0 1-12 0V4z" stroke="url(#procTrophy)" strokeWidth="1.5" fill="none" />
    <path d="M12 15v3M8 21h8" stroke="url(#procTrophy)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 21h6" stroke="url(#procTrophy)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const steps = [
  {
    icon: <GoldIconChat />,
    title: "Contacto",
    desc: "Me escribes por WhatsApp y comentamos tus necesidades. Una conversación rápida para entender exactamente qué necesita tu negocio.",
  },
  {
    icon: <GoldIconSearch />,
    title: "Análisis",
    desc: "Analizo tu negocio a fondo y te propongo la mejor solución adaptada a tus objetivos y presupuesto.",
  },
  {
    icon: <GoldIconCode />,
    title: "Ejecución",
    desc: "Implemento todo mientras tú sigues con tu negocio. Sin interrupciones, sin complicaciones técnicas para ti.",
  },
  {
    icon: <GoldIconTrophy />,
    title: "Resultados",
    desc: "Entrego tu proyecto listo para escalar ventas. Y te acompaño para asegurar que todo funcione perfectamente.",
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="proceso" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            ¿Cómo <span className="text-gradient-gold">trabajamos</span>?
          </h2>
          <p className="text-[#a09888] text-lg">
            Un proceso simple y transparente
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical gold line */}
          <div className="absolute left-8 top-4 bottom-4 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(205,168,98,0.2), transparent)" }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex gap-8 items-start group"
              >
                {/* Step icon with gold glow */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(205,168,98,0.12) 0%, rgba(180,139,60,0.06) 100%)",
                      border: "1px solid rgba(205,168,98,0.15)",
                      boxShadow: "0 0 20px rgba(205,168,98,0.05)",
                    }}
                  >
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-full w-px h-12 hidden md:block"
                      style={{ background: "linear-gradient(to bottom, rgba(205,168,98,0.15), transparent)" }}
                    />
                  )}
                </div>

                <div className="pt-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 text-[#f5f0e8] group-hover:text-gold-light transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[#a09888] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
