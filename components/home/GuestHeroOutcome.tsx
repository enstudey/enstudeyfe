"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, GraduationCap, ArrowRight, Target, Clock, Calendar } from "lucide-react";

type CurrentScore = "350" | "500" | "650";
type TargetScore = "650" | "750" | "850";
type ExamTime = "1m" | "2m" | "3m";

export default function GuestHeroOutcome() {
  const [currentScore, setCurrentScore] = useState<CurrentScore>("500");
  const [targetScore, setTargetScore] = useState<TargetScore>("750");
  const [examTime, setExamTime] = useState<ExamTime>("2m");

  const scrollToQuiz = () => {
    const quizElement = document.getElementById("daily-quiz-section");
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Realtime Dynamic Calculations
  const curNum = parseInt(currentScore);
  const tarNum = parseInt(targetScore);
  const gap = Math.max(50, tarNum - curNum);
  const extraQuestions = Math.max(6, Math.round((gap / 250) * 19));
  const sessions = Math.max(15, Math.round((gap / 250) * 48));
  const progressPercent = Math.min(100, Math.max(20, Math.round((curNum / tarNum) * 100)));

  return (
    <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 md:p-10 shadow-xs relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3349D8]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Outcome Copy & Realtime Dynamic Calculation (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#3349D8]/20 text-[#3349D8] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Luyện thi TOEIC chuẩn ETS 2026 cá nhân hóa</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#16213A] tracking-tight leading-tight">
            Chinh phục TOEIC <span className="text-[#3349D8]">{targetScore}+</span> nhanh hơn với lộ trình cá nhân hóa
          </h1>

          {/* Progress Visualization Bar */}
          <div className="bg-[#F7F8FC] border border-[#E4E8F1] rounded-lg p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#5C667A]">Hiện tại (Mô phỏng): <strong className="text-[#16213A]">{currentScore} điểm</strong></span>
              <span className="text-[#3349D8]">Mục tiêu: <strong>{targetScore} điểm</strong></span>
            </div>

            {/* Dynamic Progress Track */}
            <div className="w-full bg-[#E4E8F1] h-3 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-[#0E9F9A] to-[#3349D8] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Realtime Motivational Insight */}
            <div className="pt-1 flex items-start gap-2 text-xs text-[#16213A] font-semibold">
              <Target className="w-4 h-4 text-[#0E9F9A] shrink-0 mt-0.5" />
              <span>
                Làm bài test 10 câu để AI xác định chính xác số câu bạn cần đúng thêm (ước tính ~{extraQuestions} câu / {sessions} buổi học) để cán mốc <strong className="text-[#0E9F9A]">{targetScore}+ điểm</strong>.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-xs sm:text-sm px-6 h-11 sm:h-12 rounded-lg shadow-xs transition-all duration-200 active:scale-95 transform-gpu cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Test chẩn đoán 10 câu (Miễn phí)</span>
            </button>

            <Link
              href="/exam"
              className="text-xs font-bold text-[#3349D8] hover:underline inline-flex items-center gap-1 py-2 cursor-pointer transition transform-gpu"
            >
              <span>Xem danh sách 200+ đề thi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Preview Card (Mockup Visual Report) */}
        <div className="lg:col-span-5 bg-[#F7F8FC] border border-[#E4E8F1] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs transform-gpu">
          <div className="flex items-center justify-between border-b border-[#E4E8F1] pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#16213A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3349D8]" />
              <span>Báo cáo mô phỏng phân tích AI</span>
            </h3>
            <span className="text-[10px] font-bold text-[#0E9F9A] bg-[#EEFDF8] px-2 py-0.5 rounded border border-[#0E9F9A]/20">
              Ví dụ mẫu
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-lg p-2.5 space-y-0.5">
              <span className="text-[10px] font-bold text-[#5C667A] uppercase tracking-wider block">Dự đoán điểm hiện tại</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-[#16213A]">520 điểm</span>
                <span className="text-xs font-bold text-[#3349D8]">Target 750+</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-lg p-2.5 space-y-0.5">
              <span className="text-[10px] font-bold text-[#C0392B] uppercase tracking-wider block">Lỗ hổng kiến thức cần gỡ</span>
              <p className="text-xs text-[#16213A] font-semibold">
                Hay mắc bẫy chia thì Part 5 & Đọc từ vựng Part 7 đoạn đôi
              </p>
            </div>

            <div className="bg-[#EEF2FF] border border-[#3349D8]/20 rounded-lg p-2.5 space-y-0.5">
              <span className="text-[10px] font-bold text-[#3349D8] uppercase tracking-wider block">Lộ trình khuyến nghị</span>
              <p className="text-xs text-[#16213A] font-medium">
                48 buổi 15 phút mỗi ngày kèm thuật toán Spaced Repetition (SM-2)
              </p>
            </div>
          </div>

          {/* Static Notice Box (loại bỏ nút bấm xanh cạnh tranh thị giác) */}
          <div className="pt-1 text-center">
            <span className="text-[11px] font-semibold text-[#5C667A] bg-[#FFFFFF] border border-[#E4E8F1] rounded-lg py-2 px-3 block">
              ✨ Làm bài test 10 câu bên dưới để nhận phân tích AI chi tiết
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
