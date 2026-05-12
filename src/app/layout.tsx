import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Toni Real | Automatizo WhatsApp Business para Convertir Visitantes en Clientes",
  description:
    "Automatizo respuestas y convierto consultas en ventas mientras tú descansas. WhatsApp Business profesional, landing pages que convierten y automatización inteligente 24/7.",
  keywords: [
    "WhatsApp Business",
    "automatización",
    "chatbot",
    "ventas online",
    "landing pages",
    "Toni Real",
    "marketing digital",
  ],
  authors: [{ name: "Toni Real" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Toni Real | Automatizo WhatsApp Business",
    description:
      "Convierte visitantes en clientes las 24h con automatización inteligente de WhatsApp Business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
