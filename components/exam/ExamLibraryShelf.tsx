"use client";

import React from "react";
import Link from "next/link";

interface ExamItem {
  id: string;
  title: string;
  thumbnail: string;
  attemptsCount: number;
  maxScore: number;
  durationMinutes: number;
  difficultyStars: number;
  targetBadge: string;
}

const STATIC_EXAMS: ExamItem[] = [
  {
    id: "ets-2026-test-1",
    title: "ETS 2026 - Test 1 (Full Listening & Reading)",
    thumbnail: "🏛️",
    attemptsCount: 1420,
    maxScore: 920,
    durationMinutes: 120,
    difficultyStars: 3,
    targetBadge: "Target 650+",
  },
  {
    id: "hackers-3-test-2",
    title: "Hackers Series 3 - Test 2 Simulation",
    thumbnail: "🎓",
    attemptsCount: 850,
    maxScore: 790,
    durationMinutes: 120,
    difficultyStars: 4,
    targetBadge: "Target 750+",
  },
  {
    id: "ets-2026-starter-1",
    title: "ETS Starter 2026 - Test 1 (Reading Focus)",
    thumbnail: "📖",
    attemptsCount: 2310,
    maxScore: 680,
    durationMinutes: 60,
    difficultyStars: 2,
    targetBadge: "Target 500+",
  },
];

export default function ExamLibraryShelf() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-base font-extrabold text-[#16213A] tracking-tight flex items-center gap-2">
          <span>📚</span> Ngân hàng đề thi thử ETS 2026
        </h3>
        <Link href="/exam" className="text-xs font-bold text-[#3349D8] hover:underline transition">
          Xem tất cả đề thi &rarr;
        </Link>
      </div>

      {/* Desktop Grid Layout & Mobile Swipe Carousel Combined */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0">
        {STATIC_EXAMS.map((exam) => (
          <div
            key={exam.id}
            className="min-w-[260px] md:min-w-0 snap-start bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-5 shadow-xs hover:border-[#3349D8]/40 hover:shadow-sm transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-xl shrink-0">
                  {exam.thumbnail}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEFDF8] text-[#0E9F9A] border border-[#0E9F9A]/20">
                  {exam.targetBadge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#16213A] text-xs leading-snug line-clamp-2 min-h-[32px]">
                  {exam.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-[#5C667A]">
                  <span>⏱️ {exam.durationMinutes} phút</span>
                  <span className="text-amber-500 font-bold">
                    {"★".repeat(exam.difficultyStars)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F4FA] flex items-center justify-between">
              <div className="text-left">
                <span className="block text-[9px] text-[#5C667A] font-bold uppercase">Lượt làm</span>
                <span className="font-mono text-xs font-extrabold text-[#16213A]">{exam.attemptsCount}</span>
              </div>
              <Link
                href={`/exam`}
                className="bg-[#3349D8] hover:bg-[#2940C5] text-[#FFFFFF] font-bold text-xs px-3.5 py-1.5 rounded-lg transition duration-150 shadow-xs"
              >
                Vào thi ⚡
              </Link>
            </div>
          </div>
        ))}

        {/* Ads Place Holder chống CLS */}
        <div className="min-w-[260px] md:min-w-0 snap-start h-full min-h-[180px] md:min-h-0 bg-[#F7F8FC] border border-dashed border-[#E4E8F1] rounded-xl flex items-center justify-center p-4 text-center select-none">
          <div className="space-y-1">
            <span className="block text-[10px] text-[#94A0B8] font-bold uppercase tracking-wider">TÀI TRỢ & ĐỀ XUẤT</span>
            <p className="text-[10px] text-[#5C667A] max-w-[150px] mx-auto leading-relaxed">
              Khuyến nghị bộ đề thi chuẩn ETS từ EnStudey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
