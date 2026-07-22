"use client";

import React from "react";
import { TopicStatus } from "@/lib/flashcards-helper";

interface BentoGridProps {
  topics: TopicStatus[];
  onSelectTopic: (topicId: string) => void;
}

export default function BentoGrid({ topics, onSelectTopic }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      {topics.map((topic) => {
        // Xác định class CSS theo trạng thái Topic
        let cardBg = "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:border-slate-350 hover:shadow-sm";
        let statusBadge = "Chưa học";
        let badgeBg = "bg-slate-100 text-slate-500 dark:bg-slate-900";
        let pulseClass = "";

        if (topic.status === "mastered") {
          cardBg = "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/50 hover:bg-emerald-100/60";
          statusBadge = "Đã master";
          badgeBg = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
        } else if (topic.status === "studying") {
          cardBg = "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-250 dark:border-indigo-900/50 hover:bg-indigo-100/50";
          statusBadge = "Đang học";
          badgeBg = "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300";
          pulseClass = "animate-pulse";
        }

        // Xác định màu Hp Bar
        let hpColor = "bg-emerald-500";
        let hpPulse = "";
        if (topic.hp < 40) {
          hpColor = "bg-rose-500";
          hpPulse = "animate-pulse";
        } else if (topic.hp < 70) {
          hpColor = "bg-amber-500";
        }

        // Chọn Emoji tương ứng với Topic cho trực quan
        const emojiMap: Record<string, string> = {
          "Contracts": "🏢",
          "Marketing": "📈",
          "Warranties": "🛡️",
          "Business Planning": "📝",
          "Conferences": "🤝",
          "Computers": "💻",
          "Office Technology": "🔌",
          "Office Procedures": "📂",
          "Electronics": "⚡",
          "Correspondence": "✉️",
          "Education": "🎓",
          "Environment": "🌿",
          "Technology": "🤖",
          "Health": "🍎",
          "Travel": "✈️"
        };
        const emoji = emojiMap[topic.topicId] || "📚";

        return (
          <div
            key={topic.topicId}
            onClick={() => onSelectTopic(topic.topicId)}
            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${cardBg} ${pulseClass}`}
          >
            {/* Top Row: Emoji & Status */}
            <div className="flex justify-between items-start">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {emoji}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeBg}`}>
                {statusBadge}
              </span>
            </div>

            {/* Middle Row: Title & Count */}
            <div className="my-3 space-y-1">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight leading-snug group-hover:text-indigo-650 transition-colors">
                {topic.topicId}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {topic.totalCards} từ • Tiến độ: {topic.masteredPercent}%
              </p>
            </div>

            {/* Bottom Row: Hp Bar & Label */}
            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-900/60">
              <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                <span>Trí nhớ (Hp)</span>
                <span className={topic.hp < 40 ? "text-rose-500 font-bold" : ""}>
                  {topic.hp}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${hpColor} ${hpPulse}`}
                  style={{ width: `${topic.hp}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
