import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
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
  subsets: ["latin"],
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather-serif",
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
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 md:pb-0">
        <GA4Provider />
        <QueryProvider>
          <TooltipProvider>
            {!isIsolated && <Header token={token} />}
            {isIsolated ? (
              children
            ) : (
              <div className="w-full max-w-6xl mx-auto px-6 flex-grow flex flex-col">
                {children}
              </div>
            )}
            {!isIsolated && <Footer />}
          </TooltipProvider>
        </QueryProvider>
        <CookieBanner />
        <ToastContainer />
        <BottomTabBar />
      </body>
    </html>
  );
}



