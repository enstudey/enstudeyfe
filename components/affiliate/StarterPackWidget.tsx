"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface StarterPackWidgetProps {
  className?: string;
}

export default function StarterPackWidget({
  className = "",
}: StarterPackWidgetProps) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    product = products.find(p => p.id.includes("destination") || p.id.includes("ybm")) ?? products[0] ?? null;
  } catch (error) {
    console.error("Error loading starter pack affiliate product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "starter-pack-dashboard-widget",
      subId: `enstudey_${product.slug}`,
    });
  };

  return (
    <div
      className={`w-full bg-card border border-border rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition duration-300 ${className}`}
      data-testid="starter-pack-widget"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
          🎁 Góc Hành Trang Học Viên
        </span>
        <h3 className="font-extrabold text-base text-foreground leading-snug">
          EnStudey Starter Pack 2026
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          Bộ sưu tập giáo trình học tốt Tiếng Anh, đề thi thử chuẩn và thiết bị học tập tối ưu cho sĩ tử.
        </p>
      </div>

      <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
        <Image
          src={product.imagePath}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
      </div>

      <Button
        asChild
        size="lg"
        className="w-full font-bold text-xs rounded-xl py-3 cursor-pointer shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          Bỏ túi Combo Học Tập Dành Cho Sĩ Tử 🚀
        </a>
      </Button>
    </div>
  );
}
