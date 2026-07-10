"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const DISABLED_PATHS = [
  "/gioi-thieu",
  "/privacy-policy",
  "/terms-of-service",
  "/tram-sac-nang-luong"
];

export default function AdSenseScript() {
  const pathname = usePathname();

  // Kiểm tra xem trang hiện tại có nằm trong danh sách tắt Ads không
  const isAdsDisabled = DISABLED_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));

  if (isAdsDisabled) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXX"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
