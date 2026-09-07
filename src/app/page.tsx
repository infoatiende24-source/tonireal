import Navbar from "@/components/premium/Navbar";
import Hero from "@/components/premium/Hero";
import Stats from "@/components/premium/Stats";
import Auditoria from "@/components/premium/Auditoria";
import Services from "@/components/premium/Services";
import About from "@/components/premium/About";
import Process from "@/components/premium/Process";
import Testimonials from "@/components/premium/Testimonials";
import CTASection from "@/components/premium/CTA";
import Contact from "@/components/premium/Contact";
import Footer from "@/components/premium/Footer";
import WhatsAppFloat from "@/components/premium/WhatsAppFloat";
import CinematicIntro from "@/components/premium/CinematicIntro";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] noise-overlay">
      <CinematicIntro />
      <Navbar />
      <Hero />
      <Stats />
      <Auditoria />
      <Services />
      <About />
      <Process />
      <Testimonials />
      <CTASection />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
