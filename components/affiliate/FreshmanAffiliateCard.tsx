"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface FreshmanAffiliateCardProps {
  className?: string;
}

export default function FreshmanAffiliateCard({
  className = "",
}: FreshmanAffiliateCardProps) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    // Ưu tiên các sản phẩm cho Tân sinh viên (Đèn học Rạng Đông / Sách Tiếng Anh / Combo Destination)
    product = products.find(p => p.id.includes("destination") || p.id.includes("rang-dong") || p.id.includes("pixar")) ?? products[0] ?? null;
  } catch (error) {
    console.error("Error loading freshman affiliate product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "freshman-affiliate-card",
      subId: `enstudey_${product.slug}`,
    });
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-emerald-50/60 via-indigo-50/60 to-emerald-50/60 dark:from-emerald-950/20 dark:to-indigo-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 my-6 ${className}`}
      data-testid="freshman-affiliate-card"
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
          <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
            🎓 Chào Tân Sinh Viên Tương Lai 2026
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
            {product.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">
            Gợi ý dành cho bạn: Trang bị giáo trình Tiếng Anh đầu vào Đại học & Đèn bàn LED chống cận chính hãng.
          </p>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full sm:w-auto font-bold text-xs rounded-xl px-6 py-2.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          {product.ctaLabel || "Xem trên Tiki"} &rarr;
        </a>
      </Button>
    </div>
  );
}
