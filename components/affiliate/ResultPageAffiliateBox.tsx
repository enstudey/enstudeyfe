"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface ResultPageAffiliateBoxProps {
  testType?: string;
  score?: number;
  className?: string;
}

export default function ResultPageAffiliateBox({
  testType = "general",
  className = "",
}: ResultPageAffiliateBoxProps) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    const norm = testType.toLowerCase();

    if (norm.includes("listening") || norm.includes("audio")) {
      product = products.find(p => p.category === "dorm") ?? products[0] ?? null;
    } else if (norm.includes("ielts")) {
      product = products.find(p => p.tags?.includes("ielts")) ?? null;
    } else if (norm.includes("toeic")) {
      product = products.find(p => p.tags?.includes("toeic")) ?? null;
    }

    if (!product) {
      product = products.find(p => p.category === "study") ?? products[0] ?? null;
    }
  } catch (error) {
    console.error("Error loading result page affiliate product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "result-page-affiliate-box",
      subId: `enstudey_${product.slug}`,
    });
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 my-6 ${className}`}
      data-testid="result-page-affiliate-box"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-100 dark:border-zinc-800 p-1">
          <Image
            src={product.imagePath}
            alt={product.title}
            width={64}
            height={64}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100/60 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
            🚀 Hành trang bứt phá Band điểm
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
            {product.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">
            {product.description}
          </p>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full sm:w-auto font-bold text-xs rounded-xl px-6 py-2.5 shrink-0 shadow-xs cursor-pointer"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          {product.ctaLabel || "Khám phá ngay"} &rarr;
        </a>
      </Button>
    </div>
  );
}
