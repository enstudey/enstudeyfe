import Link from "next/link";
import { Sparkles, Check, ArrowRight, Crown } from "lucide-react";

export default function HomePremiumBanner() {
  const benefits = [
    "Không giới hạn 200+ bộ đề thi ETS Reading & Listening",
    "AI Giải thích chuyên sâu từng đáp án & phân tích bẫy đề thi",
    "Trải nghiệm học tập tập trung 100% không quảng cáo",
  ];

  return (
    <section className="bg-gradient-to-r from-[#16213A] to-[#1E294B] rounded-xl p-6 md:p-8 text-[#FFFFFF] shadow-sm relative overflow-hidden">
      {/* Decorative Glow background overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3349D8]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3349D8]/40 border border-[#3349D8]/60 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-amber-300" />
            <span>Nâng cấp trải nghiệm Premium</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
            Chinh phục TOEIC tốc độ cao với các công cụ AI thông minh
          </h2>

          <ul className="space-y-2 pt-1">
            {benefits.map((text, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <div className="w-4 h-4 rounded-full bg-[#0E9F9A]/20 text-[#0E9F9A] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-8 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Chi phí ưu đãi học viên</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tabular-nums">
                66.000đ
              </span>
              <span className="text-xs text-slate-300 font-medium">/tháng</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">Gói 3 tháng phổ biến nhất</div>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] font-bold text-xs sm:text-sm px-5 h-10 rounded-lg transition duration-150 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Khám phá gói Premium</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
