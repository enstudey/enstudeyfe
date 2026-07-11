"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const MOCK_ADS = [
  {
    title: "Đột Phá IELTS 7.5 Cùng AI Tutor",
    description: "Nhận giáo trình luyện nói phản xạ 1-1 miễn phí tối ưu cho người bận rộn.",
    cta: "Thử Ngay Lên Trình",
    tag: "Tài trợ",
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    border: "border-violet-500/20"
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

export default function AdBanner() {
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    // Pick a random mock ad on mount
    const timer = setTimeout(() => {
      setAdIndex(Math.floor(Math.random() * MOCK_ADS.length));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const ad = MOCK_ADS[adIndex];

  return (
    <div 
      className={`w-full min-h-[250px] bg-gradient-to-r ${ad.gradient} bg-white flex flex-col justify-between p-6 my-6 rounded-2xl overflow-hidden border ${ad.border} shadow-sm transition-all duration-300 relative`}
      data-testid="ad-banner"
    >
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
          {ad.tag}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
          Quảng cáo được đề xuất
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
          {ad.title}
        </h3>
        <p className="text-slate-650 text-sm max-w-xl leading-relaxed">
          {ad.description}
        </p>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <span className="text-xs text-slate-400">enstudey.com/ads</span>
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
