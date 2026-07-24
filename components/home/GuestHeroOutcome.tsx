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

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16213A] tracking-tight leading-tight">
            Chinh phục TOEIC <span className="text-[#3349D8]">{targetScore}+</span> nhanh hơn với lộ trình cá nhân hóa
          </h1>

          {/* Progress Visualization Bar */}
          <div className="bg-[#F7F8FC] border border-[#E4E8F1] rounded-lg p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#5C667A]">Hiện tại: <strong className="text-[#16213A]">{currentScore}đ</strong></span>
              <span className="text-[#3349D8]">Mục tiêu: <strong>{targetScore}đ</strong></span>
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
                Bạn chỉ cần đúng thêm khoảng <span className="text-[#3349D8] font-extrabold">{extraQuestions} câu</span> (luyện ~{sessions} buổi 15 phút) để cán mốc <strong className="text-[#0E9F9A]">{targetScore}+</strong>.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-sm px-6 h-12 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Bắt đầu bài test chẩn đoán (Miễn phí)</span>
            </button>

            <Link
              href="/exam"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F4FA] text-[#16213A] font-bold text-sm px-5 h-12 rounded-lg border border-[#E4E8F1] transition-all active:scale-95"
            >
              <GraduationCap className="w-4.5 h-4.5 text-[#3349D8]" />
              <span>Thi thử full-test 200 câu</span>
              <ArrowRight className="w-4 h-4 text-[#5C667A]" />
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Personalization Selector Form (Col 5) */}
        <div className="lg:col-span-5 bg-[#F7F8FC] border border-[#E4E8F1] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E8F1] pb-3">
            <h3 className="text-sm font-bold text-[#16213A] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#3349D8]" />
              <span>Thiết lập lộ trình mục tiêu</span>
            </h3>
            <span className="text-[10px] font-bold text-[#0E9F9A] bg-[#EEFDF8] px-2 py-0.5 rounded border border-[#0E9F9A]/20">
              Tính toán tự động
            </span>
          </div>

          {/* Selector 1: Điểm hiện tại */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#5C667A] flex items-center justify-between">
              <span>1. Mức điểm hiện tại:</span>
              <span className="text-[11px] font-bold text-[#3349D8]">{currentScore} TOEIC</span>
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
            <label className="text-xs font-semibold text-[#5C667A] flex items-center justify-between">
              <span>2. Mục tiêu mong muốn:</span>
              <span className="text-[11px] font-bold text-[#0E9F9A]">Target {targetScore}+</span>
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
                { key: "1m", label: "30 Ngày" },
                { key: "2m", label: "60 Ngày" },
                { key: "3m", label: "90 Ngày" },
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
            <span>Tạo lộ trình cá nhân hóa ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
