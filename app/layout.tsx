import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import AdSenseScript from "@/components/AdSenseScript";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieBanner from "@/components/cookie-banner";
import ToastContainer from "@/components/toast/ToastContainer";
import AppShell from "@/components/AppShell";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora-serif",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "EnStudey - Nền tảng Luyện thi TOEIC Online chuẩn ETS (Reading & Listening)",
  description: "Hệ thống luyện đề thi thử TOEIC Reading & Listening online miễn phí chuẩn cấu trúc ETS 2026 có chấm điểm tức thì, thống kê năng lực 500-750+ và AI giải thích chi tiết.",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EnStudey - Nền tảng Luyện thi TOEIC Online chuẩn ETS",
    description: "Hệ thống luyện đề thi thử TOEIC Reading & Listening online miễn phí chuẩn cấu trúc ETS 2026 có chấm điểm tức thì, thống kê năng lực 500-750+ và AI giải thích chi tiết.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="tikiaff-domain-verification" content="e5c63657b4f07e7902f7c15c088fd738dd1de8588b6ad035c495f17b35d59f4f" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 md:pb-0">
        <AdSenseScript />
        <Script
          id="schema-ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EnStudey",
              "alternateName": "EnStudey - Nền tảng Luyện thi TOEIC Online chuẩn ETS",
              "url": "https://enstudey.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://enstudey.com/tra-cuu-tuyen-sinh?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          id="console-debug-filter"
          strategy="beforeInteractive"
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
        <QueryProvider>
          <TooltipProvider>
            <AppShell token={token}>{children}</AppShell>
          </TooltipProvider>
        </QueryProvider>
        <CookieBanner />
        <ToastContainer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXX"} />
      </body>
    </html>
  );
}
