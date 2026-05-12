"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const contacts = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    title: "WhatsApp",
    detail: "Respuesta inmediata",
    value: "+34 667 470 862",
    href: "https://wa.me/34667470862?text=Hola%20Toni,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20tus%20servicios",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    title: "Email",
    detail: "Respuesta en 24h",
    value: "infoatiende24@gmail.com",
    href: "mailto:infoatiende24@gmail.com",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contacto" ref={ref} className="relative py-32 sm:py-40 overflow-hidden">
      {/* === FUSED BACKGROUND IMAGE === */}
      <div className="absolute inset-0">
        {/* The photo as full-section background */}
        <Image
          src="/Gemini_Generated_Image_i49obli49obli49o7.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        {/* Multi-layer gradient to fuse with the dark web */}
        {/* Top fade - blends from section above (#050505) into the image */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.85) 15%, rgba(5,5,5,0.5) 35%, rgba(5,5,5,0.15) 50%, rgba(5,5,5,0.3) 70%, rgba(5,5,5,0.7) 85%, #0a0a0a 100%)",
          }}
        />

        {/* Gold accent wash */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(205,168,98,0.5), transparent 70%)",
          }}
        />

        {/* Cinematic vignette */}
        <div className="absolute inset-0 cinematic-vignette" />

        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content over the fused background */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 space-y-5"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f0e8]">
            ¿<span className="text-gradient-gold">Hablamos</span>?
          </h2>
          <p className="text-[#a09888]/90 text-lg max-w-xl mx-auto">
            Estoy aquí para ayudarte a hacer crecer tu negocio con resultados reales desde el primer día
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-5 max-w-2xl mx-auto mb-10"
        >
          {contacts.map((contact, i) => (
            <motion.a
              key={contact.title}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="flex-1 p-6 rounded-2xl text-center group transition-all duration-500 hover:-translate-y-1"
              style={{
                background: "rgba(5,5,5,0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(205,168,98,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(205,168,98,0.12) 0%, rgba(180,139,60,0.06) 100%)",
                  border: "1px solid rgba(205,168,98,0.1)",
                }}
              >
                {contact.icon}
              </div>
              <h3 className="font-display text-lg font-bold mb-1 text-[#f5f0e8] group-hover:text-gold-light transition-colors">
                {contact.title}
              </h3>
              <p className="text-xs text-[#a09888]/70 mb-2">{contact.detail}</p>
              <p className="text-gold font-medium text-sm">{contact.value}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <a
            href="https://wa.me/34667470862?text=Hola%20Toni,%20quiero%20dejar%20de%20perder%20ventas"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm text-[#050505] transition-all duration-500 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #cda862, #b48b3c)",
              boxShadow: "0 4px 30px rgba(205,168,98,0.3), 0 0 80px rgba(205,168,98,0.1)",
            }}
          >
            <img src="/whatsapp_dorado.png" alt="WhatsApp" className="w-5 h-5 drop-shadow-[0_0_4px_rgba(205,168,98,0.6)]" />
            Empieza ahora
          </a>
        </motion.div>

        {/* Bottom gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-24 h-[1px] mx-auto mt-14"
          style={{ background: "linear-gradient(90deg, transparent, rgba(205,168,98,0.4), transparent)" }}
        />
      </div>
    </section>
  );
}
