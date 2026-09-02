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
  title: "Toni Real | IA que devuelve tiempo a las personas",
  description:
    "Webs, automatizaciones e inteligencia artificial diseñadas para que tu negocio tenga menos ruido, más presencia y mejores conversaciones.",
  keywords: [
    "inteligencia artificial",
    "automatización con propósito",
    "WhatsApp Business",
    "webs que convierten",
    "Toni Real",
    "marketing digital",
  ],
  authors: [{ name: "Toni Real" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Toni Real | IA que devuelve tiempo a las personas",
    description:
      "Tecnología, diseño y estrategia al servicio de negocios más humanos.",
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
