"use client";

import React, { useState, useEffect } from "react";
import AdBanner from "@/components/ads/AdBanner";
import BentoGrid from "./BentoGrid";
import FlashcardSession from "./FlashcardSession";
import {
  Flashcard,
  CardProgress,
  getTopicStatusList,
  groupVocabByTopic
} from "@/lib/flashcards-helper";
import { updateStreakAndXp } from "@/lib/streak-helper";

export default function FlashcardDashboard() {
  const [examType, setExamType] = useState<"TOEIC" | "IELTS">(() => {
    if (typeof window !== "undefined") {
      const savedExam = localStorage.getItem("flashcard_exam_type");
      if (savedExam === "TOEIC" || savedExam === "IELTS") {
        return savedExam;
      }
    }
    return "TOEIC";
  });
  const [view, setView] = useState<"grid" | "session">("grid");
  const [activeTopicId, setActiveTopicId] = useState<string>("");

  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [allVocab, setAllVocab] = useState<Flashcard[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Chỉ gọi API nạp dữ liệu khi examType thay đổi
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        localStorage.setItem("flashcard_exam_type", examType);

        // Load file JSON tĩnh tương ứng
        const jsonFile = examType === "TOEIC" ? "toeic-vocab.json" : "ielts-vocab.json";
        const vocabRes = await fetch(`/english-data/${jsonFile}`);
        
        if (vocabRes.ok) {
          const vocabData = await vocabRes.json();
          setAllVocab(vocabData);

          const progressKey = examType === "TOEIC" ? "toeic_flashcards_progress" : "ielts_flashcards_progress_v2";
          const savedProgress = localStorage.getItem(progressKey);
          const progressMap: Record<string, CardProgress> = savedProgress
            ? JSON.parse(savedProgress)
            : {};
          setProgress(progressMap);

          // Load streak & XP chung
          const savedStreak = localStorage.getItem("user_progress_streak");
          setStreak(savedStreak ? parseInt(savedStreak, 10) : 0);
          const savedXp = localStorage.getItem("user_progress_xp");
          setXp(savedXp ? parseInt(savedXp, 10) : 0);
        }
      } catch (err) {
        console.error("Failed to load flashcard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [examType]);

  const handleSwitchExam = (type: "TOEIC" | "IELTS") => {
    setExamType(type);
    setView("grid");
  };

  // 2. Xử lý Rating SM-2 và Ghost Timer
  const handleRating = (cardId: string, q: number, durationMs: number) => {
    const prevProgress = progress[cardId] || {
      cardId,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      nextReviewDate: new Date().toISOString(),
      lastReviewedAt: new Date().toISOString()
    };

    let { interval, repetition, efactor, ghostDurationMs } = prevProgress;

    // SM-2 Algorithm
    if (q >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * efactor);
      }
      repetition += 1;

      // Cập nhật kỷ lục Ghost Timer (chỉ khi phản xạ tốt và rating >= 3)
      if (durationMs >= 500 && durationMs <= 30000) {
        if (!ghostDurationMs || durationMs < ghostDurationMs) {
          ghostDurationMs = durationMs;
        }
      }
    } else {
      repetition = 0;
      interval = 1;
    }

    // Ease Factor
    efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const updatedCardProgress: CardProgress = {
      cardId,
      interval,
      repetition,
      efactor,
      nextReviewDate: nextReview.toISOString(),
      lastReviewedAt: new Date().toISOString(),
      ghostDurationMs
    };

    const newProgress = {
      ...progress,
      [cardId]: updatedCardProgress
    };

    setProgress(newProgress);
    
    const progressKey = examType === "TOEIC" ? "toeic_flashcards_progress" : "ielts_flashcards_progress_v2";
    localStorage.setItem(progressKey, JSON.stringify(newProgress));

    // Award XP & Update Streak
    const { currentStreak, xp: newXp } = updateStreakAndXp(10);
    setXp(newXp);
    setStreak(currentStreak);

    // Background API Sync (Mock fallback)
    try {
      fetch("/api/v1/user-progress/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          rating: q,
          interval,
          repetition,
          efactor,
          lastReviewedAt: new Date().toISOString()
        })
      }).catch((e) => console.warn("Background API sync failed (offline mode active)", e));
    } catch {
      // Bỏ qua lỗi kết nối ngầm
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-650"></div>
        <p className="text-xs text-slate-500 mt-3 font-semibold">Đang nạp dữ liệu từ vựng...</p>
      </div>
    );
  }

  // Phân tích dữ liệu để hiển thị Bento Grid
  const groupedVocab = groupVocabByTopic(allVocab);
  const topicList = getTopicStatusList(groupedVocab, progress);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Widget (Streak / XP / Tab Selector) */}
      {view === "grid" && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          {/* Tabs switch */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => handleSwitchExam("TOEIC")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                examType === "TOEIC"
                  ? "bg-white dark:bg-slate-800 text-violet-750 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              TOEIC 600 từ
            </button>
            <button
              onClick={() => handleSwitchExam("IELTS")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                examType === "IELTS"
                  ? "bg-white dark:bg-slate-800 text-violet-750 dark:text-violet-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              IELTS Cốt lõi
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 w-full sm:w-auto justify-end sm:justify-start px-2">
            <div className="text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Streak</span>
              <span className="text-sm font-extrabold text-violet-650">🔥 {streak} ngày</span>
            </div>
            <div className="text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Kinh nghiệm</span>
              <span className="text-sm font-extrabold text-emerald-600">✨ {xp} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Display */}
      {view === "grid" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Bản đồ chủ đề ({topicList.length})
            </h2>
          </div>
          <BentoGrid
            topics={topicList}
            onSelectTopic={(topicId) => {
              setActiveTopicId(topicId);
              setView("session");
            }}
          />
        </div>
      ) : (
        <FlashcardSession
          topicId={activeTopicId}
          cards={groupedVocab[activeTopicId] || []}
          progressMap={progress}
          onRating={handleRating}
          onBackToDashboard={() => setView("grid")}
        />
      )}

      {/* 3. Bottom Banner Anti CLS */}
      <div className="pt-4">
        <AdBanner adSlotId="flashcard-bento-bottom" />
      </div>
    </div>
  );
}
