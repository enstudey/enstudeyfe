"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 0);

    let showTimer: NodeJS.Timeout | undefined;

    try {
      const consent = localStorage.getItem("cookie_consent");
      if (consent !== "true") {
        showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }
    } catch (e) {
      console.error("Failed to read cookie_consent from localStorage:", e);
    }

    return () => {
      clearTimeout(mountTimer);
      if (showTimer) {
        clearTimeout(showTimer);
      }
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie_consent", "true");
      setIsVisible(false);
    } catch (e) {
      console.error("Failed to save cookie_consent to localStorage:", e);
      setIsVisible(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 p-5 rounded-2xl border border-card-border bg-card/95 backdrop-blur-md shadow-2xl max-w-sm w-[calc(100%-3rem)] transition-all duration-500 ease-in-out transform ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
          : "opacity-0 translate-y-10 scale-95 pointer-events-none"
      }`}
      data-testid="cookie-banner"
    >
      <div className="relative flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-sm">
            🍪
          </div>
          <span className="font-semibold text-foreground text-sm">Cookie & Quyền riêng tư</span>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
            aria-label="Đóng thông báo"
            data-testid="btn-close-cookie-banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed text-foreground/90 pr-1">
          Hello! Việc bạn cho phép EnStudey dùng một xíu Cookie 🍪 chính là cách &quot;tài trợ&quot; tuyệt vời để duy trì nền tảng này 100% miễn phí đó. Xem chi tiết tại{" "}
          <Link 
            href="/privacy-policy" 
            className="underline text-accent hover:opacity-80 font-medium transition-opacity"
            data-testid="link-privacy-policy"
          >
            Chính sách bảo mật
          </Link>{" "}
          nha!
        </p>

        {/* Action Button */}
        <div className="flex justify-end mt-1">
          <button
            onClick={handleAccept}
            className="px-5 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium transition hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
            data-testid="btn-accept-cookie"
          >
            Duyệt luôn 🎯
          </button>
        </div>
      </div>
    </div>
  );
}
