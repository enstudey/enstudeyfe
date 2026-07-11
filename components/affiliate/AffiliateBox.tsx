"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

export default function AffiliateBox() {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    product = products.find(p => p.category === "study") ?? null;
  } catch (error) {
    console.error("Error loading affiliate product:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="w-full bg-violet-50/40 border border-violet-500/10 rounded-2xl p-4 flex items-center gap-4 mb-6"
      data-testid="affiliate-box-study"
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 leading-snug truncate">
          {product.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
          {product.description}
        </p>
      </div>
      <Button
        asChild
        size="sm"
        className="flex-shrink-0 font-bold text-xs rounded-xl transition duration-200 whitespace-nowrap cursor-pointer shadow-xs"
        data-testid="affiliate-box-cta"
      >
        <a
          href={`/go/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
        >
          Xem trên Shopee
        </a>
      </Button>
    </div>
  );
}
