"use client";

import Link from "next/link";
import { BarChart3, TrendingUp, ChevronRight } from "lucide-react";

interface HomeStatsPredictorWidgetProps {
  isGuest: boolean;
}

export default function HomeStatsPredictorWidget({ isGuest }: HomeStatsPredictorWidgetProps) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#3349D8] flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#16213A]">
                Dự đoán điểm TOEIC 500 → 750+
              </h3>
              <p className="text-[11px] text-[#5C667A]">
                Phân tích tỷ lệ trả lời đúng theo Part
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0E9F9A] bg-[#EEFDF8] px-2 py-0.5 rounded-lg border border-[#0E9F9A]/20">
            <TrendingUp className="w-3 h-3" />
            <span>ETS AI</span>
          </span>
        </div>

        {/* Progress Rows */}
        <div className="space-y-3 pt-1">
          {/* Listening Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#16213A]">
              <span>Listening (Part 1 - 4)</span>
              <span className="font-mono text-[#3349D8] font-bold">280 - 340 điểm</span>
            </div>
            <div className="w-full h-2 bg-[#E9EDF5] rounded-full overflow-hidden">
              <div className="h-full bg-[#3349D8] rounded-full w-[65%]" />
            </div>
          </div>

          {/* Reading Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#16213A]">
              <span>Reading (Part 5 - 7)</span>
              <span className="font-mono text-[#0E9F9A] font-bold">250 - 310 điểm</span>
            </div>
            <div className="w-full h-2 bg-[#E9EDF5] rounded-full overflow-hidden">
              <div className="h-full bg-[#0E9F9A] rounded-full w-[55%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Button CTA (Radius 8px rounded-lg) */}
      <div className="pt-4 mt-auto">
        <Link
          href={isGuest ? "/login" : "/thong-ke"}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F1F4FA] hover:bg-[#EEF2FF] text-[#3349D8] font-bold text-xs h-10 rounded-lg transition duration-150 border border-[#E4E8F1]"
        >
          <span>Xem báo cáo phân tích chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
