"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* Gold gradient SVG icons for each service */
const GoldIconWhatsApp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="iconWA" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="url(#iconWA)" />
  </svg>
);

const GoldIconGlobe = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="iconGlobe" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#iconGlobe)" strokeWidth="1.5" fill="none" />
    <ellipse cx="12" cy="12" rx="4" ry="10" stroke="url(#iconGlobe)" strokeWidth="1.5" fill="none" />
    <path d="M2 12h20M2 7h20M2 17h20" stroke="url(#iconGlobe)" strokeWidth="1" opacity="0.5" />
  </svg>
);

const GoldIconRobot = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="iconBot" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e8d5a3" />
        <stop offset="0.5" stopColor="#cda862" />
        <stop offset="1" stopColor="#b48b3c" />
      </linearGradient>
    </defs>
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="url(#iconBot)" strokeWidth="1.5" fill="none" />
    <path d="M8 15h.01M12 15h.01M16 15h.01" stroke="url(#iconBot)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="5" r="3" stroke="url(#iconBot)" strokeWidth="1.5" fill="none" />
    <path d="M12 8v3M3 14v2M21 14v2" stroke="url(#iconBot)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const services = [
  {
    icon: <GoldIconWhatsApp />,
    title: "WhatsApp Business Profesional",
    desc: "Convierte tu WhatsApp en una máquina de ventas 24/7. Catálogo, respuestas automáticas y sistema de seguimiento que trabaja mientras tú descansas.",
    features: [
      "Configuración completa en 48h",
      "Catálogo de productos/servicios",
      "Respuestas automáticas inteligentes",
      "Sistema de etiquetado de clientes",
      "Plantillas de mensajes que venden",
    ],
    featured: false,
  },
  {
    icon: <GoldIconGlobe />,
    title: "Landing Pages que Convierten",
    desc: "Páginas web diseñadas con un único objetivo: que el visitante te escriba por WhatsApp. Cada elemento está optimizado para generar la acción.",
    features: [
      "Diseño premium personalizado",
      "Botón WhatsApp estratégico",
      "100% optimizada para móvil",
      "Formulario que captura leads",
      "SEO básico incluido",
    ],
    featured: false,
  },
  {
    icon: <GoldIconRobot />,
    title: "Automatización Inteligente 24/7",
    desc: "Respuestas instantáneas, seguimiento automático de clientes y campañas que se ejecutan solas. Tu negocio nunca duerme.",
    features: [
      "Chatbot con IA conversacional",
      "Respuestas en menos de 15 segundos",
      "Seguimiento automático de leads",
      "Campañas programadas",
      "Integración con CRM",
    ],
    featured: true,
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicios" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Soluciones que <span className="text-gradient-gold">Transforman</span> tu Negocio
          </h2>
          <p className="text-[#a09888] text-lg max-w-2xl mx-auto">
            Diseñadas para convertir más consultas en ventas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`card-premium group ${
                service.featured
                  ? "md:col-span-2 lg:col-span-1 border-gold/20 bg-gradient-to-br from-gold/[0.05] to-transparent"
                  : ""
              }`}
            >
              {service.featured && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-4">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  <span className="text-xs text-gold font-medium tracking-wider uppercase">
                    Más popular
                  </span>
                </div>
              )}

              {/* Icon with gold glow */}
              <div className="w-14 h-14 rounded-2xl bg-gold/[0.08] flex items-center justify-center mb-6 group-hover:bg-gold/[0.15] transition-all duration-500"
                style={{ boxShadow: "inset 0 0 20px rgba(205,168,98,0.05)" }}
              >
                {service.icon}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 text-[#f5f0e8] group-hover:text-gold-light transition-colors">
                {service.title}
              </h3>

              <p className="text-[#a09888] text-sm leading-relaxed mb-6">
                {service.desc}
              </p>

              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-[#888]"
                  >
                    <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs">✓</span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/34667470862?text=Hola%20Toni,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20${encodeURIComponent(service.title)}"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-sm text-gold hover:text-gold-light transition-colors font-medium group/link"
              >
                Saber más
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transform group-hover/link:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
