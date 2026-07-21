"use client";

import React from "react";
import Link from "next/link";
import { WeakTopic } from "@/types/analytics";
import { WEAK_TOPIC_THRESHOLD_PERCENT } from "@/lib/analytics-constants";

interface WeakTopicsListProps {
  weakTopics: WeakTopic[];
}

export const WeakTopicsList: React.FC<WeakTopicsListProps> = ({ weakTopics }) => {
  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0">
          ✅
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            Phong Độ Rất Tốt!
          </h4>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            Không phát hiện kỹ năng hoặc phần thi nào có tỷ lệ trả lời đúng dưới {WEAK_TOPIC_THRESHOLD_PERCENT}%. Hãy tiếp tục duy trì nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span>⚠️</span> Cảnh Báo Điểm Yếu (Cần Khắc Phục)
        </h4>
        <span className="text-xs text-slate-500">Tỷ lệ đúng &lt; {WEAK_TOPIC_THRESHOLD_PERCENT}%</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {weakTopics.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-rose-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {item.part}
                </span>
                <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {item.correctRate}% Đúng
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${item.correctRate}%` }}
                />
              </div>
            </div>

            <Link
              href="/luyen-de"
              className="inline-flex items-center justify-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:underline"
            >
              Luyện tập ngay &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
