"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resumeExam, saveExamAnswer, submitExam } from "@/lib/api/exam";
import { ExamQuestion, TextHighlight } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { AlertCircle, Grid } from "lucide-react";

import ExamTopBar from "./workspace/ExamTopBar";
import ExamReadingPassage from "./workspace/ExamReadingPassage";
import ExamAudioPlayer from "./workspace/ExamAudioPlayer";
import ExamQuestionCard from "./workspace/ExamQuestionCard";
import ExamQuestionPalette from "./workspace/ExamQuestionPalette";

interface ExamWorkspaceProps {
  sessionId: string;
  token?: string;
}

export default function ExamWorkspace({ sessionId, token }: ExamWorkspaceProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(7200);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [activeTab, setActiveTab] = useState<"passage" | "question">("question");
  const [isOffline, setIsOffline] = useState(false);
  const [isBottomPaletteOpen, setIsBottomPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Bộ đếm thời gian
  const targetEndTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  // References cho dependencies
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const durationSecondsRef = useRef(durationSeconds);
  useEffect(() => {
    durationSecondsRef.current = durationSeconds;
  }, [durationSeconds]);

  // Điều khiển đếm ngược
  const stopCountdown = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      await submitExam(sessionId, token);
      router.push(`/exam/result/${sessionId}`);
    } catch (e) {
      console.error("Failed to auto submit on timeout", e);
      localStorage.setItem(`pending_submit_${sessionId}`, JSON.stringify({ sessionId, answers: answersRef.current }));
      router.push(`/exam`);
    }
  }, [sessionId, token, router]);

  const startCountdown = useCallback(() => {
    stopCountdown();
    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((targetEndTimeRef.current - Date.now()) / 1000));
      setElapsedSeconds(durationSecondsRef.current - remaining);

      if (remaining <= 0) {
        stopCountdown();
        handleAutoSubmit();
      }
    }, 1000);
  }, [stopCountdown, handleAutoSubmit]);

  const syncPendingSubmission = useCallback(async () => {
    const pending = localStorage.getItem(`pending_submit_${sessionId}`);
    if (pending) {
      try {
        setSubmitting(true);
        await submitExam(sessionId, token);
        localStorage.removeItem(`pending_submit_${sessionId}`);
        router.push(`/exam/result/${sessionId}`);
      } catch (e) {
        console.error("Failed to sync pending submission", e);
      } finally {
        setSubmitting(false);
      }
    }
  }, [sessionId, token, router]);

  const handleExit = () => {
    const confirmExit = window.confirm(
      "Bạn có chắc chắn muốn thoát khỏi phòng thi? Tiến độ làm bài của bạn sẽ được lưu, nhưng thời gian thi vẫn sẽ tiếp tục trôi qua."
    );
    if (confirmExit) {
      router.push("/exam");
    }
  };

  // Fullscreen Mode Toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Khôi phục phiên thi & Offline sync
  useEffect(() => {
    async function initSession() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await resumeExam(sessionId, token);
        if (res && res.data) {
          const data = res.data;
          setQuestions(data.questions || []);
          setAnswers(data.answers || {});
          setDurationSeconds(data.durationSeconds);
          setElapsedSeconds(data.elapsedSeconds);

          const savedHl = localStorage.getItem(`highlights_${sessionId}`);
          if (savedHl) {
            try {
              setHighlights(JSON.parse(savedHl));
            } catch (e) {
              console.error("Failed to parse saved highlights", e);
            }
          }

          const remainingSeconds = data.durationSeconds - data.elapsedSeconds;
          targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
          startCountdown();
        } else {
          throw new Error("Không thể khôi phục phiên thi thử.");
        }
      } catch (err) {
        console.error("Failed to resume exam session", err);
        setErrorMsg("Mã phiên thi không hợp lệ, đã hết hạn hoặc đã được nộp.");
      } finally {
        setLoading(false);
      }
    }

    initSession();

    return () => {
      stopCountdown();
    };
  }, [sessionId, token, startCountdown, stopCountdown]);

  // Auto-save local storage every 5 seconds
  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => {
      localStorage.setItem(`answers_${sessionId}`, JSON.stringify(answers));
      localStorage.setItem(`highlights_${sessionId}`, JSON.stringify(highlights));
    }, 5000);

    return () => clearInterval(interval);
  }, [answers, highlights, sessionId, loading, questions.length]);

  // Online / Offline handlers
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncPendingSubmission();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncPendingSubmission]);

  // Auto-save đáp án khi chọn
  const handleSelectAnswer = async (questionId: number, optionIndex: number) => {
    const questionIdStr = questionId.toString();
    setAnswers((prev) => ({
      ...prev,
      [questionIdStr]: optionIndex,
    }));

    setSaveStatus("saving");

    try {
      await saveExamAnswer(sessionId, questionId, optionIndex, token);
      setSaveStatus("saved");
    } catch (e) {
      console.error("Failed to auto-save answer", e);
      setSaveStatus("error");
    }
  };

  // Flag toggle
  const handleToggleFlag = (index: number) => {
    setFlags((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Highlights handlers
  const handleAddHighlight = (hl: TextHighlight) => {
    setHighlights((prev) => [...prev, hl]);
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((item) => item.id !== id));
  };

  // Nộp bài thi
  const handleSubmit = async () => {
    if (submitting || isSubmittingRef.current) return;

    const confirmSubmit = window.confirm(
      "Bạn có chắc chắn muốn nộp bài thi thử? Bạn không thể sửa đáp án sau khi nộp."
    );
    if (!confirmSubmit) return;

    isSubmittingRef.current = true;
    setSubmitting(true);
    setErrorMsg(null);

    if (isOffline) {
      localStorage.setItem(`pending_submit_${sessionId}`, JSON.stringify({ sessionId, answers }));
      alert("Đã lưu bài làm tạm thời do sự cố mất mạng. Hệ thống sẽ tự động nộp bài khi có kết nối mạng trở lại.");
      setSubmitting(false);
      isSubmittingRef.current = false;
      return;
    }

    try {
      stopCountdown();
      await submitExam(sessionId, token);
      router.push(`/exam/result/${sessionId}`);
    } catch (err) {
      console.error("Failed to submit exam", err);
      setErrorMsg("Nộp bài thi thất bại. Vui lòng kiểm tra lại kết nối mạng.");
      setSubmitting(false);
      isSubmittingRef.current = false;
      startCountdown();
    }
  };

  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 text-sm font-bold">Đang nạp phòng thi ảo áp lực thật...</p>
      </div>
    );
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center gap-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-800">Không thể tiếp tục thi thử</h2>
        <p className="text-slate-500 text-sm max-w-md leading-relaxed">{errorMsg}</p>
        <Button onClick={() => router.push("/exam")} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
          Quay lại kho đề
        </Button>
      </div>
    );
  }

  const isReading =
    currentQuestion?.part?.toLowerCase()?.includes("part 5") ||
    currentQuestion?.part?.toLowerCase()?.includes("part 6") ||
    currentQuestion?.part?.toLowerCase()?.includes("part 7") ||
    currentQuestion?.part?.toLowerCase()?.includes("reading");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 select-none h-screen overflow-hidden">
      {/* 1. Top Control Bar (Sticky h-14 / h-12) */}
      <ExamTopBar
        examTitle="ETS Simulation Desk"
        examType="TOEIC"
        remainingSeconds={remainingSeconds}
        saveStatus={saveStatus}
        submitting={submitting}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onExit={handleExit}
        onSubmit={handleSubmit}
      />

      {/* 2. Segmented Context Switcher Bar cho Mobile (< lg) */}
      {isReading && currentQuestion?.passage && (
        <div className="flex border-b border-slate-200 bg-white lg:hidden shrink-0">
          <button
            onClick={() => setActiveTab("passage")}
            className={`flex-1 py-2 text-xs font-extrabold border-b-2 transition-colors ${
              activeTab === "passage"
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            📖 Đọc bài văn
          </button>
          <button
            onClick={() => setActiveTab("question")}
            className={`flex-1 py-2 text-xs font-extrabold border-b-2 transition-colors ${
              activeTab === "question"
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            ✍️ Câu hỏi & Đáp án
          </button>
        </div>
      )}

      {/* 3. Main Split-Screen Workspace (Fit Viewport) */}
      <main className="flex-1 overflow-hidden grid lg:grid-cols-12 w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-5 py-2 sm:py-3 gap-3 md:gap-4">
        {/* Vùng Trái: Reading Passage / Listening Audio Player */}
        <div
          className={`lg:col-span-6 xl:col-span-7 h-full overflow-hidden ${
            isReading && currentQuestion?.passage && activeTab !== "passage" ? "hidden lg:block" : "block"
          }`}
        >
          {isReading && currentQuestion?.passage ? (
            <ExamReadingPassage
              passageText={currentQuestion.passage}
              highlights={highlights}
              onAddHighlight={handleAddHighlight}
              onRemoveHighlight={handleRemoveHighlight}
            />
          ) : (
            currentQuestion?.audioUrl && (
              <ExamAudioPlayer
                audioUrl={currentQuestion.audioUrl}
                partTitle={currentQuestion.part || "Listening Test"}
              />
            )
          )}
        </div>

        {/* Vùng Phải: Question Card Workspace */}
        <div
          className={`lg:col-span-6 xl:col-span-5 h-full overflow-hidden ${
            isReading && currentQuestion?.passage && activeTab !== "question" ? "hidden lg:block" : "block"
          }`}
        >
          <ExamQuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOptionIndex={answers[currentQuestion?.id?.toString()]}
            isFlagged={!!flags[currentIndex]}
            onSelectOption={handleSelectAnswer}
            onToggleFlag={handleToggleFlag}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          />
        </div>
      </main>

      {/* 4. Bottom Palette Action Bar (Desktop Horizontal Bar & Mobile BottomSheet) */}
      <ExamQuestionPalette
        questions={questions}
        answers={answers}
        flags={flags}
        currentIndex={currentIndex}
        isOpenMobile={isBottomPaletteOpen}
        onSelectQuestion={(idx) => {
          setCurrentIndex(idx);
          setActiveTab("question");
        }}
        onCloseMobile={() => setIsBottomPaletteOpen(false)}
      />

      {/* Mobile Fixed Bottom Action Bar cho Quick Jump Palette (< lg) */}
      <div className="lg:hidden bg-white border-t border-slate-200 h-12 px-3 flex items-center justify-between shrink-0 z-20 shadow-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsBottomPaletteOpen(true)}
          data-testid="btn-toggle-palette"
          className="rounded-xl gap-1.5 font-bold text-xs text-slate-700 border-slate-200 h-8"
        >
          <Grid className="w-3.5 h-3.5 text-indigo-600" />
          <span>Bảng câu hỏi ({currentIndex + 1}/{questions.length})</span>
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="rounded-xl text-xs font-bold px-2.5 h-8"
          >
            Câu trước
          </Button>
          <Button
            size="sm"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="rounded-xl text-xs font-bold px-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Câu tiếp
          </Button>
        </div>
      </div>
    </div>
  );
}
