"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/ads/AdBanner";
import { QuizQuestion } from "@/lib/quiz-helper";
import { Timer, ArrowLeft, ArrowRight, CheckSquare, Award } from "lucide-react";

interface QuizSessionProps {
  questions: QuizQuestion[];
  examType: "TOEIC" | "IELTS";
  onComplete: (answers: Record<string, number>, elapsedSeconds: number) => void;
}

export default function QuizSession({ questions, examType, onComplete }: QuizSessionProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút = 900 giây
  const [isInitialized, setIsInitialized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // answersRef dùng để tránh re-create handleSubmit khi answers thay đổi
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Khai báo handleSubmit trước khi dùng trong useEffect
  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Xóa session làm bài khi nộp
    localStorage.removeItem("daily_quiz_session");

    // Tính thời gian đã làm bài thực tế (tối đa 900 giây)
    const elapsedSeconds = Math.min(900, Math.floor((Date.now() - startTime) / 1000));
    
    onComplete(answersRef.current, elapsedSeconds);
  }, [startTime, onComplete]);

  // Initialize session (restore from localStorage or create new)
  useEffect(() => {
    const saved = localStorage.getItem("daily_quiz_session");
    let initialAnswers: Record<string, number> = {};
    let initialIndex = 0;
    let initialStartTime = Date.now();

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Kiểm tra xem session có trùng loại đề thi và chưa quá hạn 15 phút không
        if (parsed.examType === examType && parsed.startTime && Date.now() - parsed.startTime < 900000) {
          initialAnswers = parsed.answers || {};
          initialIndex = parsed.currentIndex || 0;
          initialStartTime = parsed.startTime;
        }
      } catch (e) {
        console.error("Failed to parse saved quiz session, creating new", e);
      }
    }

    // Bọc trong setTimeout để tránh gọi setState đồng bộ trong effect
    const timer = setTimeout(() => {
      setAnswers(initialAnswers);
      setCurrentIndex(initialIndex);
      setStartTime(initialStartTime);
      setIsInitialized(true);
    }, 0);

    // Nếu tạo session mới, lưu ngay vào localStorage
    if (!saved || JSON.parse(saved).examType !== examType || Date.now() - JSON.parse(saved).startTime >= 900000) {
      localStorage.setItem(
        "daily_quiz_session",
        JSON.stringify({
          examType,
          answers: initialAnswers,
          currentIndex: initialIndex,
          startTime: initialStartTime,
        })
      );
    }

    return () => clearTimeout(timer);
  }, [examType]);

  // Bộ đếm thời gian thực
  useEffect(() => {
    if (!isInitialized || startTime === 0) return;

    const tick = () => {
      const elapsedMs = Date.now() - startTime;
      const remainingSecs = Math.max(0, 900 - Math.floor(elapsedMs / 1000));
      setTimeLeft(remainingSecs);

      if (remainingSecs <= 0) {
        handleSubmit();
      }
    };

    tick(); // chạy lần đầu ngay lập tức
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInitialized, startTime, handleSubmit]);

  // Lưu tiến độ dở dang mỗi khi answers hoặc currentIndex thay đổi
  const saveProgress = (updatedAnswers: Record<string, number>, index: number) => {
    if (startTime === 0) return;
    localStorage.setItem(
      "daily_quiz_session",
      JSON.stringify({
        examType,
        answers: updatedAnswers,
        currentIndex: index,
        startTime,
      })
    );
  };

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentIndex].id]: optionIndex,
    };
    setAnswers(updatedAnswers);
    saveProgress(updatedAnswers, currentIndex);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      saveProgress(answers, nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      saveProgress(answers, prevIndex);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    saveProgress(answers, index);
  };

  // Xác định adKey để refresh AdBanner khi trả lời xong câu số 5 (index 4)
  const isQuestion5Answered = questions[4] && answers[questions[4].id] !== undefined;
  const adKey = isQuestion5Answered ? 1 : 0;

  if (!isInitialized || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm font-medium">Đang chuẩn bị đề thi...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 120; // Dưới 2 phút hiển thị cảnh báo đỏ

  return (
    <div className="grid gap-8 lg:grid-cols-3 items-start text-left">
      {/* Cột trái & giữa: Nội dung câu hỏi */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Bar & Header */}
        <div className="bg-card border border-card-border p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Câu hỏi {currentIndex + 1} trên {questions.length}</span>
            <span className="text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider">
              {examType} • {currentQuestion.part}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-600 h-full transition-all duration-350"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card câu hỏi */}
        <div className="bg-card border border-card-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">
              Topic: {currentQuestion.topic}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed pt-2">
              {currentQuestion.questionText}
            </h3>
          </div>

          {/* Các Options */}
          <div className="grid gap-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm font-medium transition duration-205 flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? "bg-violet-50 border-violet-500 text-violet-950 shadow-sm"
                      : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition duration-200 ${
                      isSelected
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Điều hướng */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-xl flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Câu trước
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-1.5 font-bold cursor-pointer"
              >
                Câu sau
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                data-testid="btn-submit-quiz"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                Nộp bài thi
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cột phải: Bảng điều khiển, Timer, Ads */}
      <div className="space-y-6">
        {/* Widget Timer & Nộp nhanh */}
        <div className="bg-card border border-card-border p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold opacity-70">Thời gian làm bài</span>
            <div
              data-testid="timer-countdown"
              className={`flex items-center gap-1.5 font-bold text-lg px-3 py-1 rounded-full ${
                isTimeCritical
                  ? "bg-red-50 text-red-650 animate-pulse"
                  : "bg-violet-50 text-violet-600"
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold opacity-50 mb-3">Bảng tiến trình câu hỏi</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center border transition cursor-pointer ${
                      isCurrent
                        ? "border-violet-600 bg-violet-50 text-violet-600 ring-2 ring-violet-500/20"
                        : isAnswered
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            data-testid="btn-submit-quiz"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Nộp bài
          </Button>
        </div>

        {/* Khung Quảng cáo AdSense chống CLS */}
        <div className="min-h-[250px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center relative">
          <AdBanner key={`quiz-ad-${adKey}`} adSlotId="daily-mini-test-ad" />
        </div>
      </div>
    </div>
  );
}
