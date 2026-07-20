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
}

const STATIC_EXAMS: ExamItem[] = [
  {
    id: "ets-2026-test-1",
    title: "ETS 2026 - Test 1 (Full Listening & Reading)",
    thumbnail: "🏛️",
    attemptsCount: 1420,
    maxScore: 920,
    durationMinutes: 120
  },
  {
    id: "hackers-3-test-2",
    title: "Hackers Series 3 - Test 2 Simulation",
    thumbnail: "🎓",
    attemptsCount: 850,
    maxScore: 790,
    durationMinutes: 120
  },
  {
    id: "cam-20-test-1",
    title: "Cambridge IELTS 20 - Test 1 Reading",
    thumbnail: "📖",
    attemptsCount: 3105,
    maxScore: 8.0,
    durationMinutes: 60
  }
];

export default function ExamLibraryShelf() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span>📚</span> Ngân hàng đề thi thử
        </h3>
        <Link href="/exam" className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">
          Xem tất cả &rarr;
        </Link>
      </div>

      {/* Desktop Grid Layout & Mobile Swipe Carousel Combined */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0 md:gap-6">
        {STATIC_EXAMS.map((exam) => (
          <div
            key={exam.id}
            className="min-w-[260px] md:min-w-0 snap-start bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-2xl">
                {exam.thumbnail}
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px]">{exam.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                  <span>⏱️ {exam.durationMinutes} phút</span>
                  <span>👤 {exam.attemptsCount} lượt thi</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-left">
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Điểm cao nhất</span>
                <span className="font-mono text-xs font-bold text-emerald-500">{exam.maxScore}</span>
              </div>
              <Link
                href={`/exam`}
                className="bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold text-xs px-4 py-2 rounded-xl transition duration-150"
              >
                Vào thi ⚡
              </Link>
            </div>
          </div>
        ))}

        {/* Ads Place Holder chống CLS */}
        <div className="min-w-[260px] md:min-w-0 snap-start h-full min-h-[220px] md:min-h-0 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-6 text-center select-none">
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">ADSENSE CONTAINER</span>
            <p className="text-[9px] text-slate-400 max-w-[150px] mx-auto leading-relaxed">Quảng cáo tiệp màu, không giật trang layout (CLS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
