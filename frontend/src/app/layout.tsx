import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { LayoutWrapper } from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Kryptos | Secure AI Training",
  description: "Secure, encrypted medical data matching and AI training in AWS Nitro Enclaves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0e0e0e] text-[#e5e2e1] min-h-screen selection-custom overflow-x-hidden relative flex`}
      >
        {/* Asymmetrical Glows from Stitch */}
        <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-glow-orange pointer-events-none z-0 opacity-40"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-glow-grey pointer-events-none z-0 opacity-20"></div>
        
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e5e2e1",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
