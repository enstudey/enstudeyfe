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
import { fetchFlashcardProgress, evaluateFlashcard } from "@/lib/api/flashcard";

interface FlashcardDashboardProps {
  token?: string;
  isGuest?: boolean;
}

export default function FlashcardDashboard({ token, isGuest = true }: FlashcardDashboardProps) {
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
          
          let progressMap: Record<string, CardProgress> = {};

          if (!isGuest && token) {
            try {
              const res = await fetchFlashcardProgress(token);
              const apiProgress = res.data || [];
              apiProgress.forEach((item) => {
                progressMap[item.wordId] = {
                  cardId: item.wordId,
                  interval: item.interval,
                  repetition: item.repetition,
                  efactor: item.efactor,
                  nextReviewDate: item.nextReviewDate,
                  lastReviewedAt: item.lastReviewedAt || new Date().toISOString()
                };
              });
              // Cache vào localStorage
              localStorage.setItem(progressKey, JSON.stringify(progressMap));
            } catch (err) {
              console.warn("Failed to fetch progress from server, using offline cache", err);
              const savedProgress = localStorage.getItem(progressKey);
              progressMap = savedProgress ? JSON.parse(savedProgress) : {};
            }
          } else {
            // Guest mode
            const savedProgress = localStorage.getItem(progressKey);
            progressMap = savedProgress ? JSON.parse(savedProgress) : {};
          }

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
  }, [examType, token, isGuest]);

  // 2. Logic đồng bộ offline khi có mạng trở lại
  useEffect(() => {
    if (isGuest || !token) return;

    const syncOfflineEvaluations = async () => {
      const queueStr = localStorage.getItem("offline_flashcard_evaluations");
      if (!queueStr) return;
      try {
        const queue = JSON.parse(queueStr);
        if (queue.length === 0) return;

        console.log(`Syncing ${queue.length} offline evaluations to server...`);
        for (const item of queue) {
          await evaluateFlashcard(token, item.cardId, item.rating);
        }

        localStorage.removeItem("offline_flashcard_evaluations");
        console.log("Offline sync completed successfully!");

        // Refresh lại dữ liệu từ Server
        const progressKey = examType === "TOEIC" ? "toeic_flashcards_progress" : "ielts_flashcards_progress_v2";
        const res = await fetchFlashcardProgress(token);
        const apiProgress = res.data || [];
        const progressMap: Record<string, CardProgress> = {};
        apiProgress.forEach((item) => {
          progressMap[item.wordId] = {
            cardId: item.wordId,
            interval: item.interval,
            repetition: item.repetition,
            efactor: item.efactor,
            nextReviewDate: item.nextReviewDate,
            lastReviewedAt: item.lastReviewedAt || new Date().toISOString()
          };
        });
        setProgress(progressMap);
        localStorage.setItem(progressKey, JSON.stringify(progressMap));
      } catch (e) {
        console.warn("Offline sync attempt failed", e);
      }
    };

    const handleOnline = () => {
      syncOfflineEvaluations();
    };

    window.addEventListener("online", handleOnline);
    if (navigator.onLine) {
      syncOfflineEvaluations();
    }

    return () => window.removeEventListener("online", handleOnline);
  }, [token, isGuest, examType]);

  const handleSwitchExam = (type: "TOEIC" | "IELTS") => {
    setExamType(type);
    setView("grid");
  };

  // 3. Xử lý Rating SM-2 và Ghost Timer
  const handleRating = async (cardId: string, q: number, durationMs: number) => {
    const prevProgress = progress[cardId] || {
      cardId,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      nextReviewDate: new Date().toISOString(),
      lastReviewedAt: new Date().toISOString()
    };

    let { interval, repetition, efactor, ghostDurationMs } = prevProgress;

    // Cập nhật kỷ lục Ghost Timer (chỉ khi phản xạ tốt và rating >= 3)
    if (q >= 3 && durationMs >= 500 && durationMs <= 30000) {
      if (!ghostDurationMs || durationMs < ghostDurationMs) {
        ghostDurationMs = durationMs;
      }
    }

    let updatedCardProgress: CardProgress;
    const progressKey = examType === "TOEIC" ? "toeic_flashcards_progress" : "ielts_flashcards_progress_v2";

    if (!isGuest && token) {
      try {
        const response = await evaluateFlashcard(token, cardId, q);
        const data = response.data;

        updatedCardProgress = {
          cardId,
          interval: data.intervalDays,
          repetition: q >= 3 ? repetition + 1 : 0,
          efactor: data.easinessFactor,
          nextReviewDate: data.nextReviewDate,
          lastReviewedAt: new Date().toISOString(),
          ghostDurationMs
        };

        const newProgress = {
          ...progress,
          [cardId]: updatedCardProgress
        };
        setProgress(newProgress);
        localStorage.setItem(progressKey, JSON.stringify(newProgress));
      } catch (err) {
        console.warn("Sync evaluate to server failed, saving to offline queue", err);
        // Fallback tự tính toán ở Client khi offline
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

        efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (efactor < 1.3) efactor = 1.3;

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        updatedCardProgress = {
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
        localStorage.setItem(progressKey, JSON.stringify(newProgress));

        // Lưu vào hàng đợi offline
        const offlineQueue = JSON.parse(localStorage.getItem("offline_flashcard_evaluations") || "[]");
        offlineQueue.push({ cardId, rating: q, timestamp: Date.now() });
        localStorage.setItem("offline_flashcard_evaluations", JSON.stringify(offlineQueue));
      }
    } else {
      // Guest mode: hoàn toàn offline
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

      efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (efactor < 1.3) efactor = 1.3;

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      updatedCardProgress = {
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
      localStorage.setItem(progressKey, JSON.stringify(newProgress));
    }

    // Award XP & Update Streak
    const { currentStreak, xp: newXp } = updateStreakAndXp(10);
    setXp(newXp);
    setStreak(currentStreak);
  };

  // Phân tích dữ liệu để hiển thị Bento Grid
  const groupedVocab = groupVocabByTopic(allVocab);
  const topicList = getTopicStatusList(groupedVocab, progress);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <p className="text-xs text-slate-500 mt-3 font-semibold">Đang nạp dữ liệu từ vựng...</p>
      </div>
    );
  }

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
