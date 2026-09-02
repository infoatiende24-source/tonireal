"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.();
      if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      try {
        screen.orientation.lock("landscape").catch(() => {});
      } catch {
        // orientation lock not supported
      }
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Cinematic vignette */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none z-10" />

      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content - On mobile appears second */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20"
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gold-light tracking-wider uppercase">
                Tecnología al servicio de las personas
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gradient-silver">IA que devuelve</span>{" "}
              <span className="text-gradient-gold">tiempo a las personas</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-[#a09888] leading-relaxed max-w-xl"
            >
              No creo sistemas para sustituir a las personas. Diseño webs,
              automatizaciones e inteligencia artificial para que tu negocio
              atienda mejor, gane claridad y tú puedas volver a centrarte en lo
              que importa.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://wa.me/34667470862?text=Hola%20Toni,%20quiero%20automatizar%20mi%20WhatsApp"
                target="blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                {/* Golden glow behind button */}
                <div className="absolute -inset-3 bg-gold/25 rounded-full blur-xl opacity-60 group-hover:opacity-100 group-hover:-inset-4 transition-all duration-500" />
                <div className="relative flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-[#cda862] to-[#b48b3c] shadow-[0_4px_30px_rgba(205,168,98,0.3)] group-hover:shadow-[0_8px_50px_rgba(205,168,98,0.5)] transition-all duration-500 group-hover:-translate-y-1">
                  <img
                    src="/whatsapp_dorado.png"
                    alt="WhatsApp"
                    className="w-6 h-6 drop-shadow-[0_0_8px_rgba(205,168,98,0.8)]"
                  />
                  <span className="font-semibold text-[#050505] text-sm sm:text-base tracking-wide">
                    Hablemos de tu negocio
                  </span>
                </div>
              </a>
              <a href="#filosofia" className="btn-premium btn-premium-outline">
                Conocer mi enfoque
              </a>
            </motion.div>
          </div>

          {/* Right - Video - On mobile appears first */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0"
          >
            <div className="video-frame-premium" style={{ animation: "float 6s ease-in-out infinite, rotate-border 8s ease infinite" }}>
              <div className="relative w-[280px] sm:w-[300px] rounded-[37px] overflow-hidden bg-[#0d0d0d] aspect-[9/16]">
                {/* Play overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/90 flex items-center justify-center glow-gold-strong transition-transform duration-300 group-hover:scale-110">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="#050505"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="mt-4 text-sm text-gold-light font-medium tracking-wide">
                      Toca para ver el video
                    </span>
                  </button>
                )}

                {/* Video */}
                <video
                  ref={videoRef}
                  id="heroVideo"
                  className="w-full h-full object-cover"
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  poster="/Gemini_Generated_Image_i49obli49obli49o7.jpg"
                  controls
                >
                  <source
                    src="https://z-cdn-media.chatglm.cn/files/71baf600-0d4b-40d9-8a90-5d37cbce2917.mp4?auth_key=1805807449-c5cc95f9cbd840dda807f7cd6bb09527-0-f61f8fcc9f48c065678b357873571f57"
                    type="video/mp4"
                  />
                </video>

                {/* Controls bar */}
                {isPlaying && !isFullscreen && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={togglePlay}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 cinematic-line" />
    </section>
  );
}
