"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flashcard, CardProgress } from "@/lib/flashcards-helper";
import SpeechButton from "@/components/ui/speech-button";
import BookmarkButton from "@/components/ui/bookmark-button";
import ResultPageAffiliateBox from "@/components/affiliate/ResultPageAffiliateBox";

interface FlashcardSessionProps {
  topicId: string;
  cards: Flashcard[];
  progressMap: Record<string, CardProgress>;
  onRating: (cardId: string, rating: number, durationMs: number) => void;
  onBackToDashboard: () => void;
}

export default function FlashcardSession({
  topicId,
  cards,
  progressMap,
  onRating,
  onBackToDashboard,
}: FlashcardSessionProps) {
  const [queue, setQueue] = useState<Flashcard[]>(() => {
    const nowStr = new Date().toISOString().split("T")[0];
    return cards.filter((card) => {
      const prog = progressMap[card.id];
      if (!prog) return true;
      const reviewDateStr = prog.nextReviewDate.split("T")[0];
      return reviewDateStr <= nowStr;
    });
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Time & Ghost Timer states
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [flipDuration, setFlipDuration] = useState<number | null>(null);
  const [startGhostAnim, setStartGhostAnim] = useState(false);

  // Ref to tracking container height
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Trigger animation của Ghost Timer mượt mà khi đổi thẻ
  useEffect(() => {
    if (queue.length > 0 && !isFlipped) {
      const timer = setTimeout(() => {
        setStartGhostAnim(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, queue, isFlipped]);

  // Lật thẻ
  const handleFlip = useCallback(() => {
    if (!isFlipped) {
      const duration = Date.now() - startTime;
      setFlipDuration(duration);
    }
    setIsFlipped((prev) => !prev);
  }, [isFlipped, startTime]);

  // 2. Keyboard listeners cho Space, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setIsFlipped(false);
        setStartGhostAnim(false);
        setFlipDuration(null);
        setStartTime(Date.now());
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : queue.length - 1));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setIsFlipped(false);
        setStartGhostAnim(false);
        setFlipDuration(null);
        setStartTime(Date.now());
        setCurrentIndex((prev) => (prev < queue.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFlip, queue.length]);

  if (queue.length === 0) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-5 shadow-sm max-w-md mx-auto">
        <div className="text-4xl animate-bounce">🎉</div>
        <h3 className="text-base font-extrabold text-slate-900">
          Chủ đề &quot;{topicId}&quot; đã học hết!
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Thuật toán Spaced Repetition sẽ tự động phân bổ lịch ôn tập tiếp theo. Hãy quay lại sau nhé!
        </p>

        <ResultPageAffiliateBox testType="flashcard" />

        <div className="pt-2">
          <Button
            size="sm"
            onClick={onBackToDashboard}
            className="cursor-pointer font-bold rounded-xl shadow hover:scale-[1.02] transition-all"
          >
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];
  const cardProg = progressMap[currentCard.id];
  const hasGhost = cardProg && cardProg.repetition >= 1 && cardProg.ghostDurationMs;
  const ghostDuration = cardProg?.ghostDurationMs || 0;

  // Submit Rating
  const handleRateClick = (rating: number) => {
    const finalDuration = flipDuration || (Date.now() - startTime);
    onRating(currentCard.id, rating, finalDuration);

    setIsFlipped(false);
    setStartGhostAnim(false);
    setFlipDuration(null);
    setStartTime(Date.now());

    setTimeout(() => {
      const nextQueue = queue.filter((_, idx) => idx !== currentIndex);
      setQueue(nextQueue);
      if (currentIndex >= nextQueue.length && nextQueue.length > 0) {
        setCurrentIndex(0);
      }
    }, 200);
  };

  // So sánh tốc độ phản xạ
  const getGhostFeedback = () => {
    if (!flipDuration || !ghostDuration) return null;
    const diff = (flipDuration - ghostDuration) / 1000;

    if (diff < 0) {
      return (
        <Badge variant="secondary" className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 border-0">
          ⚡ Nhanh hơn {Math.abs(diff).toFixed(1)}s! (Kỷ lục: {(ghostDuration / 1000).toFixed(1)}s)
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5">
          🐌 Chậm hơn {diff.toFixed(1)}s (Mục tiêu: {(ghostDuration / 1000).toFixed(1)}s)
        </Badge>
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6" ref={containerRef}>
      {/* Top Header Session */}
      <div className="flex justify-between items-center px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          &larr; Thoát
        </Button>
        <span className="text-xs font-extrabold text-slate-400">
          Chủ đề: <span className="text-blue-600">{topicId}</span> ({queue.length} từ còn lại)
        </span>
      </div>

      {/* Card Wrapper */}
      <div className="relative w-full aspect-[4/3] min-h-[280px] perspective select-none">
        <div
          className={`w-full h-full duration-500 transform-style-3d relative cursor-pointer ${isFlipped ? "rotate-y-180" : ""
            }`}
          onClick={handleFlip}
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between items-center shadow-md overflow-hidden">
            {/* Ghost Timer progress bar */}
            {hasGhost && !isFlipped && (
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                <div
                  className="h-full bg-blue-400/40 transition-all ease-linear"
                  style={{
                    width: startGhostAnim ? "100%" : "0%",
                    transitionDuration: startGhostAnim ? `${ghostDuration}ms` : "0ms",
                  }}
                ></div>
              </div>
            )}

            <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 uppercase tracking-wider">
              {hasGhost ? "🔥 Ôn tập phản xạ" : "Thẻ mới"}
            </Badge>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentCard.word}
                </h3>
                <div className="flex items-center gap-1.5">
                  <SpeechButton
                    key={currentCard.id}
                    text={currentCard.word}
                    id={currentCard.id}
                    testId="btn-speak-word"
                  />
                  <BookmarkButton
                    id={currentCard.id}
                    word={currentCard.word}
                    meaning={currentCard.meaning}
                    ipa={currentCard.ipa}
                  />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400 font-mono">
                {currentCard.ipa}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="font-bold text-xs rounded-xl shadow cursor-pointer hover:scale-[1.02] transition-all"
            >
              Lật xem nghĩa &rarr;
            </Button>
          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between items-center shadow-md">
            <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100">
              <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 bg-blue-100 text-blue-750 uppercase tracking-wider">
                Giải nghĩa
              </Badge>
              {getGhostFeedback()}
            </div>

            <div className="text-center space-y-3 px-4 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium font-mono">
                <span>{currentCard.word}</span>
                <div className="flex items-center gap-1">
                  <SpeechButton
                    key={`${currentCard.id}-back`}
                    text={currentCard.word}
                    id={currentCard.id}
                    size="sm"
                    testId="btn-speak-word-back"
                  />
                  <BookmarkButton
                    id={currentCard.id}
                    word={currentCard.word}
                    meaning={currentCard.meaning}
                    ipa={currentCard.ipa}
                    className="scale-90"
                  />
                </div>
              </div>
              <h4 className="text-lg font-extrabold text-blue-700">
                {currentCard.meaning}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {currentCard.description}
              </p>
            </div>

            {/* Ratings Actions */}
            <div
              className="flex gap-2 w-full pt-4 border-t border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => handleRateClick(2)}
                variant="outline"
                className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
              >
                Khó
              </Button>
              <Button
                onClick={() => handleRateClick(4)}
                variant="outline"
                className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
              >
                Trung bình
              </Button>
              <Button
                onClick={() => handleRateClick(5)}
                variant="outline"
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer"
              >
                Dễ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
