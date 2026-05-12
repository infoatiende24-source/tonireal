"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Isaac González Nieto",
    role: "Electricista · Andorra",
    text: "Desde que Toni me automatizó todo el sistema de WhatsApp Business, no pierdo ni una sola consulta. Me ha montado la web completa, el catálogo de servicios y las respuestas automáticas. Ahora mis clientes me escriben a cualquier hora y reciben respuesta al instante. Mi negocio ha crecido un 40% en solo 3 meses. Totalmente recomendable.",
    stars: 5,
  },
  {
    name: "Laura Martínez Ruiz",
    role: "Clínica Dental · Barcelona",
    text: "Antes perdíamos pacientes porque no podíamos contestar los WhatsApp durante las horas de consulta. Toni nos instaló un chatbot inteligente que programa citas, envía recordatorios y responde las dudas más frecuentes. Hemos reducido las citas no asistidas a prácticamente cero. Es una inversión que se paga sola.",
    stars: 5,
  },
  {
    name: "Carlos Fernández López",
    role: "Inmobiliaria · Madrid",
    text: "Llevaba años perdiendo clientes por no dar respuesta rápida a los WhatsApp. Toni me explicó que cada minuto sin contestar era dinero perdido, y tenía razón. Ahora tengo un sistema automatizado que clasifica leads, envía fichas de propiedades y programa visitas automáticamente. Mi cierre de ventas ha subido un 60%.",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`star-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e8d5a3" />
              <stop offset="0.5" stopColor="#cda862" />
              <stop offset="1" stopColor="#b48b3c" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#star-${i})`}
          />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonios" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0908] to-[#050505]" />

      {/* Subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Lo que dicen <span className="text-gradient-gold">mis clientes</span>
          </h2>
          <p className="text-[#a09888] text-lg max-w-2xl mx-auto">
            Resultados reales de negocios que ya automatizan su WhatsApp
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="card-premium group flex flex-col"
            >
              {/* Stars */}
              <div className="mb-4">
                <StarRating count={testimonial.stars} />
              </div>

              {/* Quote text */}
              <p className="text-[#b0a898] text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gold/5">
                {/* Avatar placeholder with initials */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(205,168,98,0.15) 0%, rgba(180,139,60,0.08) 100%)",
                    border: "1px solid rgba(205,168,98,0.15)",
                    color: "#cda862",
                  }}
                >
                  {testimonial.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0e8] text-sm group-hover:text-gold-light transition-colors">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#686868]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
