"use client";

import Image from "next/image";
import { generateStandardATLink } from "@/lib/affiliate";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface TikiAffiliateWidgetProps {
  productId: string;
  title: string;
  description?: string;
  priceRange?: string;
  imageUrl: string;
  rawProductUrl: string;
  ctaText?: string;
  trackingPage: string;
  badge?: string;
  className?: string;
}

export default function TikiAffiliateWidget({
  productId,
  title,
  description,
  priceRange,
  imageUrl,
  rawProductUrl,
  ctaText = "Mua trên Tiki",
  trackingPage,
  badge,
  className = "",
}: TikiAffiliateWidgetProps) {
  // Tạo link affiliate động qua ACCESSTRADE deep link
  const affiliateUrl = generateStandardATLink({
    rawProductUrl,
    articleId: productId,
    campaignId: "tiki",
    contentTag: trackingPage,
  });

  const handleClick = () => {
    trackAffiliateClick({
      productId,
      productName: title,
      sourcePage: trackingPage,
      subId: `enstudey_${trackingPage}_tiki`,
    });
  };

  return (
    <div
      className={`tiki-affiliate-card flex flex-col sm:flex-row items-center gap-4 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/40 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all duration-300 ${className}`}
      data-testid={`tiki-affiliate-${productId}`}
    >
      {/* Khung ảnh sản phẩm chống CLS */}
      <div className="relative w-24 h-28 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100 dark:border-zinc-800">
        <Image
          src={imageUrl}
          alt={title}
          width={96}
          height={112}
          loading="lazy"
          className="object-contain p-1"
        />
        {badge && (
          <span className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 bg-indigo-600 text-white rounded uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      {/* Nội dung sản phẩm */}
      <div className="flex-grow flex flex-col justify-between h-full space-y-2 text-center sm:text-left w-full">
        <div>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider block">
            Đề xuất bởi EnStudey • Tiki Trading
          </span>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug">
            {title}
          </h4>
          {priceRange && (
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              Giá tham khảo: {priceRange}
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="pt-2 sm:pt-1">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition duration-200 shadow-xs w-full sm:w-auto"
          >
            {ctaText} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
