"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Trophy, BookOpen } from "lucide-react";

interface DailyQuizWidgetProps {
  userFullName?: string;
}

export default function DailyQuizWidget({ userFullName = "bạn" }: DailyQuizWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [scoreInfo, setScoreInfo] = useState<{ score: number; examType: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const todayStr = new Date().toLocaleDateString("en-CA");
      const completedDate = localStorage.getItem("daily_quiz_completed_date");

      if (completedDate === todayStr) {
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
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // SSR Fallback (trước khi mount) hoặc khi chưa làm bài
  if (!isMounted || !isCompletedToday) {
    return (
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden transition-all duration-300">
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-flex items-center gap-1 bg-violet-400/30 text-violet-105 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Hôm nay nè bạn ơi! 🔥
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào {userFullName} nha! Hôm nay chúng mình làm tí Mini-test nhỉ? 🔥
          </h2>
          <p className="text-violet-100/90 text-sm leading-relaxed">
            Hoàn thành nhanh 10 câu hỏi rút gọn để giữ lửa Streak đỉnh chóp và củng cố ngữ pháp, từ vựng hôm nay nha.
          </p>
          <div className="pt-2">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center bg-white text-violet-600 font-bold px-6 py-3.5 rounded-xl shadow-md hover:bg-violet-50 transition transform hover:-translate-y-0.5"
            >
              Chiến luôn đề này nha! 🎯
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-9xl select-none font-bold">
          10Q
        </div>
      </div>
    );
  }

  // Khi đã hoàn thành bài thi trong ngày
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden transition-all duration-300">
      <div className="relative z-10 space-y-4 max-w-lg">
        <span className="inline-flex items-center gap-1 bg-emerald-450/30 text-emerald-100 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" /> Đã hoàn thành thử thách! 🌟
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Tuyệt vời quá {userFullName} ơi! 🎉
        </h2>
        <p className="text-emerald-50/90 text-sm leading-relaxed">
          Bạn đã hoàn thành xuất sắc bài kiểm tra hàng ngày loại đề{" "}
          <strong className="text-white font-bold">{scoreInfo?.examType || "TOEIC"}</strong> với kết quả{" "}
          <strong className="text-white font-black text-lg">{scoreInfo?.score ?? 0}/10</strong> câu đúng. Giữ vững ngọn lửa Streak cho các ngày tiếp theo nhé!
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center bg-emerald-50/20 text-white border border-emerald-400/40 hover:bg-emerald-50/30 font-bold px-5 py-3 rounded-xl transition"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Luyện tập thêm 🎯
          </Link>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-9xl select-none font-bold">
        DONE
      </div>
    </div>
  );
}
