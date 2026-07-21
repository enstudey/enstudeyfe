"use client";

import { useEffect } from "react";
import { FEATURE_FLAGS } from "@/lib/config/features";
import { generateStandardATLink } from "@/lib/affiliate";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface AdSenseSlotProps {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  minHeight: string; // Bắt buộc để tránh Cumulative Layout Shift (CLS)
}

interface WindowWithAdSense extends Window {
  adsbygoogle?: Record<string, unknown>[];
}

export default function AdSenseSlot({
  slotId,
  format = "auto",
  className = "",
  minHeight,
}: AdSenseSlotProps) {
  useEffect(() => {
    if (FEATURE_FLAGS.ENABLE_ADSENSE) {
      try {
        const globalWindow = window as unknown as WindowWithAdSense;
        globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
        globalWindow.adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense slot push error:", e);
      }
    }
  }, []);

  const isVertical = format === "vertical" || slotId.includes("sidebar");

  // Fallback links & event trackings
  const tikiBooksUrl = generateStandardATLink({
    rawProductUrl: "https://tiki.vn/search?q=sach+luyen+thi+ielts+toeic",
    articleId: `fallback-${slotId}`,
    campaignId: "tiki",
    contentTag: "adsense-fallback",
  });

  const zaloGroupUrl = "https://zalo.me/g/enstudey_community"; // Mock Zalo Group link

  const handleTikiClick = () => {
    trackAffiliateClick({
      productId: `fallback-tiki-${slotId}`,
      productName: "Top Sách Luyện Thi IELTS/TOEIC Tiki Trading",
      sourcePage: `ad-fallback-${slotId}`,
      subId: `enstudey_fallback_${slotId}`,
    });
  };

  if (!FEATURE_FLAGS.ENABLE_ADSENSE) {
    if (isVertical) {
      return (
        <div
          className={`relative w-full border border-blue-100 dark:border-blue-950/40 bg-linear-to-b from-blue-50/50 to-blue-500/5 dark:from-zinc-900 dark:to-blue-950/10 rounded-3xl p-6 flex flex-col justify-between items-center text-center overflow-hidden group hover:shadow-md transition-all duration-300 ${className}`}
          style={{ minHeight }}
        >
          <div className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded uppercase tracking-wider">
            Tiki Partner
          </div>
          
          <div className="space-y-4 my-auto">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest block">
              Tủ Sách Sĩ Tử
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug max-w-[200px]">
              Top 10 Sách Luyện Thi TOEIC & IELTS Bán Chạy Nhất
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-[180px]">
              Cam kết chính hãng Tiki Trading, bọc sách bookcare miễn phí.
            </p>
          </div>

          <a
            href={tikiBooksUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={handleTikiClick}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition duration-200 shadow-xs uppercase tracking-wider"
          >
            Mua trên Tiki &rarr;
          </a>
        </div>
      );
    }

    // Horizontal / Native Fallback
    const isZaloAd = slotId.includes("end") || slotId.includes("calculator");

    if (isZaloAd) {
      return (
        <div
          className={`relative w-full border border-emerald-100 dark:border-emerald-950/40 bg-linear-to-r from-emerald-50/50 to-emerald-500/5 dark:from-zinc-900 dark:to-emerald-950/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-all duration-300 ${className}`}
          style={{ minHeight }}
        >
          <div className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded uppercase tracking-wider">
            Cộng Đồng
          </div>

          <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center text-2xl flex-shrink-0 mx-auto sm:mx-0">
              💬
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                Tham gia Cộng đồng Ôn thi EnStudey trên Zalo
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Nhận tài liệu đề thi PDF độc quyền miễn phí & giải đáp bài tập 24/7.
              </p>
            </div>
          </div>

          <a
            href={zaloGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition duration-200 whitespace-nowrap shadow-xs uppercase tracking-wider w-full sm:w-auto text-center"
          >
            Tham gia nhóm &rarr;
          </a>
        </div>
      );
    }

    return (
      <div
        className={`relative w-full border border-blue-100 dark:border-blue-950/40 bg-linear-to-r from-blue-50/50 to-blue-500/5 dark:from-zinc-900 dark:to-blue-950/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-all duration-300 ${className}`}
        style={{ minHeight }}
      >
        <div className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded uppercase tracking-wider">
          Tiki Partner
        </div>

        <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto">
          <div className="w-12 h-12 bg-blue-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0 mx-auto sm:mx-0">
            📚
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              Combo Sách Cambridge English IELTS 1-19 Mới Nhất
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Trọn bộ đề thi thử bản đẹp chính hãng 100% từ Tiki Trading.
            </p>
          </div>
        </div>

        <a
          href={tikiBooksUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={handleTikiClick}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition duration-200 whitespace-nowrap shadow-xs uppercase tracking-wider w-full sm:w-auto text-center"
        >
          Mua trên Tiki &rarr;
        </a>
      </div>
    );
  }

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXX";

  return (
    <div
      className={`ad-slot-container w-full overflow-hidden flex items-center justify-center bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200/50 dark:border-zinc-800/40 rounded-2xl relative ${className}`}
      style={{ minHeight }}
      data-testid="adsense-slot"
    >
      <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider text-slate-400 font-semibold select-none z-0">
        Liên kết tài trợ
      </span>
      <ins
        className="adsbygoogle w-full h-full z-10"
        style={{ display: "block" }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
