import type { Metadata } from "next";
import { Sora, Lora } from "next/font/google";
import "./globals.css";
import LS from "@/components/LS";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Quicli - Doctor Consultations on WhatsApp",
  description:
    "Quicli helps people get diagnosis, prescriptions, medicines, and lab tests through a simple WhatsApp-first flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${lora.variable}`}>
        <LS></LS>
        <main>{children}</main>
      </body>
    </html>
  );
}
