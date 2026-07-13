import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdSenseScript from "@/components/AdSenseScript";
import GA4Provider from "@/components/analytics/GA4Provider";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "EnStudey - Nền tảng học tập cá nhân hóa",
  description: "Chinh phục TOEIC & IELTS thông minh cùng trợ lý AI",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EnStudey - Nền tảng học tập cá nhân hóa",
    description: "Chinh phục TOEIC & IELTS thông minh cùng trợ lý AI",
    images: [
      {
        url: "/icon-transparent.png",
        width: 512,
        height: 512,
        alt: "EnStudey logo",
      },
    ],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const appEnv = "${process.env.NEXT_PUBLIC_APP_ENV || 'production'}";
                  const isDebug = appEnv === "debug" || (window.localStorage && window.localStorage.getItem("debug") === "true");
                  if (!isDebug) {
                    const noop = function() {};
                    console.log = noop;
                    console.warn = noop;
                    console.error = noop;
                    console.info = noop;
                    console.debug = noop;
                    console.trace = noop;
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GA4Provider />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <CookieBanner />
        <ToastContainer />
      </body>
    </html>
  );
}



