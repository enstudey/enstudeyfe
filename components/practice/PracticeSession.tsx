"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getPracticeQuestions, submitPractice, PracticeQuestion } from "@/lib/api/practice";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Volume2, BookOpen, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import PracticeResult from "./PracticeResult";

interface PracticeSessionProps {
  token?: string;
  examType: string;
  part: string;
  difficulty: string;
  limit: number;
  mode: "PRACTICE" | "TEST";
}

interface SavedSession {
  examType: string;
  part: string;
  difficulty: string;
  limit: number;
  mode: "PRACTICE" | "TEST";
  answers: Record<number, number>;
  currentIndex: number;
  elapsedSeconds: number;
  questions: PracticeQuestion[];
  savedAt: number;
}

export default function PracticeSession({
  token,
  examType,
  part,
  difficulty,
  limit,
  mode
}: PracticeSessionProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  
  // Timer: TEST mode đếm ngược, PRACTICE mode đếm xuôi
  const [timeLeft, setTimeLeft] = useState<number>(limit * 120); // 2 phút/câu cho TEST mode
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const answersRef = useRef<Record<number, number>>(answers);

  // Đồng bộ answersRef với state answers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Khôi phục offline submit khi mạng phục hồi
  const processOfflineQueue = useCallback(async () => {
    const offlinePayload = localStorage.getItem("offline_sectional_practice");
    if (!offlinePayload || !token) return;

    try {
      const parsed = JSON.parse(offlinePayload);
      await submitPractice(parsed, token);
      localStorage.removeItem("offline_sectional_practice");
      console.log("Successfully synced offline practice submit to server.");
    } catch (e) {
      console.error("Failed to sync offline practice submit.", e);
    }
  }, [token]);

  useEffect(() => {
    window.addEventListener("online", processOfflineQueue);
    return () => window.removeEventListener("online", processOfflineQueue);
  }, [processOfflineQueue]);

  // Submit bài làm
  const handleSubmit = useCallback(async (finalAnswers = answersRef.current) => {
    if (questions.length === 0 || submitting) return;
    setSubmitting(true);

    // Chuẩn bị payload nộp bài
    const payloadAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : -1
    })).filter(ans => ans.selectedIndex !== -1);

    const submitPayload = {
      part,
      examType,
      answers: payloadAnswers
    };

    const isGuest = !token;

    if (isGuest) {
      // Chế độ khách: Tự chấm điểm tại Client-side (Zero-cost / Offline First)
      let correct = 0;
      questions.forEach((q) => {
        if (finalAnswers[q.id] !== undefined && finalAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      });
      const calculatedScore = questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100);
      setScore(calculatedScore);
      setCorrectCount(correct);
      setIsCompleted(true);
      setSubmitting(false);
      localStorage.removeItem("sectional_practice_session");
      return;
    }

    try {
      if (!window.navigator.onLine) {
        // Mất mạng: Lưu hàng đợi offline
        localStorage.setItem("offline_sectional_practice", JSON.stringify(submitPayload));
        // Tự chấm điểm tạm thời cho học viên để hiển thị UI
        let correct = 0;
        questions.forEach((q) => {
          if (finalAnswers[q.id] !== undefined && finalAnswers[q.id] === q.correctIndex) {
            correct++;
          }
        });
        const calculatedScore = questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100);
        setScore(calculatedScore);
        setCorrectCount(correct);
        setIsCompleted(true);
        setErrorMsg("Mất kết nối mạng. Kết quả của bạn đã được lưu ngoại tuyến và sẽ tự động đồng bộ khi có mạng lại.");
      } else {
        // Có mạng: Submit trực tiếp lên Backend
        const res = await submitPractice(submitPayload, token);
        setScore(res.data.score);
        setCorrectCount(res.data.correctCount);
        setIsCompleted(true);
      }
      localStorage.removeItem("sectional_practice_session");
    } catch (err) {
      console.error(err);
      setErrorMsg("Nộp bài thất bại. Đã có lỗi xảy ra trong quá trình chấm điểm.");
    } finally {
      setSubmitting(false);
    }
  }, [questions, submitting, part, examType, token]);


  // Load danh sách câu hỏi
  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    // 1. Kiểm tra session dở dang trong localStorage
    const saved = localStorage.getItem("sectional_practice_session");
    if (saved) {
      try {
        const parsed: SavedSession = JSON.parse(saved);
        const isMatch =
          parsed.examType === examType &&
          parsed.part === part &&
          parsed.difficulty === difficulty &&
          parsed.limit === limit &&
          parsed.mode === mode;

        // Nếu session khớp cấu hình và chưa quá hạn 15 phút
        if (isMatch && Date.now() - parsed.savedAt < 900000) {
          setQuestions(parsed.questions);
          setAnswers(parsed.answers || {});
          setCurrentIndex(parsed.currentIndex || 0);
          if (mode === "TEST") {
            setTimeLeft(parsed.elapsedSeconds);
          } else {
            setElapsedSeconds(parsed.elapsedSeconds);
          }
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved sectional session", e);
      }
    }

    // 2. Load mới từ API Backend
    try {
      const res = await getPracticeQuestions(examType, part, difficulty, limit, token);
      if (res.data.length === 0) {
        throw new Error("Không tìm thấy câu hỏi phù hợp cho phần này trên Database.");
      }
      setQuestions(res.data);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(limit * 120);
      setElapsedSeconds(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải câu hỏi thất bại.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, [examType, part, difficulty, limit, mode, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);


  // Lưu trạng thái dở dang liên tục vào localStorage (Offline-first safety)
  useEffect(() => {
    if (questions.length > 0 && !isCompleted) {
      const sessionData: SavedSession = {
        examType,
        part,
        difficulty,
        limit,
        mode,
        answers,
        currentIndex,
        elapsedSeconds: mode === "TEST" ? timeLeft : elapsedSeconds,
        questions,
        savedAt: Date.now()
      };
      localStorage.setItem("sectional_practice_session", JSON.stringify(sessionData));
    }
  }, [answers, currentIndex, timeLeft, elapsedSeconds, questions, isCompleted, examType, part, difficulty, limit, mode]);

  // Timer Interval
  useEffect(() => {
    if (loading || isCompleted) return;

    if (mode === "TEST") {
      // Đếm ngược
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit(); // Tự động nộp bài khi hết giờ
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Đếm xuôi
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, isCompleted, mode, handleSubmit]);

  // Chọn đáp án
  const handleSelectOption = (optIdx: number) => {
    if (showExplanation[currentQuestion.id]) return; // Đã chốt câu hỏi ôn luyện thì khóa chọn lại
    
    const newAnswers = { ...answers, [currentQuestion.id]: optIdx };
    setAnswers(newAnswers);

    if (mode === "PRACTICE") {
      // Chế độ ôn luyện: Hiển thị ngay lời giải thích
      setShowExplanation((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  // Chuyển sang câu tiếp theo
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Quay lại câu trước đó (Chỉ cho phép ở chế độ TEST)
  const handlePrev = () => {
    if (mode === "TEST" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Tua nhanh audio helper
  const handleAudioSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
    }
  };

  // Định dạng thời gian
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Đang tải cấu trúc câu hỏi...</p>
      </div>
    );
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-rose-50 dark:bg-red-950/20 border border-rose-200 dark:border-red-900 rounded-3xl p-8 space-y-6 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-lg font-extrabold text-rose-800 dark:text-red-300">Không tìm thấy câu hỏi</h2>
          <p className="text-xs text-rose-650 dark:text-red-400 leading-relaxed">{errorMsg}</p>
        </div>
        <Button onClick={loadData} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 font-bold text-xs cursor-pointer shadow">
          Thử tải lại
        </Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <PracticeResult
        questions={questions}
        answers={answers}
        score={score}
        correctCount={correctCount}
        onRetry={loadData}
        isGuest={!token}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedIndex = answers[currentQuestion.id];
  const isQuestionAnswered = selectedIndex !== undefined;
  const isLastQuestion = currentIndex === questions.length - 1;
  const alphabet = ["A", "B", "C", "D"];

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Alert cảnh báo/lỗi nếu có */}
      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="underline cursor-pointer">Bỏ qua</button>
        </div>
      )}

      {/* Progress Bar & Timer */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-4">
        {/* Progress */}
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Tiến độ luyện tập</span>
            <span>{currentIndex + 1} / {questions.length} câu</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-sky-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3.5 py-2 rounded-xl" data-testid="timer-countdown">
          <Clock className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-350">
            {mode === "TEST" ? formatTime(timeLeft) : formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Câu hỏi {currentIndex + 1} • {part} ({examType})</span>
          </div>

          <h2 className="text-base md:text-lg font-extrabold text-slate-800 dark:text-white leading-relaxed">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* Audio Player dành cho Listening Parts */}
        {currentQuestion.audioUrl ? (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <Volume2 className="w-5 h-5 text-sky-500 shrink-0" />
            <audio
              ref={audioRef}
              src={currentQuestion.audioUrl}
              controls
              controlsList="nodownload"
              className="flex-1 w-full h-8 text-xs bg-transparent outline-none"
            />
            {/* Phím tắt tua nhanh */}
            <div className="flex gap-1">
              <button
                onClick={() => handleAudioSkip(-5)}
                className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-150 transition cursor-pointer text-slate-600 dark:text-slate-400"
                title="Tua lại 5 giây"
              >
                -5s
              </button>
              <button
                onClick={() => handleAudioSkip(5)}
                className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-150 transition cursor-pointer text-slate-600 dark:text-slate-400"
                title="Tua đi 5 giây"
              >
                +5s
              </button>
            </div>
          </div>
        ) : (
          // Worst case handling: Listening nhưng không có audioUrl
          (part.toLowerCase().includes("part1") ||
            part.toLowerCase().includes("part2") ||
            part.toLowerCase().includes("part3") ||
            part.toLowerCase().includes("part4") ||
            part.toLowerCase().includes("section")) && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-2xl flex items-center gap-2.5 text-xs text-amber-850 dark:text-amber-350">
              <span className="text-base shrink-0">⚠️</span>
              <span>Tệp âm thanh đang được bảo trì. Bạn có thể tự chấm đúng hoặc bỏ qua câu này.</span>
            </div>
          )
        )}

        {/* Options Selection */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options
            .map((opt, optIdx) => ({ opt, optIdx }))
            .filter(({ opt }) => opt && opt.trim() !== "")
            .map(({ opt, optIdx }) => {
              const isSelected = selectedIndex === optIdx;
              const isCorrectAnswer = currentQuestion.correctIndex === optIdx;
              const showExpl = showExplanation[currentQuestion.id];

              let optClass = "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-300";

              if (showExpl) {
                if (isCorrectAnswer) {
                  // Đáp án đúng hiển thị màu xanh
                  optClass = "bg-emerald-50/30 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 font-bold pointer-events-none";
                } else if (isSelected) {
                  // Người dùng chọn sai hiển thị màu đỏ
                  optClass = "bg-rose-50/50 border-rose-200 text-rose-850 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400 font-bold pointer-events-none";
                } else {
                  optClass = "border-slate-100 dark:border-slate-900 text-slate-400 dark:text-slate-650 pointer-events-none";
                }
              } else if (isSelected) {
                // Đang chọn trong chế độ test (chưa nộp)
                optClass = "bg-sky-50 border-sky-500 text-sky-955 font-bold";
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full py-4 px-5 rounded-2xl border text-left transition flex items-center gap-3 text-xs md:text-sm cursor-pointer ${optClass}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 dark:bg-slate-850 text-slate-500"
                  }`}>
                    {alphabet[optIdx]}
                  </span>
                  <span className="flex-1">{opt}</span>

                  {showExpl && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {showExpl && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
        </div>


        {/* Lời giải giải thích cho PRACTICE mode */}
        {showExplanation[currentQuestion.id] && (
          <div className="bg-sky-50/20 border border-sky-100/50 p-5 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-[10px] font-bold text-sky-655 dark:text-sky-400 uppercase tracking-widest block">
              Lời giải chi tiết:
            </span>
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
              {currentQuestion.explanation || "Không có giải thích chi tiết cho câu hỏi này."}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <div>
          {mode === "TEST" && (
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="secondary"
              className="rounded-xl font-bold py-3 px-5 text-xs cursor-pointer disabled:opacity-50"
            >
              Quay lại
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {mode === "PRACTICE" && showExplanation[currentQuestion.id] && !isLastQuestion && (
            <Button
              onClick={handleNext}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold py-3 px-6 text-xs cursor-pointer shadow flex items-center gap-1.5"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Button>
          )}

          {mode === "TEST" && !isLastQuestion && (
            <Button
              onClick={handleNext}
              disabled={!isQuestionAnswered}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold py-3 px-6 text-xs cursor-pointer shadow flex items-center gap-1.5 disabled:opacity-55"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Button>
          )}

          {/* Nút nộp bài (TEST mode hiển thị ở câu cuối, PRACTICE mode hiển thị ở câu cuối sau khi đã xem giải thích) */}
          {isLastQuestion && (mode === "TEST" ? isQuestionAnswered : showExplanation[currentQuestion.id]) && (
            <Button
              onClick={() => handleSubmit()}
              disabled={submitting}
              data-testid="btn-submit-quiz"
              className="bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-extrabold py-3.5 px-8 text-xs cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? "Đang chấm điểm..." : "Nộp bài"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
