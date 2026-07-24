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

  return (
    <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 md:p-10 shadow-xs relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3349D8]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Outcome Copy & Value Proposition (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#3349D8]/20 text-[#3349D8] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Luyện thi TOEIC chuẩn ETS 2026 cá nhân hóa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16213A] tracking-tight leading-tight">
            Chinh phục TOEIC <span className="text-[#3349D8]">750+</span> nhanh hơn với lộ trình cá nhân hóa
          </h1>

          <p className="text-sm sm:text-base text-[#5C667A] leading-relaxed max-w-xl">
            Tự động phát hiện lỗ hổng Part 1 - Part 7 bằng AI, gợi ý làm lại câu sai đúng thời điểm và theo dõi điểm số dự đoán mỗi ngày.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-sm px-6 h-12 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Tạo lộ trình & Thi thử miễn phí</span>
            </button>

            <Link
              href="/exam"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F4FA] text-[#16213A] font-bold text-sm px-5 h-12 rounded-lg border border-[#E4E8F1] transition-all active:scale-95"
            >
              <GraduationCap className="w-4.5 h-4.5 text-[#3349D8]" />
              <span>Thi thử Full-Test 200 câu</span>
              <ArrowRight className="w-4 h-4 text-[#5C667A]" />
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Personalization Form (Col 5) */}
        <div className="lg:col-span-5 bg-[#F7F8FC] border border-[#E4E8F1] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E8F1] pb-3">
            <h3 className="text-sm font-extrabold text-[#16213A] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#3349D8]" />
              <span>Thiết lập Lộ Trình Mục Tiêu</span>
            </h3>
            <span className="text-[10px] font-bold text-[#0E9F9A] bg-[#EEFDF8] px-2 py-0.5 rounded border border-[#0E9F9A]/20">
              Miễn phí 100%
            </span>
          </div>

          {/* Selector 1: Điểm hiện tại */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C667A] flex items-center gap-1">
              <span>1. Mức điểm ước tính hiện tại:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["350", "500", "650"] as CurrentScore[]).map((val) => (
                <button
                  key={val}
                  onClick={() => setCurrentScore(val)}
                  className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    currentScore === val
                      ? "bg-[#EEF2FF] text-[#3349D8] border-[#3349D8]"
                      : "bg-[#FFFFFF] text-[#5C667A] border-[#E4E8F1] hover:bg-[#F1F4FA]"
                  }`}
                >
                  {val}+ TOEIC
                </button>
              ))}
            </div>
          </div>

          {/* Selector 2: Điểm mục tiêu */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C667A]">
              2. Mức điểm mục tiêu mong muốn:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["650", "750", "850"] as TargetScore[]).map((val) => (
                <button
                  key={val}
                  onClick={() => setTargetScore(val)}
                  className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    targetScore === val
                      ? "bg-[#EEFDF8] text-[#0E9F9A] border-[#0E9F9A]"
                      : "bg-[#FFFFFF] text-[#5C667A] border-[#E4E8F1] hover:bg-[#F1F4FA]"
                  }`}
                >
                  Target {val}+
                </button>
              ))}
            </div>
          </div>

          {/* Selector 3: Thời gian thi */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C667A] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#5C667A]" />
              <span>3. Dự kiến thời gian thi:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "1m", label: "1 Tháng" },
                { key: "2m", label: "2 Tháng" },
                { key: "3m", label: "3 Tháng" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setExamTime(item.key as ExamTime)}
                  className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    examTime === item.key
                      ? "bg-[#FFFBEB] text-[#D97706] border-[#D97706]"
                      : "bg-[#FFFFFF] text-[#5C667A] border-[#E4E8F1] hover:bg-[#F1F4FA]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form CTA */}
          <button
            onClick={scrollToQuiz}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-xs h-10 rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
          >
            <span>Phân tích điểm & Bắt đầu test ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
