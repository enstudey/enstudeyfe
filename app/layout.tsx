import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdSenseScript from "@/components/AdSenseScript";
import CookieBanner from "@/components/cookie-banner";
import ToastContainer from "@/components/toast/ToastContainer";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnStudey - Nền tảng học tập cá nhân hóa",
  description: "Chinh phục TOEIC & IELTS thông minh cùng trợ lý AI",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Tích hợp Google AdSense Auto Ads có điều kiện lọc trang */}
        <AdSenseScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <CookieBanner />
        <ToastContainer />
      </body>
    </html>
  );
}


