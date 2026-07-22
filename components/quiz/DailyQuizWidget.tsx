"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Trophy, BookOpen } from "lucide-react";
import { getDailyQuizStatus } from "@/lib/api/quiz";

interface DailyQuizWidgetProps {
  userFullName?: string;
  token?: string;
}

export default function DailyQuizWidget({ userFullName = "bạn", token }: DailyQuizWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [scoreInfo, setScoreInfo] = useState<{ score: number; examType: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      if (token) {
        try {
          const res = await getDailyQuizStatus(token);
          if (active && res && res.data) {
            if (res.data.completedToday) {
              setIsCompletedToday(true);
              setScoreInfo({
                score: res.data.score ?? 0,
                examType: "Mini-Test"
              });
              return;
            }
          }
        } catch (e) {
          console.error("Failed to fetch daily quiz status from server", e);
        }
      }

      // Fallback đọc từ localStorage nếu không có token hoặc API lỗi
      const todayStr = new Date().toLocaleDateString("en-CA");
      const completedDate = localStorage.getItem("daily_quiz_completed_date");
      if (completedDate === todayStr && active) {
        setIsCompletedToday(true);
        const lastScore = localStorage.getItem("daily_quiz_last_score");
        if (lastScore) {
          try {
            setScoreInfo(JSON.parse(lastScore));
          } catch (e) {
            console.error("Failed to parse last score on dashboard widget", e);
          }
        }
      }
    }

    const timer = setTimeout(() => {
      setIsMounted(true);
      checkStatus();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [token]);

  // SSR Fallback (trước khi mount) hoặc khi chưa làm bài
  if (!isMounted || !isCompletedToday) {
    const radius = 36;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius; // 226.19
    const offset = circumference; // 0% progress

    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
        <div className="flex-1 space-y-4 text-left">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Hôm nay nè bạn ơi! 🔥
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Mục tiêu giữ Streak hôm nay cùng {userFullName} 🎯
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-md">
            Hoàn thành nhanh 10 câu hỏi rút gọn để tích luỹ ngọn lửa thói quen luyện tập hàng ngày nhé.
          </p>
        </div>

        {/* Progress Ring & CTA Button Wrapper */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Progress Ring SVG */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-lg font-black text-slate-800">0/10</span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase">Câu đúng</span>
            </div>
          </div>

          <Link
            href="/quiz"
            className="w-full sm:w-auto text-center h-14 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Luyện Ngay (5 Phút) ⚡
          </Link>
        </div>
      </div>
    );
  }

  // Khi đã hoàn thành bài thi trong ngày
  const radius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // 226.19
  const score = scoreInfo?.score ?? 0;
  const progressRatio = score / 10;
  const offset = circumference - progressRatio * circumference;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
      <div className="flex-1 space-y-4 text-left">
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" /> Đã hoàn thành thử thách! 🌟
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Tuyệt vời quá {userFullName} ơi! 🎉
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed max-w-md">
          Bạn đã rèn luyện xong đề <strong className="text-slate-800 font-bold">{scoreInfo?.examType || "Mini-Test"}</strong> với thành tích <strong className="text-emerald-500 font-black text-sm">{score}/10</strong> câu chính xác.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Progress Ring SVG */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-100"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-black text-emerald-600">{score}/10</span>
            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Câu đúng</span>
          </div>
        </div>

        <Link
          href="/quiz"
          className="w-full sm:w-auto text-center h-14 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 text-sm"
        >
          <BookOpen className="w-4 h-4" />
          Luyện tập thêm 🎯
        </Link>
      </div>
    </div>
  );
}
