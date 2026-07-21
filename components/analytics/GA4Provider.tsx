"use client";

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
  return null;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
