"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useActiveAdRefresh } from "@/hooks/useActiveAdRefresh";

const MOCK_ADS = [
  {
    title: "Đột Phá IELTS 7.5 Cùng AI Tutor",
    description: "Nhận giáo trình luyện nói phản xạ 1-1 miễn phí tối ưu cho người bận rộn.",
    cta: "Thử Ngay Lên Trình",
    tag: "Tài trợ",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    border: "border-blue-500/20"
  },
  {
    title: "Sổ Tay 1000 Từ Vựng TOEIC Cực Dễ",
    description: "E-book độc quyền tổng hợp từ Mistake Bank của hơn 10,000 học viên tại EnStudey.",
    cta: "Tải E-book Free",
    tag: "Đề xuất",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    border: "border-emerald-500/20"
  },
  {
    title: "Mở Khóa Premium - Học Không Giới Hạn",
    description: "Nâng cấp tài khoản để làm Mini-test không giới hạn và nhận dự báo đề tủ TOEIC/IELTS.",
    cta: "Nâng Cấp Premium",
    tag: "EnStudey Pro",
    gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    border: "border-indigo-500/20"
  }
];

export default function AdBanner({
  adSlotId = "general-ad-banner",
  heightClass = "h-[250px]",
  className = "my-6",
}: {
  adSlotId?: string;
  heightClass?: string;
  className?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const { refreshTrigger } = useActiveAdRefresh(adSlotId, 45000);

  useEffect(() => {
    // Sử dụng setTimeout để chuyển tác vụ cập nhật state sang luồng bất đồng bộ (async event loop task),
    // giải quyết triệt để lỗi react-hooks/set-state-in-effect của React.
    const timer = setTimeout(() => {
      setIsMounted(true);
      setAdIndex(Math.floor(Math.random() * MOCK_ADS.length));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Thay đổi index khi refreshTrigger tăng (chỉ chạy khi đã mount)
  useEffect(() => {
    if (refreshTrigger > 0) {
      const timer = setTimeout(() => {
        setAdIndex(Math.floor(Math.random() * MOCK_ADS.length));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);

  if (!isMounted) {
    return (
      <div
        className={`w-full ${heightClass} bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 ${className}`}
        data-testid="ad-banner-placeholder"
      >
        <span className="text-[11px] text-zinc-400 font-medium tracking-wide">Quảng cáo liên kết tài trợ</span>
      </div>
    );
  }

  const ad = MOCK_ADS[adIndex];

  return (
    <div
      className={`w-full ${heightClass} bg-gradient-to-r ${ad.gradient} bg-white flex flex-col justify-between p-6 rounded-2xl overflow-hidden border ${ad.border} shadow-sm transition-all duration-300 relative ${className}`}
      data-testid="ad-banner"
    >
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
          {ad.tag}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Quảng cáo được đề xuất
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 leading-snug line-clamp-2">
          {ad.title}
        </h3>
        <p className="text-slate-600 text-sm max-w-xl leading-relaxed line-clamp-3">
          {ad.description}
        </p>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <span className="text-xs text-slate-650">enstudey.com/ads</span>
        <Button
          size="sm"
          className="font-bold text-xs rounded-xl shadow transition duration-200 cursor-pointer"
        >
          {ad.cta}
        </Button>
      </div>
    </div>
  );
}
