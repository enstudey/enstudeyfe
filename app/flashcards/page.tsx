import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardDashboard from "@/components/flashcards/FlashcardDashboard";

export const metadata: Metadata = {
  title: "Flashcard Học Từ Vựng TOEIC 600 - Spaced Repetition",
  description: "Ôn luyện 600 từ vựng TOEIC/IELTS theo phương pháp lặp lại ngắt quãng (SM-2) để tối ưu hóa khả năng ghi nhớ dài hạn.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function FlashcardsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest block">
            Ghi nhớ dài hạn 🧠⚡
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Flashcard Từ Vựng Thông Minh
          </h1>
          <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
            Học từ vựng cá nhân hóa theo phương pháp khoa học Spaced Repetition (SuperMemo-2). Ôn đúng lúc, nhớ đúng từ.
          </p>
        </div>

        <FlashcardDashboard token={token} isGuest={isGuest} />
      </main>

      <Footer />
    </div>
  );
}
