"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  X,
  Info,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GrammarSwipeQuestion,
  GrammarSwipeSubmitRequest,
  getGrammarSwipeQuestions,
  submitGrammarSwipe
} from "@/lib/api/grammar-swipe";

interface GrammarSwipeContainerProps {
  isGuest: boolean;
  googleLoginUrl: string;
  token?: string;
}

interface UserAnswerLog {
  questionId: number;
  userAnswer: "CORRECT" | "INCORRECT";
  selectedErrorWord?: string;
  isAnswerCorrect: boolean;
}

export default function GrammarSwipeContainer({ isGuest, googleLoginUrl, token }: GrammarSwipeContainerProps) {
  const [questions, setQuestions] = useState<GrammarSwipeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States cho tương tác vuốt
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"LEFT" | "RIGHT" | null>(null);

  // States cho chế độ chọn từ bị sai (cho câu sai ngữ pháp)
  const [isWordSelectionMode, setIsWordSelectionMode] = useState(false);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);

  // Lịch sử trả lời và kết quả phiên
  const [answersLog, setAnswersLog] = useState<UserAnswerLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    score: number;
    total: number;
    xpEarned: number;
    mistakesSavedCount: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Tải danh sách câu hỏi
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSubmitResult(null);
    setAnswersLog([]);
    setCurrentIndex(0);
    setIsWordSelectionMode(false);
    setClickedWordIndex(null);
    try {
      const res = await getGrammarSwipeQuestions(token);
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        setError("Không có câu hỏi nào khả dụng.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải danh sách câu hỏi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadQuestions]);

  const currentQuestion = questions[currentIndex];

  // Xử lý nộp kết quả
  const submitSession = useCallback(async (finalLogs: UserAnswerLog[]) => {
    if (finalLogs.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload: GrammarSwipeSubmitRequest = {
        sessionId: `swp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        answers: finalLogs.map(log => ({
          questionId: log.questionId,
          userAnswer: log.userAnswer,
          selectedErrorWord: log.selectedErrorWord
        }))
      };
      const res = await submitGrammarSwipe(payload, token);
      if (res.data) {
        setSubmitResult(res.data);
      }
    } catch (err) {
      console.error(err);
      // Lưu offline nếu lỗi kết nối và có token
      if (token) {
        localStorage.setItem("swipe_pending_results", JSON.stringify({
          timestamp: Date.now(),
          logs: finalLogs
        }));
      }
      // Tính điểm tạm thời hiển thị trên UI client
      const score = finalLogs.filter(l => l.isAnswerCorrect).length;
      setSubmitResult({
        score,
        total: finalLogs.length,
        xpEarned: score,
        mistakesSavedCount: isGuest ? 0 : (finalLogs.length - score)
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [token, isGuest]);

  // Đồng bộ batch offline khi khôi phục mạng
  useEffect(() => {
    const handleOnline = async () => {
      const pending = localStorage.getItem("swipe_pending_results");
      if (pending && token) {
        try {
          const parsed = JSON.parse(pending);
          const payload: GrammarSwipeSubmitRequest = {
            sessionId: `swp-offline-${parsed.timestamp}`,
            answers: parsed.logs.map((log: UserAnswerLog) => ({
              questionId: log.questionId,
              userAnswer: log.userAnswer,
              selectedErrorWord: log.selectedErrorWord
            }))
          };
          await submitGrammarSwipe(payload, token);
          localStorage.removeItem("swipe_pending_results");
        } catch (err) {
          console.error("Failed to submit pending swipe results", err);
        }
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [token]);

  // Chuyển sang thẻ tiếp theo
  const moveToNext = useCallback((updatedLogs: UserAnswerLog[]) => {
    setIsWordSelectionMode(false);
    setClickedWordIndex(null);
    setSwipeDirection(null);
    setDragOffset({ x: 0, y: 0 });
    setIsAnimating(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitSession(updatedLogs);
    }
  }, [currentIndex, questions.length, submitSession]);

  // Xử lý logic chọn đáp án
  const handleAnswer = useCallback((direction: "LEFT" | "RIGHT") => {
    if (isAnimating || !currentQuestion) return;

    const isSwipeRight = direction === "RIGHT";
    const userAnswer = isSwipeRight ? "CORRECT" : "INCORRECT";

    // 1. Nếu câu hỏi ĐÚNG ngữ pháp (isCorrect = true):
    if (currentQuestion.isCorrect) {
      const isAnswerCorrect = isSwipeRight; // vuốt phải là ĐÚNG
      const newLog: UserAnswerLog = {
        questionId: currentQuestion.id,
        userAnswer,
        isAnswerCorrect
      };
      const nextLogs = [...answersLog, newLog];
      setAnswersLog(nextLogs);

      setIsAnimating(true);
      setSwipeDirection(direction);
      setTimeout(() => moveToNext(nextLogs), 600);
      return;
    }

    // 2. Nếu câu hỏi SAI ngữ pháp (isCorrect = false):
    if (!currentQuestion.isCorrect) {
      if (isSwipeRight) {
        // Vuốt phải (đoán câu Đúng) -> SAI hoàn toàn
        const newLog: UserAnswerLog = {
          questionId: currentQuestion.id,
          userAnswer,
          isAnswerCorrect: false
        };
        const nextLogs = [...answersLog, newLog];
        setAnswersLog(nextLogs);

        setIsAnimating(true);
        setSwipeDirection(direction);
        setTimeout(() => moveToNext(nextLogs), 600);
      } else {
        // Vuốt trái (đoán câu Sai) -> Bắt đầu chế độ chọn từ sai
        setIsWordSelectionMode(true);
      }
    }
  }, [currentQuestion, answersLog, isAnimating, moveToNext]);

  // Xử lý click chọn từ bị viết sai
  const handleWordClick = (word: string, wordIdx: number) => {
    if (!currentQuestion || clickedWordIndex !== null) return;

    setClickedWordIndex(wordIdx);

    // Chuẩn hóa từ để so sánh
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim().toLowerCase();
    const cleanErrorWord = currentQuestion.errorWord
      ? currentQuestion.errorWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim().toLowerCase()
      : "";

    // So sánh từ được click và từ lỗi thực tế
    const isWordCorrect = cleanWord === cleanErrorWord || wordIdx === currentQuestion.errorPosition;

    const newLog: UserAnswerLog = {
      questionId: currentQuestion.id,
      userAnswer: "INCORRECT",
      selectedErrorWord: word,
      isAnswerCorrect: isWordCorrect
    };

    const nextLogs = [...answersLog, newLog];
    setAnswersLog(nextLogs);

    // Delay ngắn để user thấy phản hồi màu sắc, sau đó chuyển câu
    setTimeout(() => {
      setIsAnimating(true);
      setSwipeDirection("LEFT");
      setTimeout(() => moveToNext(nextLogs), 600);
    }, 1500);
  };

  // Vuốt bằng chuột / chạm
  const handleDragStart = (clientX: number, clientY: number) => {
    if (isAnimating || isWordSelectionMode || !currentQuestion) return;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart) return;
    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleDragEnd = () => {
    if (!dragStart) return;

    const threshold = 120; // Khoảng cách tối thiểu để kích hoạt vuốt
    if (dragOffset.x > threshold) {
      handleAnswer("RIGHT");
    } else if (dragOffset.x < -threshold) {
      handleAnswer("LEFT");
    } else {
      // Reset về vị trí trung tâm
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  // Keyboard Shortcuts (Mũi tên trái/phải)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || isWordSelectionMode || !currentQuestion) return;
      if (e.key === "ArrowLeft") {
        handleAnswer("LEFT");
      } else if (e.key === "ArrowRight") {
        handleAnswer("RIGHT");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAnswer, isAnimating, isWordSelectionMode, currentQuestion]);

  if (isSubmitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Đang nộp bài và tính điểm...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Đang tải danh sách câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-5">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Đã xảy ra lỗi</h3>
        <p className="text-slate-500 text-sm">{error}</p>
        <Button onClick={loadQuestions} className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
          Thử lại
        </Button>
      </div>
    );
  }

  // Giao diện kết quả
  if (submitResult) {
    const accuracy = submitResult.total > 0 ? Math.round((submitResult.score / submitResult.total) * 100) : 0;
    return (
      <div className="max-w-md mx-auto px-6 py-12 space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-2">
            <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hoàn Thành Phiên Chơi!</h2>
          <p className="text-slate-500 text-sm">Báo cáo kết quả phiên vuốt ngữ pháp của bạn</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl">
            <div className="text-2xl font-extrabold text-blue-500 dark:text-blue-400 font-mono">
              {submitResult.score}/{submitResult.total}
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">ĐÚNG HOÀN TOÀN</div>
          </div>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              +{submitResult.xpEarned} XP
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">XP TÍCH LŨY</div>
          </div>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {accuracy}%
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">ĐỘ CHÍNH XÁC</div>
          </div>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl">
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {submitResult.mistakesSavedCount}
            </div>
            <div className="text-xs text-slate-400 font-bold mt-1">CÂU SAI ĐỒNG BỘ</div>
          </div>
        </div>

        {isGuest && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 rounded-xl p-4 text-xs text-left">
            Đăng nhập tài khoản để tích lũy XP bền vững và tự động lưu các câu làm sai vào Sổ tay câu sai (Mistake Bank).
            <a href={googleLoginUrl} className="block font-bold text-blue-655 dark:text-blue-400 hover:underline mt-2">
              Đăng nhập Google ngay &rarr;
            </a>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={loadQuestions}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl py-3 cursor-pointer text-xs"
          >
            Chơi lượt tiếp theo
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/luyen-de"}
            className="flex-1 font-bold border-slate-200 dark:border-slate-800 rounded-xl py-3 cursor-pointer text-xs"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Tính toán transform kéo thẻ
  let cardStyle: React.CSSProperties = {};
  if (dragOffset.x !== 0 || dragOffset.y !== 0) {
    const rotate = (dragOffset.x * 0.05);
    cardStyle = {
      transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotate}deg)`,
      transition: "none"
    };
  } else if (isAnimating && swipeDirection) {
    const flyX = swipeDirection === "RIGHT" ? 1000 : -1000;
    cardStyle = {
      transform: `translate3d(${flyX}px, 0, 0) rotate(${flyX * 0.05}deg)`,
      transition: "transform 0.5s ease-in-out"
    };
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 flex flex-col flex-1 justify-between min-h-[80vh] space-y-8 select-none">

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/luyen-de" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát phòng chơi</span>
        </Link>
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
          Thẻ {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-350"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Tinder Card Container */}
      <div className="flex-1 flex items-center justify-center py-6 min-h-[360px]">
        {currentQuestion && (
          <div
            ref={containerRef}
            style={cardStyle}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => dragStart && handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => dragStart && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            className={`w-full max-w-sm bg-white dark:bg-slate-950 border-2 rounded-3xl shadow-lg p-6 md:p-8 flex flex-col justify-between items-center text-center cursor-grab active:cursor-grabbing transition-transform duration-300 relative overflow-hidden ${isWordSelectionMode
                ? "border-blue-400 dark:border-blue-900"
                : dragOffset.x > 30
                  ? "border-emerald-400 dark:border-emerald-900 bg-emerald-50/5 dark:bg-emerald-950/5"
                  : dragOffset.x < -30
                    ? "border-red-400 dark:border-red-900 bg-red-50/5 dark:bg-red-950/5"
                    : "border-slate-200 dark:border-slate-850"
              }`}
          >
            {/* Visual indicator on card overlay */}
            {dragOffset.x > 50 && !isWordSelectionMode && (
              <div className="absolute top-6 right-6 border-4 border-emerald-500 text-emerald-500 font-extrabold text-sm uppercase px-3 py-1 rounded-lg transform rotate-12 z-20">
                Đúng
              </div>
            )}
            {dragOffset.x < -50 && !isWordSelectionMode && (
              <div className="absolute top-6 left-6 border-4 border-red-500 text-red-500 font-extrabold text-sm uppercase px-3 py-1 rounded-lg transform -rotate-12 z-20">
                Sai
              </div>
            )}

            {/* Chế độ chọn từ bị sai */}
            {isWordSelectionMode ? (
              <div className="w-full flex-1 flex flex-col justify-center space-y-6">
                <div className="space-y-1">
                  <span className="text-blue-655 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    Chế độ phát hiện lỗi
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    Click trực tiếp vào từ viết sai ngữ pháp:
                  </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 font-medium text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                  {currentQuestion.questionText.split(" ").map((word, idx) => {
                    const isClicked = clickedWordIndex === idx;

                    // Logic màu sắc hiển thị sau khi click chọn từ
                    let btnColor = "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 hover:bg-slate-100";
                    if (clickedWordIndex !== null) {
                      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim().toLowerCase();
                      const cleanErrorWord = currentQuestion.errorWord
                        ? currentQuestion.errorWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim().toLowerCase()
                        : "";

                      const isWordCorrect = cleanWord === cleanErrorWord || idx === currentQuestion.errorPosition;
                      if (isWordCorrect) {
                        btnColor = "bg-emerald-500 border-emerald-600 text-white dark:bg-emerald-600 dark:border-emerald-700";
                      } else if (isClicked) {
                        btnColor = "bg-red-500 border-red-600 text-white dark:bg-red-600 dark:border-red-700";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={clickedWordIndex !== null}
                        onClick={() => handleWordClick(word, idx)}
                        className={`px-2.5 py-1 rounded-lg border text-sm font-bold transition cursor-pointer select-text ${btnColor}`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {clickedWordIndex !== null && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-850 p-4 rounded-xl text-left text-xs text-slate-600 dark:text-slate-400 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" />
                      <span>Giải thích lỗi sai</span>
                    </div>
                    <p className="leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              // Chế độ đọc câu hỏi chính
              <div className="w-full flex-1 flex flex-col justify-center py-6 space-y-6">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Grammar Swipe
                </span>
                <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed max-w-xs mx-auto">
                  &ldquo;{currentQuestion.questionText}&rdquo;
                </p>
              </div>
            )}

            {/* Card Footer Hints */}
            {!isWordSelectionMode && (
              <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">&larr; Vuốt Sai</span>
                <span className="flex items-center gap-1">Vuốt Đúng &rarr;</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons (cho máy tính không cảm ứng) */}
      {!isWordSelectionMode && (
        <div className="flex justify-center items-center gap-6">
          <button
            disabled={isAnimating}
            onClick={() => handleAnswer("LEFT")}
            className="w-14 h-14 rounded-full bg-white dark:bg-slate-950 border-2 border-red-100 dark:border-red-950 text-red-500 shadow-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="text-slate-400 dark:text-slate-600 hidden md:block text-xs font-semibold">
            Dùng phím tắt <span className="px-1.5 py-0.5 border rounded bg-slate-50 dark:bg-slate-900">&larr;</span> <span className="px-1.5 py-0.5 border rounded bg-slate-50 dark:bg-slate-900">&rarr;</span>
          </div>
          <button
            disabled={isAnimating}
            onClick={() => handleAnswer("RIGHT")}
            className="w-14 h-14 rounded-full bg-white dark:bg-slate-950 border-2 border-emerald-100 dark:border-emerald-950 text-emerald-500 shadow-md flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:scale-95 transition cursor-pointer"
          >
            <Check className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Ad banner placeholder (CLS and AdSense Compliance) */}
      <div className="w-full min-h-[90px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 py-2 relative">
        <span className="text-[9px] text-slate-400 dark:text-slate-500 absolute top-1.5 left-3.5 tracking-wider uppercase font-bold">Liên kết tài trợ</span>
        <span className="text-xs text-slate-350 dark:text-slate-600 font-medium">Hệ thống quảng cáo AdSense</span>
      </div>

    </div>
  );
}

// React module CSS helper
import Link from "next/link";
