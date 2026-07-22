"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface MistakeBankAffiliateCardProps {
  category?: string;
  tag?: string;
  className?: string;
}

export default function MistakeBankAffiliateCard({
  category,
  tag,
  className = "",
}: MistakeBankAffiliateCardProps) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    const normalizedTag = (tag || category || "").toLowerCase();

    if (normalizedTag.includes("toeic")) {
      product = products.find(p => p.tags?.includes("toeic")) ?? null;
    } else if (normalizedTag.includes("ielts")) {
      product = products.find(p => p.tags?.includes("ielts")) ?? null;
    }

    if (!product) {
      product = products.find(p => p.category === "study") ?? products[0] ?? null;
    }
  } catch (error) {
    console.error("Error loading mistake bank affiliate product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "mistake-bank-aha-card",
      subId: `enstudey_${product.slug}`,
    });
  };

  const isToeic = (tag || category || "").toLowerCase().includes("toeic");
  const isIelts = (tag || category || "").toLowerCase().includes("ielts");

  const microCopy = isToeic
    ? "Gợi ý dành cho bạn: Tham khảo bộ sách ETS TOEIC / Hackers TOEIC chính hãng trên Tiki để ôn luyện kỹ hơn phần này nha."
    : isIelts
      ? "Gợi ý dành cho bạn: Sách đề thi Cambridge IELTS bản chuẩn bản quyền trên Tiki Trading."
      : "Gợi ý dành cho bạn: Tham khảo thêm bộ sách ôn luyện chính hãng để củng cố lỗ hổng kiến thức.";

  return (
    <div
      className={`w-full bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-2xs ${className}`}
      data-testid="mistake-bank-affiliate-card"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100 dark:border-zinc-800">
          <Image
            src={product.imagePath}
            alt={product.title}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Lỗ Hổng Kiến Thức • Gợi Ý Ôn Tập
          </p>
          <h4 className="font-extrabold text-slate-900 dark:text-white truncate text-xs">
            {product.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
            {microCopy}
          </p>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        className="shrink-0 font-bold text-xs rounded-lg px-3 py-1.5 cursor-pointer shadow-xs"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          {product.ctaLabel || "Xem trên Tiki"}
        </a>
      </Button>
    </div>
  );
}
