"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

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

  const redirectUrl = `/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`;

  const handleClick = () => {
    if (!product) return;
    trackAffiliateClick({
      productId: product.id,
      productName: product.title,
      sourcePage: "cert-affiliate-widget",
      subId: `enstudey_${product.slug}`,
    });
  };

  const microCopy = certType === "ielts"
    ? "Muốn đổi IELTS thành điểm 10 đại học? Tham khảo bộ tài liệu này."
    : "Cải thiện điểm TOEIC để xét tuyển ĐH? Tham khảo sách luyện thi này.";

  return (
    <div
      className="w-full bg-sky-50/40 border border-sky-500/10 rounded-2xl p-4 flex items-center gap-4 mt-6"
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
        <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 leading-snug truncate">
          {product.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
          {microCopy}
        </p>
      </div>
      <Button
        asChild
        size="sm"
        className="flex-shrink-0 font-bold text-xs rounded-xl transition duration-200 whitespace-nowrap cursor-pointer shadow-xs"
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          onClick={handleClick}
        >
          {product.ctaLabel || "Xem chi tiết"}
        </a>
      </Button>
    </div>
  );
}

