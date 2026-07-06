"use client";

import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

interface Props {
  certType: "none" | "ielts" | "toeic";
  certScore: string;
}

export default function AffiliateCertWidget({ certType, certScore }: Props) {
  if (certType === "none" || !certScore) return null;

  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    product = products.find(p => p.category === "study" && p.tags?.includes(certType)) ?? null;
  } catch (error) {
    console.error("Error loading affiliate cert product:", error);
    return null;
  }

  if (!product) return null;

  const microCopy = certType === "ielts"
    ? "Muốn đổi IELTS thành điểm 10 đại học? Tham khảo bộ tài liệu này."
    : "Cải thiện điểm TOEIC để xét tuyển ĐH? Tham khảo sách luyện thi này.";

  return (
    <div
      className="w-full bg-amber-50/60 dark:bg-amber-955/10 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl p-4 flex items-center gap-4 mt-6"
      data-testid="affiliate-cert-widget"
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
        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 dark:text-white leading-snug truncate">
          {product.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
          {microCopy}
        </p>
      </div>
      <a
        href={`/go/${product.slug}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="flex-shrink-0 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 whitespace-nowrap"
      >
        Xem trên Shopee
      </a>
    </div>
  );
}
