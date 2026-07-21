"use client";

import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface Props {
  currentPage?: number;
  rowIndex?: number;
}

export default function AffiliateInFeedCard({ currentPage, rowIndex }: Props) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    if (currentPage && currentPage > 0) {
      const globalIndex = (currentPage - 1) * 3 + (rowIndex ?? 0);
      const index = globalIndex % products.length;
      product = products[index] ?? null;
    } else {
      product = products[0] ?? null;
    }
  } catch (error) {
    console.error("Error loading affiliate in-feed product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "infeed-affiliate-card",
      subId: `enstudey_${product.slug}`,
    });
  };

  return (
    <div
      className="relative group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between h-[350px] w-full"
      data-testid="affiliate-infeed-card"
    >
      <div className="h-44 overflow-hidden relative">
        <Image
          src={product.imagePath}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Gợi ý dành cho bạn
          </span>
          <h2 className="text-base font-bold text-foreground leading-snug line-clamp-1">
            {product.title}
          </h2>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Tài trợ</span>
          </div>
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="text-xs font-bold text-blue-600 group-hover:underline"
            onClick={handleClick}
          >
            {product.ctaLabel || "Tìm hiểu thêm"} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

