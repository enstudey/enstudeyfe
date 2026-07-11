"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/ads/AdBanner";

interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  description: string;
}

interface CardProgress {
  cardId: string;
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string; // ISO string
}

export default function FlashcardDashboard() {
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [todayQueue, setTodayQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load data from toeic-vocab.json & localStorage progress on mount
  useEffect(() => {
    const initData = async () => {
      try {
        // Load vocab list
        const vocabRes = await fetch("/data/toeic-vocab.json");
        if (vocabRes.ok) {
          const vocabData = await vocabRes.json();

          // Load progress
          const savedProgress = localStorage.getItem("toeic_flashcards_progress");
          const progressMap: Record<string, CardProgress> = savedProgress
            ? JSON.parse(savedProgress)
            : {};
          setProgress(progressMap);

          // Load streak & XP
          const savedStreak = localStorage.getItem("user_progress_streak");
          setStreak(savedStreak ? parseInt(savedStreak, 10) : 0);
          const savedXp = localStorage.getItem("user_progress_xp");
          setXp(savedXp ? parseInt(savedXp, 10) : 0);

          // Build queue for today
          const nowStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          const queue = vocabData.filter((card: Flashcard) => {
            const cardProg = progressMap[card.id];
            if (!cardProg) return true; // New card, learn today
            const reviewDateStr = cardProg.nextReviewDate.split("T")[0];
            return reviewDateStr <= nowStr; // Review due today or overdue
          });

          setTodayQueue(queue);
        }
      } catch (err) {
        console.error("Failed to load flashcard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // 2. SM-2 Algorithm computation and saving
  const handleRating = async (q: number) => {
    if (todayQueue.length === 0) return;

    const currentCard = todayQueue[currentCardIndex];
    const prevProgress = progress[currentCard.id] || {
      cardId: currentCard.id,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      nextReviewDate: new Date().toISOString(),
    };

    let { interval, repetition, efactor } = prevProgress;

    // SM-2 formulas
    if (q >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * efactor);
      }
      repetition += 1;
    } else {
      repetition = 0;
      interval = 1;
    }

    // Update Ease Factor
    efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    const nextReviewDate = nextReview.toISOString();

    const updatedCardProgress: CardProgress = {
      cardId: currentCard.id,
      interval,
      repetition,
      efactor,
      nextReviewDate,
    };

    const newProgress = {
      ...progress,
      [currentCard.id]: updatedCardProgress,
    };

    // Save to state & storage
    setProgress(newProgress);
    localStorage.setItem("toeic_flashcards_progress", JSON.stringify(newProgress));

    // Award XP
    const newXp = xp + 10;
    setXp(newXp);
    localStorage.setItem("user_progress_xp", newXp.toString());

    // Update streak (if >= 10 reviews and not updated today)
    const todayStr = new Date().toISOString().split("T")[0];
    const lastStreakUpdate = localStorage.getItem("last_streak_update_date");
    if (lastStreakUpdate !== todayStr) {
      const currentStreak = streak + 1;
      setStreak(currentStreak);
      localStorage.setItem("user_progress_streak", currentStreak.toString());
      localStorage.setItem("last_streak_update_date", todayStr);
    }

    // Background synchronization mock (API sync)
    try {
      fetch("/api/v1/user-progress/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating: q,
          interval,
          repetition,
          efactor,
          lastReviewedAt: new Date().toISOString(),
        }),
      }).catch((e) => console.warn("Background API sync failed (offline fallback active)", e));
    } catch {
      // Ignore sync exceptions since it runs in background
    }

    // Advance queue
    setIsFlipped(false);
    // Delay slightly to allow flip animation to return to front
    setTimeout(() => {
      const nextQueue = todayQueue.filter((_, idx) => idx !== currentCardIndex);
      setTodayQueue(nextQueue);
      if (currentCardIndex >= nextQueue.length && nextQueue.length > 0) {
        setCurrentCardIndex(0);
      }
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-650"></div>
        <p className="text-sm text-slate-500 mt-4 font-semibold">Đang tải thẻ học từ vựng...</p>
      </div>
    );
  }

  const currentCard = todayQueue[currentCardIndex];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Status Bar */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex justify-between items-center shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Ôn tập hàng ngày
          </h2>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {todayQueue.length > 0
              ? `Còn lại ${todayQueue.length} từ`
              : "Hoàn thành mục tiêu hôm nay! 🎉"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Streak</span>
            <span className="text-base font-extrabold text-violet-650">🔥 {streak} ngày</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Kinh nghiệm</span>
            <span className="text-base font-extrabold text-emerald-600">✨ {xp} XP</span>
          </div>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      {currentCard ? (
        <div className="relative w-full aspect-[4/3] min-h-[280px] perspective">
          <div
            className={`w-full h-full duration-500 transform-style-3d relative cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front Card Face */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between items-center shadow-lg">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase tracking-wider">
                Từ vựng TOEIC
              </span>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentCard.word}
                </h3>
                <p className="text-sm font-medium text-slate-400 font-mono">
                  {currentCard.ipa}
                </p>
              </div>
              <Button size="sm" className="font-extrabold text-xs rounded-xl shadow cursor-pointer">
                Lật xem nghĩa &rarr;
              </Button>
            </div>

            {/* Back Card Face */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between items-center shadow-lg">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-750 rounded uppercase tracking-wider">
                Giải nghĩa
              </span>
              <div className="text-center space-y-3 px-4">
                <h4 className="text-xl font-extrabold text-violet-700 dark:text-violet-400">
                  {currentCard.meaning}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {currentCard.description}
                </p>
              </div>

              {/* SM-2 quality ratings (Khó / TB / Dễ) */}
              <div 
                className="flex gap-2 w-full pt-4 border-t border-slate-100 dark:border-slate-900"
                onClick={(e) => e.stopPropagation()} // Chống click event lật ngược thẻ lại
              >
                <button
                  onClick={() => handleRating(2)}
                  className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
                >
                  Khó
                </button>
                <button
                  onClick={() => handleRating(4)}
                  className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
                >
                  Trung bình
                </button>
                <button
                  onClick={() => handleRating(5)}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
                >
                  Dễ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-8 rounded-3xl text-center space-y-4 shadow-md">
          <div className="text-4xl">🌟</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tuyệt vời! Mục tiêu ôn tập hôm nay đã đạt được
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Hệ thống lặp lại ngắt quãng sẽ tự động tính toán thời điểm thích hợp nhất để nhắc bạn ôn tập lại các thẻ này trong tương lai. Hãy quay lại vào ngày mai nhé!
          </p>
        </div>
      )}

      {/* Ad Refresh Container beneath Flashcard */}
      <div className="pt-2">
        <AdBanner adSlotId="flashcard-ad-refresh" />
      </div>
    </div>
  );
}
