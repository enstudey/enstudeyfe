import type { Metadata } from "next";
import { Inter, Lora, Geist_Mono } from "next/font/google";
import { headers, cookies } from "next/headers";
import AdSenseScript from "@/components/AdSenseScript";
import GA4Provider from "@/components/analytics/GA4Provider";
import CookieBanner from "@/components/cookie-banner";
import ToastContainer from "@/components/toast/ToastContainer";
import BottomTabBar from "@/components/BottomTabBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin", "vietnamese"],
});

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora-serif",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "EnStudey - Luyện đề thi thử TOEIC & IELTS online miễn phí",
  description: "Hệ thống luyện đề thi thử TOEIC & IELTS online miễn phí có chấm điểm chi tiết, thống kê năng lực thích ứng và trợ lý AI giải thích đáp án thông minh.",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EnStudey - Luyện đề thi thử TOEIC & IELTS online miễn phí",
    description: "Hệ thống luyện đề thi thử TOEIC & IELTS online miễn phí có chấm điểm chi tiết, thống kê năng lực thích ứng và trợ lý AI giải thích đáp án thông minh.",
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
  const headersList = await headers();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const pathname = headersList.get("x-pathname") || "";
  const isIsolated =
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/login") ||
    pathname.includes("/exam/session/");
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Tích hợp Google AdSense Auto Ads có điều kiện lọc trang */}
        <AdSenseScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EnStudey",
              "alternateName": "EnStudey - Hệ thống luyện đề thi thử TOEIC & IELTS thích ứng",
              "url": "https://enstudey.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://enstudey.com/tra-cuu-tuyen-sinh?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
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
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 md:pb-0">
        <GA4Provider />
        <QueryProvider>
          <TooltipProvider>
            {!isIsolated && <Header token={token} />}
            {isIsolated ? (
              children
            ) : (
              <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 flex-grow flex flex-col">
                {children}
              </div>
            )}
            {!isIsolated && <Footer />}
          </TooltipProvider>
        </QueryProvider>
        <CookieBanner />
        <ToastContainer />
        {!isIsolated && <BottomTabBar />}
      </body>
    </html>
  );
}



