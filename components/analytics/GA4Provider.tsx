"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function trackAffiliateClick(params: {
  productId: string;
  productName: string;
  sourcePage: string;
  subId: string;
}) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "affiliate_click", {
    product_id: params.productId,
    product_name: params.productName,
    source_page: params.sourcePage,
    sub_id: params.subId,
  });
}

export default function GA4Provider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
