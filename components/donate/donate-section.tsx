"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
      className="mt-8 pt-8 border-t border-slate-200 space-y-6"
      data-testid="donate-section"
    >
      <div className="bg-violet-50/30 border border-violet-500/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Thư ngỏ */}
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-bold text-slate-955 flex items-center gap-2">
            Tiếp sức cho EnStudey ☕🚀
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Toàn bộ tính năng trên EnStudey được xây dựng và duy trì hoàn toàn miễn phí. Nếu công cụ này giúp bạn tiết kiệm thời gian hoặc gỡ rối mùa thi, bạn có thể &quot;tiếp sức&quot; cho mình một ly trà sữa qua mã QR bên cạnh nha! Mọi sự ủng hộ sẽ được nạp thẳng vào quỹ duy trì máy chủ để trang web tiếp tục hoạt động miễn phí cho các thế hệ sau. Cảm ơn bạn rất nhiều! ✨
          </p>

          {/* Hộp thông tin chuyển khoản */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl text-xs space-y-2 max-w-sm shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Ngân hàng</span>
              <span className="font-bold text-slate-800">
                {config.bank_name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Chủ tài khoản</span>
              <span className="font-bold text-slate-800">
                {config.account_name}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-slate-400">Số tài khoản</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-violet-600">
                  {config.account_no}
                </span>
                <Button
                  onClick={handleCopy}
                  data-testid="btn-copy-section"
                  variant="secondary"
                  className="px-2.5 py-1 text-violet-750 bg-violet-100 hover:bg-violet-200 transition font-bold rounded-lg text-[10px] cursor-pointer"
                >
                  {copied ? "Đã chép ✓" : "Sao chép 📋"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mã QR */}
        <div className="w-44 h-44 border-4 border-dashed border-violet-500/20 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-50 flex items-center justify-center">
          <Image
            src={config.qr_template_url}
            alt="Mã QR chuyển khoản ủng hộ VietQR"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>
      </div>

      {/* Bảng vinh danh */}
      {config.donors && config.donors.length > 0 && (
        <div className="space-y-3" data-testid="donor-board">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Những trạm sạc năng lượng của EnStudey 🔋✨
            </h3>
            {/* 2 nút cuộn trái / phải */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleScroll("left")}
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-xs hover:bg-slate-100 transition cursor-pointer text-slate-600 active:scale-95"
                aria-label="Cuộn sang trái"
              >
                &larr;
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-xs hover:bg-slate-100 transition cursor-pointer text-slate-600 active:scale-95"
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
                  className="bg-slate-50 border border-slate-200/50 px-3.5 py-3 rounded-2xl shrink-0 w-48 snap-start shadow-2xs hover:border-violet-500/20 transition-colors flex items-center justify-between"
                >
                  <span className="font-bold text-slate-800 truncate pr-1 text-xs">
                    {donor.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded-md shrink-0">
                    {donor.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
