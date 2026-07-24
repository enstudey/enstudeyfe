"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

interface HomeHeroTargetBannerProps {
  isGuest: boolean;
  userFullName?: string;
}

type TargetScoreLevel = "500" | "650" | "750";

interface TargetConfig {
  label: string;
  badge: string;
  sub: string;
  recommend: string;
  activeStyle: string;
}

const TARGET_CONFIGS: Record<TargetScoreLevel, TargetConfig> = {
  "500": {
    label: "Target 500+",
    badge: "Mất gốc / Chuẩn đầu ra ĐH",
    sub: "Tập trung chuẩn hóa Part 1 (Hình ảnh), Part 2 (Hỏi đáp ngắn) & Từ vựng Part 5 căn bản.",
    recommend: "Đề thi TOEIC ETS Starter 2026",
    activeStyle: "bg-[#EEF2FF] text-[#3349D8] border-[#3349D8]",
  },
  "650": {
    label: "Target 650+",
    badge: "Tốt nghiệp / Ưu tiên xét tuyển",
    sub: "Luyện phản xạ Part 3-4 (Đoạn hội thoại/bài nói) & Ngữ pháp + Từ vựng ngữ cảnh Part 5-6.",
    recommend: "Đề thi TOEIC ETS Intermediate 2026",
    activeStyle: "bg-[#EEFDF8] text-[#0E9F9A] border-[#0E9F9A]",
  },
  "750": {
    label: "Target 750+",
    badge: "Thành thạo / Làm việc doanh nghiệp",
    sub: "Chinh phục bẫy Paraphrase Part 3-4 & Đọc hiểu đoạn kép/ba Part 7 tốc độ cao.",
    recommend: "Đề thi TOEIC ETS Advanced 2026",
    activeStyle: "bg-[#FFFBEB] text-[#D97706] border-[#D97706]",
  },
};

export default function HomeHeroTargetBanner({
  isGuest,
  userFullName,
}: HomeHeroTargetBannerProps) {
  const [selectedTarget, setSelectedTarget] = useState<TargetScoreLevel>("650");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("enstudey_user_target_score");
      if (saved && (saved === "500" || saved === "650" || saved === "750")) {
        setSelectedTarget(saved as TargetScoreLevel);
      }
    } catch {}
  }, []);

  const handleSelectTarget = (level: TargetScoreLevel) => {
    setSelectedTarget(level);
    try {
      localStorage.setItem("enstudey_user_target_score", level);
    } catch {}
  };

  const scrollToQuiz = () => {
    const quizElement = document.getElementById("daily-quiz-section");
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const config = TARGET_CONFIGS[selectedTarget];

  return (
    <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 md:p-8 shadow-xs relative">
      <div className="space-y-6">
        {/* Interactive Target Pills Selector */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#5C667A] uppercase tracking-wider block">
            Chọn mục tiêu TOEIC của bạn:
          </span>
          <div className="flex flex-wrap gap-2">
            {(["500", "650", "750"] as TargetScoreLevel[]).map((level) => {
              const isSelected = selectedTarget === level;
              const item = TARGET_CONFIGS[level];
              return (
                <button
                  key={level}
                  onClick={() => handleSelectTarget(level)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? item.activeStyle
                      : "bg-[#F7F8FC] text-[#5C667A] border-[#E4E8F1] hover:bg-[#F1F4FA]"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Subtitle Card based on Target */}
        <div className="bg-[#F7F8FC] border border-[#E4E8F1] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#3349D8]">
                {config.badge}
              </span>
              <span className="text-[#94A0B8]">•</span>
              <span className="text-xs font-medium text-[#5C667A]">
                Gợi ý: {config.recommend}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#16213A]">
              {config.sub}
            </p>
          </div>
        </div>

        {/* Hero Title & Value Proposition Subtitle */}
        <div className="space-y-2.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16213A] tracking-tight leading-tight">
            {isGuest ? (
              <>Tăng từ 500 &rarr; <span className="text-[#3349D8]">{selectedTarget}+ TOEIC</span> với lộ trình luyện đề cá nhân hóa</>
            ) : (
              <>Chào {userFullName || "Học Viên"}! Luyện đúng điểm yếu &rarr; Tăng điểm <span className="text-[#3349D8]">{selectedTarget}+ TOEIC</span> nhanh hơn</>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C667A] leading-relaxed">
            Thi thử chuẩn ETS 2026, phân tích điểm yếu bằng AI, tự động lưu câu sai và theo dõi tiến bộ từng ngày.
          </p>
        </div>

        {/* Primary CTA Buttons (Radius 8px rounded-lg) */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={scrollToQuiz}
            className="inline-flex items-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-sm px-6 h-11 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Luyện 10c Mini-Test ngay (Miễn phí)</span>
          </button>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F4FA] text-[#16213A] font-bold text-sm px-5 h-11 rounded-lg border border-[#E4E8F1] transition-all active:scale-95"
          >
            <GraduationCap className="w-4.5 h-4.5 text-[#3349D8]" />
            <span>Thi thử Full-Test 200 câu</span>
            <ArrowRight className="w-4 h-4 text-[#5C667A]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
