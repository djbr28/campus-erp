import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Campus ERP — AI-Powered Campus Safety & Management",
  description:
    "An intelligent, all-in-one ERP platform for colleges and schools. Manage students, faculty, attendance, security, and campus operations with AI-driven insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
