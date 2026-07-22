"use client";

import Link from "next/link";
import { RoadmapData } from "@/types/roadmap";

interface RoadmapHeaderProps {
  roadmap: RoadmapData;
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case "MAT_GOC":
        return "Người Mất Gốc";
      case "SINH_VIEN":
        return "Sinh Viên (TOEIC/IELTS)";
      case "NGUOI_DI_LAM":
        return "Người Đi Làm";
      case "HOC_SINH":
        return "Học Sinh THPT";
      default:
        return audience;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
              {getAudienceLabel(roadmap.targetAudience)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Lộ trình cá nhân hóa
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            {roadmap.title}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {roadmap.description}
          </p>
        </div>

        <Link
          href="/lo-trinh/khao-sat"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
        >
          Đổi Lộ Trình
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Tiến độ hoàn thành toàn bộ lộ trình
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {roadmap.progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, roadmap.progressPercentage))}%` }}
          />
        </div>
      </div>

      {/* Legal Notice - Nghị định 72/2013/NĐ-CP */}
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 italic">
        * Đây là lộ trình hướng dẫn tự học được xây dựng dựa trên các tài liệu giáo trình mở và công cụ miễn phí của EnStudey.
      </p>
    </div>
  );
}
