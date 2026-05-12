"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const whatYouReceive = [
  {
    icon: "✕",
    title: "Los 3 errores críticos",
    desc: "Exactamente qué te está haciendo perder ventas cada día",
  },
  {
    icon: "💡",
    title: "Las 2 oportunidades ocultas",
    desc: "Técnicas que tus competidores ya usan y tú estás ignorando",
  },
  {
    icon: "✓",
    title: "Plan de acción personalizado",
    desc: "5 pasos exactos para convertir más consultas en ventas esta semana",
  },
];

export default function Auditoria() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    nombre: "",
    negocio: "",
    whatsapp: "",
    usaWhatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola Toni, quiero mi auditoría gratuita de WhatsApp Business.\n\nNombre: ${formData.nombre}\nNegocio: ${formData.negocio}\nWhatsApp: ${formData.whatsapp}\n¿Usas WhatsApp Business?: ${formData.usaWhatsapp}`;
    window.open(
      `https://wa.me/34667470862?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <section
      id="auditoria"
      ref={ref}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/15">
              <span className="text-xs font-medium text-gold-light tracking-wider">
                Sin coste · Sin compromiso
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Análisis de Oportunidades de tu{" "}
              <span className="text-gradient-gold">WhatsApp Business</span>
            </h2>

            <p className="text-[#a09888] text-lg leading-relaxed">
              En 24-48h recibirás un informe personalizado con{" "}
              <span className="text-gold font-medium">
                los 3 errores
              </span>{" "}
              que te están haciendo perder clientes,{" "}
              <span className="text-gold font-medium">
                las 2 oportunidades
              </span>{" "}
              que no estás aprovechando, y un{" "}
              <span className="text-gold font-medium">
                plan concreto de acción
              </span>{" "}
              para tu negocio.
            </p>

            {/* What you receive */}
            <div className="space-y-5">
              {whatYouReceive.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <span className="text-gold text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#f5f0e8] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[#a09888]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-[#686868] flex items-center gap-2">
              <span className="text-gold">💬</span> Recibirás el análisis por
              WhatsApp en 24-48h
            </p>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card-premium p-8 sm:p-10">
              <h3 className="font-display text-2xl font-bold mb-6 text-gradient-gold">
                Solicita tu análisis gratuito
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-[#a09888] mb-2">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan García"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-gold/10 focus:border-gold/30 focus:outline-none text-[#f5f0e8] placeholder:text-[#555] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a09888] mb-2">
                    Nombre del negocio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Clínica Dental Sonrisas"
                    value={formData.negocio}
                    onChange={(e) =>
                      setFormData({ ...formData, negocio: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-gold/10 focus:border-gold/30 focus:outline-none text-[#f5f0e8] placeholder:text-[#555] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a09888] mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-gold/10 focus:border-gold/30 focus:outline-none text-[#f5f0e8] placeholder:text-[#555] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a09888] mb-2">
                    ¿Usas WhatsApp Business actualmente?
                  </label>
                  <select
                    required
                    value={formData.usaWhatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, usaWhatsapp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-gold/10 focus:border-gold/30 focus:outline-none text-[#f5f0e8] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#1a1a1a]">
                      Selecciona una opción
                    </option>
                    <option value="No, uso WhatsApp normal" className="bg-[#1a1a1a]">
                      No, uso WhatsApp normal
                    </option>
                    <option value="Sí, pero básico (solo chat)" className="bg-[#1a1a1a]">
                      Sí, pero básico (solo chat)
                    </option>
                    <option value="Sí, con catálogo y respuestas" className="bg-[#1a1a1a]">
                      Sí, con catálogo y respuestas
                    </option>
                    <option value="No estoy seguro" className="bg-[#1a1a1a]">
                      No estoy seguro
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-premium btn-premium-gold justify-center mt-4"
                >
                  Solicitar mi análisis personalizado →
                </button>

                <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-[#686868]">
                  <span className="flex items-center gap-1">
                    <span className="text-gold">✓</span> Sin compromiso
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gold">⚡</span> Respuesta en 24-48h
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gold">🎯</span> Sin coste
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
