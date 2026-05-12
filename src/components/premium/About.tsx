"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const badges = [
  { icon: "⚡", text: "Respuesta en 24h" },
  { icon: "🎯", text: "Resultados medibles" },
  { icon: "💡", text: "Asesoría personalizada" },
  { icon: "🤝", text: "Soporte continuo" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre-mi" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0908] to-[#050505]" />

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Animated ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-gold/30 via-gold/10 to-gold/30 animate-[spin_8s_linear_infinite] blur-sm" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-gold/30 glow-gold">
                <Image
                  src="/perfil_web.jpg"
                  alt="Toni Real"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              Hola, soy{" "}
              <span className="text-gradient-gold">Toni Real</span>
            </h2>

            <p className="text-[#a09888] text-lg leading-relaxed">
              He visto demasiados negocios perder clientes por no contestar un
              WhatsApp a tiempo. Por eso me dedico a automatizar respuestas y
              crear sistemas que convierten consultas en ventas mientras el dueño
              duerme.
            </p>

            <p className="text-[#a09888] text-lg leading-relaxed">
              Mi objetivo es que puedas centrarte en lo que mejor sabes hacer
              mientras tu negocio trabaja por ti. Con años de experiencia, he
              ayudado a más de 50 empresas a dar el salto al mundo digital.
            </p>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-gold/5 hover:border-gold/15 transition-colors"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium text-[#f5f0e8]">
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
