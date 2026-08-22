import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Campus ERP — AI-Powered Campus Safety & Management",
  description:
    "An intelligent, all-in-one ERP platform for colleges and schools. Manage students, faculty, attendance, security, and campus operations with AI-driven insights.",
};

import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className={`${inter.className} antialiased bg-[#0e0e0e] text-[#f4f6d6] selection:bg-[#bf783e] selection:text-white transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
