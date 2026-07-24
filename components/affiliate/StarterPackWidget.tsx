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
      className={`w-full bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs ${className}`}
      data-testid="starter-pack-widget"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#F7F8FC] border border-[#E4E8F1] shrink-0">
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            sizes="100px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-extrabold text-[#3349D8] uppercase tracking-wider bg-[#EEF2FF] px-2 py-0.5 rounded">
              ⭐ Khuyên Dùng Bởi EnStudey
            </span>
            <span className="text-xs text-amber-500 font-bold">5.0 ★</span>
          </div>

          <h3 className="font-extrabold text-sm text-[#16213A] leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-[#5C667A] line-clamp-2 leading-relaxed max-w-xl">
            Giáo trình tự học TOEIC được đội ngũ EnStudey lựa chọn sát với cấu trúc đề thi ETS 2026 dành cho mục tiêu 500-750+.
          </p>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full sm:w-auto font-bold text-xs rounded-lg px-5 h-10 cursor-pointer shadow-xs bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-white shrink-0 transition-transform duration-150 active:scale-95 transform-gpu"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          Xem giáo trình khuyên dùng &rarr;
        </a>
      </Button>
    </div>
  );
}
