"use client";

import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

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
      product = products.find(p => p.category === "collection") ?? null;
    }
  } catch (error) {
    console.error("Error loading affiliate in-feed product:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="relative group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between"
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-550 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Gợi ý dành cho bạn
          </span>
          <h2 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
            {product.title}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            <span>Tài trợ</span>
          </div>
          <a
            href={`/go/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="text-xs font-bold text-orange-600 dark:text-orange-500 group-hover:underline"
          >
            {product.ctaLabel || "Xem trên Shopee"} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
