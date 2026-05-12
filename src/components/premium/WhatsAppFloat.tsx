"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const quickOptions = [
  { emoji: "💬", label: "Automatizar mi WhatsApp", msg: "Hola Toni, quiero automatizar mi WhatsApp Business" },
  { emoji: "🌐", label: "Landing Page profesional", msg: "Hola Toni, me interesa una landing page que convierta" },
  { emoji: "🤖", label: "Chatbot con IA", msg: "Hola Toni, quiero un chatbot inteligente para mi negocio" },
  { emoji: "📊", label: "Auditoría gratuita", msg: "Hola Toni, quiero mi auditoría gratuita de WhatsApp" },
  { emoji: "📦", label: "Catálogo de productos", msg: "Hola Toni, necesito configurar un catálogo en WhatsApp" },
  { emoji: "🚀", label: "Escalar mis ventas", msg: "Hola Toni, quiero escalar ventas con automatización" },
];

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedOption(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleSend = () => {
    const msg = message.trim() || "Hola Toni, me interesa saber más sobre tus servicios";
    window.open(`https://wa.me/34667470862?text=${encodeURIComponent(msg)}`, "_blank");
    setIsOpen(false);
    setMessage("");
    setSelectedOption(null);
  };

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    setSelectedOption(option.label);
    setMessage(option.msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const goBack = () => {
    setSelectedOption(null);
    setMessage("");
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-7 right-7 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-gold/10"
          >
            {/* Header - WhatsApp Business style */}
            <div className="relative px-5 py-4 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)" }}
            >
              {/* Decorative gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #cda862, transparent)" }}
              />

              <button
                onClick={() => { setIsOpen(false); setSelectedOption(null); }}
                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image
                    src="/perfil_web.jpg"
                    alt="Toni Real"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-bold text-sm truncate">Toni Real</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase"
                    style={{ background: "rgba(205,168,98,0.25)", color: "#e8d5a3" }}
                  >
                    Business
                  </span>
                </div>
                <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                  {selectedOption ? selectedOption : "En línea · Responde ahora"}
                </p>
              </div>
            </div>

            {/* Chat body */}
            <div
              className="p-4 space-y-3 overflow-y-auto"
              style={{
                maxHeight: selectedOption ? "200px" : "340px",
                backgroundColor: "#0b141a",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              <AnimatePresence mode="wait">
                {!selectedOption ? (
                  /* Main menu - Business options */
                  <motion.div
                    key="options"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {/* Welcome message */}
                    <div className="flex justify-start">
                      <div
                        className="rounded-xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm"
                        style={{ background: "#1f2c34", color: "#e9edef" }}
                      >
                        <p className="text-[13px] leading-relaxed">
                          Bienvenido a Toni Real Business
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span className="text-[11px] text-[#8696a0]">La comunicación es cifrada de extremo a extremo</span>
                        </div>
                      </div>
                    </div>

                    {/* Bot message */}
                    <div className="flex justify-start">
                      <div
                        className="rounded-xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm"
                        style={{ background: "#1f2c34", color: "#e9edef" }}
                      >
                        <p className="text-[13px] leading-relaxed">
                          Soy Toni Real, experto en automatización de WhatsApp Business. ¿En qué te puedo ayudar hoy?
                        </p>
                        <span className="text-[10px] text-[#667781] mt-1.5 block text-right">
                          {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Quick options grid */}
                    <div className="pt-2">
                      <p className="text-[11px] text-[#8696a0] text-center uppercase tracking-wider mb-3 font-medium">
                        Selecciona una opción
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickOptions.map((option, i) => (
                          <motion.button
                            key={option.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            onClick={() => handleQuickOption(option)}
                            className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                              background: "linear-gradient(135deg, rgba(205,168,98,0.08) 0%, rgba(205,168,98,0.03) 100%)",
                              border: "1px solid rgba(205,168,98,0.12)",
                            }}
                          >
                            <span className="text-lg flex-shrink-0">{option.emoji}</span>
                            <span className="text-[12px] font-medium text-[#e9edef] leading-tight">
                              {option.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Selected option - show confirmation */
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {/* User message (simulated) */}
                    <div className="flex justify-end">
                      <div
                        className="rounded-xl rounded-tr-none px-4 py-2.5 max-w-[80%] shadow-sm"
                        style={{ background: "#005c4b", color: "#e9edef" }}
                      >
                        <p className="text-[13px]">{message}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-[#8696a0]">
                            {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#53bdeb">
                            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Bot reply */}
                    <div className="flex justify-start">
                      <div
                        className="rounded-xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-sm"
                        style={{ background: "#1f2c34", color: "#e9edef" }}
                      >
                        <p className="text-[13px] leading-relaxed">
                          Perfecto, te voy a ayudar con eso. Al hacer clic en enviar, abriré WhatsApp para que podamos hablar directamente. ¡Te respondo al instante!
                        </p>
                        <span className="text-[10px] text-[#667781] mt-1.5 block text-right">
                          {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ backgroundColor: "#1a2731", borderTop: "1px solid rgba(205,168,98,0.08)" }}
            >
              {/* Back button */}
              {selectedOption && (
                <button
                  onClick={goBack}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#8696a0] hover:text-[#e9edef] hover:bg-white/5 transition-all flex-shrink-0"
                  aria-label="Volver"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 rounded-full text-[13px] text-[#e9edef] placeholder:text-[#667781] focus:outline-none"
                style={{ backgroundColor: "#2a3942" }}
                autoFocus={isOpen}
              />

              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #cda862, #b48b3c)",
                  boxShadow: "0 2px 12px rgba(205,168,98,0.3)",
                }}
                aria-label="Enviar mensaje"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#050505">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float button - PNG icon with golden glow */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300"
      >
        {/* Golden glow layers behind the button */}
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(205,168,98,0.5) 0%, rgba(205,168,98,0.15) 50%, transparent 70%)", filter: "blur(12px)" }}
        />
        <div className="absolute -inset-3 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(205,168,98,0.2) 0%, transparent 70%)" }}
        />
        <div className="absolute -inset-6 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(205,168,98,0.1) 0%, transparent 60%)" }}
        />

        {/* The PNG image */}
        <img
          src="/whatsapp_dorado.png"
          alt="WhatsApp"
          className="relative w-12 h-12 drop-shadow-[0_0_10px_rgba(205,168,98,0.6)]"
        />

        {/* Ping ring */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ border: "2px solid rgba(205,168,98,0.25)" }}
          />
        )}
      </motion.button>
    </div>
  );
}
