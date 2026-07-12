"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface Props {
  currentPage?: number;
  seed?: string;
}

export default function AffiliateSidebarWidget({ currentPage, seed }: Props) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    if (currentPage && currentPage > 0) {
      // Chọn sản phẩm modulo theo trang
      const index = (currentPage - 1) % products.length;
      product = products[index] ?? null;
    } else if (seed) {
      // Hash seed (slug) để hiển thị sản phẩm cố định cho bài viết cụ thể
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % products.length;
      product = products[index] ?? null;
    } else {
      product = products[0] ?? null;
    }
  } catch (error) {
    console.error("Error loading affiliate sidebar product:", error);
    return null;
  }

  if (!product) return null;

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "sidebar-affiliate-widget",
      subId: `enstudey_${product.slug}`,
    });
  };

  return (
    <div
      className="w-full bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center space-y-4 shadow-sm"
      data-testid="affiliate-sidebar-widget"
    >
      <div className="w-full text-left">
        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
          Gợi ý dành cho bạn
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-1 w-full text-left">
        <h4 className="font-bold text-sm text-slate-900 leading-snug">
          {product.title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <Button
        asChild
        className="w-full h-11 font-bold rounded-xl transition duration-200 cursor-pointer shadow-xs"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          {product.ctaLabel || "Xem thêm"}
        </a>
      </Button>
    </div>
  );
}

