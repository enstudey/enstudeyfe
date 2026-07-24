import React from "react";
import GuestHeroOutcome from "@/components/home/GuestHeroOutcome";
import HomeHowItWorks from "@/components/home/HomeHowItWorks";
import HomeSocialProof from "@/components/home/HomeSocialProof";
import DailyQuizWidget from "@/components/quiz/DailyQuizWidget";
import ExamLibraryShelf from "@/components/exam/ExamLibraryShelf";
import HomePremiumBanner from "@/components/home/HomePremiumBanner";
import StarterPackWidget from "@/components/affiliate/StarterPackWidget";

export default function GuestLandingPage() {
  return (
    <div className="space-y-10">
      {/* 1. Outcome Hero with Diagnostic Selector Form */}
      <GuestHeroOutcome />

      {/* 2. How EnStudey Works (3-Step Method) */}
      <HomeHowItWorks />

      {/* 3. Social Proof & Trust Metrics */}
      <HomeSocialProof />

      {/* 4. Diagnostic Quiz Section (10-Question Daily Mini-Test Demo) */}
      <section id="daily-quiz-section" className="space-y-4">
        <div className="flex flex-col space-y-1">
          <h2 className="text-xl font-extrabold text-[#16213A] tracking-tight">
            Trải nghiệm làm bài thi thử chẩn đoán (Diagnostic Test 10 câu)
          </h2>
          <p className="text-xs text-[#5C667A]">
            Làm bài test 15 phút không cần đăng nhập để nhận phân tích điểm ước tính ngay
          </p>
        </div>
        <DailyQuizWidget isGuest={true} />
      </section>

      {/* 5. Kho Đề Thi Thử TOEIC ETS 2026 */}
      <ExamLibraryShelf />

      {/* 6. Soft Premium Awareness Banner */}
      <HomePremiumBanner />

      {/* 7. Khuyến nghị Sách & Giáo trình ETS Affiliate */}
      <StarterPackWidget />
    </div>
  );
}
