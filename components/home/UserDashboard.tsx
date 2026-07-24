import React from "react";
import DailyQuizWidget from "@/components/quiz/DailyQuizWidget";
import HomeMistakeQuickWidget from "@/components/home/HomeMistakeQuickWidget";
import HomeStatsPredictorWidget from "@/components/home/HomeStatsPredictorWidget";
import ExamLibraryShelf from "@/components/exam/ExamLibraryShelf";
import HomePremiumBanner from "@/components/home/HomePremiumBanner";
import { Sparkles, Calendar, Flame } from "lucide-react";

interface UserDashboardProps {
  userFullName?: string;
  token?: string;
}

export default function UserDashboard({ userFullName, token }: UserDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Student Welcome & Daily Mission Banner */}
      <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EEFDF8] text-[#0E9F9A] text-xs font-bold border border-[#0E9F9A]/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Dashboard Học Viên Active</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#16213A] tracking-tight">
            Chào {userFullName || "Học Viên"}! Cùng hoàn thành nhiệm vụ hôm nay 🎯
          </h1>
          <p className="text-xs text-[#5C667A]">
            Duy trì chuỗi luyện đề 10 câu mỗi ngày để tăng từ 50 điểm TOEIC mỗi tháng
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-bold text-[#D97706]">
            <Flame className="w-4 h-4 fill-[#D97706]" />
            <span>Chuỗi: 3 Ngày</span>
          </div>
          <div className="bg-[#F7F8FC] border border-[#E4E8F1] rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-semibold text-[#5C667A]">
            <Calendar className="w-4 h-4 text-[#3349D8]" />
            <span>Hôm nay</span>
          </div>
        </div>
      </section>

      {/* Main Learning Bento Grid (Col 8 Mini-Test, Col 4 Mistake Bank Active) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div id="daily-quiz-section" className="md:col-span-8 h-full">
          <DailyQuizWidget userFullName={userFullName} token={token} />
        </div>

        <div className="md:col-span-4 h-full">
          <HomeMistakeQuickWidget isGuest={false} />
        </div>
      </section>

      {/* AI Score Prediction & Weakness Analysis */}
      <HomeStatsPredictorWidget isGuest={false} />

      {/* Kho Đề thi thử ETS 2026 */}
      <ExamLibraryShelf />

      {/* Premium Awareness Banner */}
      <HomePremiumBanner />
    </div>
  );
}
