"use client";

import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

export default function AffiliateSidebarWidget() {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    product = products.find(p => p.category === "collection") ?? null;
  } catch (error) {
    console.error("Error loading affiliate sidebar collection:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-4 shadow-sm"
      data-testid="affiliate-sidebar-widget"
    >
      <div className="w-full text-left">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
          Gợi ý dành cho bạn
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-950">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-1 w-full text-left">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
          {product.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <a
        href={`/go/${product.slug}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 text-center block"
      >
        {product.ctaLabel || "Xem trên Shopee"}
      </a>
    </div>
  );
}
