"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useDonateStatus } from "./use-donate-status";

export default function DonateSection() {
  const { isAvailable, loading, config } = useDonateStatus();
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Nếu đang load hoặc không khả dụng (do lỗi ảnh / lỗi API), không hiển thị toàn bộ section
  if (loading || !isAvailable || !config) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config.account_no);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Lỗi khi sao chép số tài khoản:", err);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollAmount = 240; // Khoảng cách cuộn mỗi lần click

      if (direction === "right") {
        // Nếu đã cuộn đến sát mép bên phải, quay về vị trí đầu tiên bên trái
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        if (isAtEnd) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        // Nếu đã ở sát mép bên trái, nhảy nhanh đến vị trí cuối cùng bên phải
        const isAtStart = scrollLeft <= 10;
        if (isAtStart) {
          scrollContainerRef.current.scrollTo({
            left: scrollWidth - clientWidth,
            behavior: "smooth",
          });
        } else {
          scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section
      className="mt-8 pt-8 border-t border-slate-200 dark:border-zinc-800 space-y-6"
      data-testid="donate-section"
    >
      <div className="bg-orange-50/30 dark:bg-zinc-900/20 border border-orange-500/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Thư ngỏ */}
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
            Tiếp sức cho EnStudey ☕🚀
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Toàn bộ tính năng trên EnStudey được xây dựng và duy trì hoàn toàn miễn phí. Nếu công cụ này giúp bạn tiết kiệm thời gian hoặc gỡ rối mùa thi, bạn có thể &quot;tiếp sức&quot; cho mình một ly trà sữa qua mã QR bên cạnh nha! Mọi sự ủng hộ sẽ được nạp thẳng vào quỹ duy trì máy chủ để trang web tiếp tục hoạt động miễn phí cho các thế hệ sau. Cảm ơn bạn rất nhiều! ✨
          </p>

          {/* Hộp thông tin chuyển khoản */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-4 rounded-2xl text-xs space-y-2 max-w-sm shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-zinc-500">Ngân hàng</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                {config.bank_name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-zinc-500">Chủ tài khoản</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                {config.account_name}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100 dark:border-zinc-850/60">
              <span className="text-slate-400 dark:text-zinc-500">Số tài khoản</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-orange-600 dark:text-orange-500">
                  {config.account_no}
                </span>
                <button
                  onClick={handleCopy}
                  data-testid="btn-copy-section"
                  className="px-2.5 py-1 bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 font-bold rounded-lg text-[10px] cursor-pointer transition-colors"
                >
                  {copied ? "Đã chép ✓" : "Sao chép 📋"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mã QR */}
        <div className="w-44 h-44 relative border-4 border-dashed border-orange-500/20 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
          <Image
            src={config.qr_template_url}
            alt="Mã QR chuyển khoản ủng hộ VietQR"
            fill
            sizes="(max-width: 176px) 100vw, 176px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Bảng vinh danh */}
      {config.donors && config.donors.length > 0 && (
        <div className="space-y-3" data-testid="donor-board">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Những trạm sạc năng lượng của EnStudey 🔋✨
            </h3>
            {/* 2 nút cuộn trái / phải */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleScroll("left")}
                className="w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer text-slate-600 dark:text-zinc-400 active:scale-95"
                aria-label="Cuộn sang trái"
              >
                &larr;
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer text-slate-600 dark:text-zinc-400 active:scale-95"
                aria-label="Cuộn sang phải"
              >
                &rarr;
              </button>
            </div>
          </div>
          <div className="relative w-full">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none snap-x scroll-smooth"
            >
              {config.donors.map((donor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/80 p-3.5 rounded-2xl shrink-0 w-48 space-y-1.5 snap-start shadow-2xs hover:border-orange-500/20 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200 truncate pr-1">
                      {donor.name}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-md shrink-0">
                      {donor.amount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-2 leading-snug">
                    &ldquo;{donor.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
