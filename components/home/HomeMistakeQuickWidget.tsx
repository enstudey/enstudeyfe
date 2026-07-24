"use client";

import Link from "next/link";
import { Notebook, RotateCcw, ChevronRight } from "lucide-react";

interface HomeMistakeQuickWidgetProps {
  isGuest: boolean;
}

export default function HomeMistakeQuickWidget({ isGuest }: HomeMistakeQuickWidgetProps) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#3349D8] flex items-center justify-center">
              <Notebook className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#16213A]">
                Sổ tay câu sai TOEIC
              </h3>
              <p className="text-[11px] text-[#5C667A]">
                Spaced Repetition (SuperMemo-2)
              </p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-lg bg-[#EEFDF8] text-[#0E9F9A] text-[10px] font-bold border border-[#0E9F9A]/20">
            SM-2
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#5C667A] leading-relaxed">
          Tự động ghi nhớ các câu trả lời sai ở Part 1 - Part 7 và gợi ý làm lại đúng thời điểm để khắc sâu trí nhớ dài hạn.
        </p>

        {/* Dynamic Status Box depending on Auth State */}
        {isGuest ? (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-[#D97706] font-bold">
              <span>Trạng thái: Chưa đăng nhập</span>
            </div>
            <p className="text-[11px] text-[#78350F] leading-tight">
              Đăng nhập để tự động lưu các câu làm sai từ Mini-Test & Full-Test vào sổ tay cá nhân.
            </p>
          </div>
        ) : (
          <div className="bg-[#F7F8FC] border border-[#E4E8F1] rounded-lg p-3 text-xs space-y-2">
            <div className="flex justify-between items-center text-[#16213A] font-semibold">
              <span>Trạng thái ôn tập:</span>
              <span className="text-[#0E9F9A] font-bold">Đang hoạt động</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#5C667A]">
              <span>Lần làm lại gần nhất:</span>
              <span>Hôm nay</span>
            </div>
          </div>
        )}
      </div>

      {/* Button CTA (Radius 8px rounded-lg) */}
      <div className="pt-4 mt-auto">
        <Link
          href={isGuest ? "/login" : "/ngan-hang-cau-sai"}
          className={`w-full inline-flex items-center justify-center gap-2 font-bold text-xs h-10 rounded-lg transition duration-150 border ${
            isGuest
              ? "bg-[#3349D8] hover:bg-[#2940C5] text-[#FFFFFF] border-[#3349D8] shadow-xs"
              : "bg-[#F1F4FA] hover:bg-[#EEF2FF] text-[#3349D8] border-[#E4E8F1]"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isGuest ? "Đăng nhập ngay để lưu câu sai" : "Mở sổ tay câu sai"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
