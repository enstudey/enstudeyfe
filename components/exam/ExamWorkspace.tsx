"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resumeExam, saveExamAnswer, submitExam } from "@/lib/api/exam";
import { ExamQuestion } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Flag, WifiOff, Volume2, ArrowLeft, ArrowRight, Send } from "lucide-react";

interface ExamWorkspaceProps {
  sessionId: string;
  token?: string;
}

export default function ExamWorkspace({ sessionId, token }: ExamWorkspaceProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(7200);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [isOffline, setIsOffline] = useState(typeof window !== "undefined" ? !navigator.onLine : false);

  // Bộ đếm thời gian
  const targetEndTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Phục vụ chặn tua âm thanh
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioTimeRef = useRef<number>(0);

  // Caching states to prevent unnecessary useEffect dependencies recreating
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const durationSecondsRef = useRef(durationSeconds);
  useEffect(() => {
    durationSecondsRef.current = durationSeconds;
  }, [durationSeconds]);

  // Các hàm điều khiển đếm ngược (phải khai báo trước useEffect gọi chúng)
  const stopCountdown = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      await submitExam(sessionId, token);
      router.push(`/exams/result/${sessionId}`);
    } catch (e) {
      console.error("Failed to auto submit on timeout", e);
      localStorage.setItem(`pending_submit_${sessionId}`, JSON.stringify({ sessionId, answers: answersRef.current }));
      router.push(`/exams`);
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
        router.push(`/exams/result/${sessionId}`);
      } catch (e) {
        console.error("Failed to sync pending submission", e);
      } finally {
        setSubmitting(false);
      }
    }
  }, [sessionId, token, router]);

  // Khôi phục phiên thi
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

          // Tính mốc thời gian kết thúc cố định dựa trên thời điểm hiện tại và thời gian còn lại
          const remainingSeconds = data.durationSeconds - data.elapsedSeconds;
          targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;

          // Khởi động đếm ngược
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

  // Lắng nghe sự kiện Online/Offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Tự động đồng bộ nếu có gói tin nộp bài đang chờ
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

  // Chặn tua và tạm dừng Audio Listening
  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    // Nếu tua nhanh quá 1.5s hoặc tua ngược quá 0.5s, kéo về mốc cũ
    if (audio.currentTime > lastAudioTimeRef.current + 1.5 || audio.currentTime < lastAudioTimeRef.current - 0.5) {
      audio.currentTime = lastAudioTimeRef.current;
    } else {
      lastAudioTimeRef.current = audio.currentTime;
    }
  };

  const handleAudioPause = () => {
    if (!audioRef.current) return;
    // Chế độ thi nghiêm ngặt: Tự động chạy lại nếu bị tìm cách tạm dừng
    audioRef.current.play().catch((e) => console.log("Audio play interrupted", e));
  };

  // Tự động phát khi chuyển câu hỏi
  useEffect(() => {
    if (audioRef.current) {
      lastAudioTimeRef.current = 0;
      audioRef.current.load();
      audioRef.current.play().catch((e) => console.log("Audio autoplay check", e));
    }
  }, [currentIndex]);

  // Auto-save đáp án
  const handleSelectAnswer = async (questionId: number, optionIndex: number) => {
    // Lưu tạm cục bộ
    const questionIdStr = questionId.toString();
    setAnswers((prev) => ({
      ...prev,
      [questionIdStr]: optionIndex
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

  // Toggle Flag câu hỏi cần xem lại
  const handleToggleFlag = (index: number) => {
    setFlags((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Nộp bài thi
  const handleSubmit = async () => {
    if (submitting) return;
    
    const confirmSubmit = window.confirm("Bạn có chắc chắn muốn nộp bài thi thử? Bạn không thể sửa đáp án sau khi nộp.");
    if (!confirmSubmit) return;

    setSubmitting(true);
    setErrorMsg(null);

    // Xử lý nộp offline khi mất mạng
    if (isOffline) {
      localStorage.setItem(`pending_submit_${sessionId}`, JSON.stringify({ sessionId, answers }));
      alert("Đã lưu bài làm tạm thời do sự cố mất mạng. Hệ thống sẽ tự động nộp bài khi có kết nối mạng trở lại.");
      setSubmitting(false);
      return;
    }

    try {
      stopCountdown();
      await submitExam(sessionId, token);
      router.push(`/exams/result/${sessionId}`);
    } catch (err) {
      console.error("Failed to submit exam", err);
      setErrorMsg("Nộp bài thi thất bại. Vui lòng kiểm tra lại kết nối mạng.");
      setSubmitting(false);
      startCountdown();
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-muted-foreground font-medium">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Không thể tiếp tục thi</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{errorMsg}</p>
          <Button onClick={() => router.push("/exams")} className="w-full rounded-2xl py-5 font-bold">
            Quay lại danh sách đề
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const isReading = currentQuestion?.part?.toLowerCase()?.includes("part 5") ||
                    currentQuestion?.part?.toLowerCase()?.includes("part 6") ||
                    currentQuestion?.part?.toLowerCase()?.includes("part 7");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAFAFA] text-foreground">
      {/* Top Banner Control Panel */}
      <header className="sticky top-0 bg-white border-b border-border shadow-sm px-6 py-4 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-4">
          <h1 className="text-sm md:text-base font-extrabold text-foreground hidden sm:block">
            Luyện thi thử trọn vẹn
          </h1>
          {isOffline && (
            <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5" />
              Mất mạng
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="text-[10px] text-muted-foreground animate-pulse font-medium">
              Đang tự động lưu...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[10px] text-emerald-600 font-medium">
              Đã lưu bài làm
            </span>
          )}
        </div>

        {/* Timer Countdown Panel */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100/50 px-4 py-2 rounded-2xl text-violet-700 font-bold text-sm shadow-inner">
            <Clock className="w-4 h-4 text-violet-600 shrink-0" />
            <span data-testid="timer-countdown">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            data-testid="btn-submit-quiz"
            className="rounded-2xl font-bold bg-violet-600 hover:bg-violet-700 shadow-sm gap-1.5 px-5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-[1400px] mx-auto px-4 py-6 gap-6">
        
        {/* Left Column: Passage Section (for Reading) */}
        {isReading && currentQuestion?.passage ? (
          <div className="flex-1 bg-white border border-border rounded-3xl p-6 shadow-sm overflow-y-auto md:max-h-[75vh] select-text">
            <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-4">
              <span>Đoạn văn đọc hiểu</span>
            </div>
            <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {currentQuestion.passage}
            </div>
          </div>
        ) : null}

        {/* Middle Column: Current Question Content */}
        <div className="flex-[1.5] flex flex-col bg-white border border-border rounded-3xl p-6 shadow-sm justify-between gap-6 overflow-y-auto md:max-h-[75vh]">
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-border pb-4 select-none">
              <span className="bg-violet-50 text-violet-600 border border-violet-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                {currentQuestion.part} - Câu {currentQuestion.order}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFlag(currentIndex)}
                className={`rounded-xl gap-1 text-xs font-bold ${
                  flags[currentIndex] ? "bg-amber-50 text-amber-600 border border-amber-100" : "text-muted-foreground"
                }`}
              >
                <Flag className={`w-4 h-4 ${flags[currentIndex] ? "fill-current text-amber-500" : ""}`} />
                <span>Xem lại</span>
              </Button>
            </div>

            {/* Audio Panel for Listening */}
            {!isReading && currentQuestion?.audioUrl && (
              <div className="bg-violet-50 border border-violet-100/50 rounded-2xl p-4 flex items-center gap-4 select-none">
                <div className="p-2.5 bg-violet-600 rounded-xl text-white">
                  <Volume2 className="w-5 h-5 shrink-0" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-violet-800">Trình phát Audio Listening</p>
                  <p className="text-[10px] text-violet-600 font-medium">Tự động phát, không cho phép tua hoặc tạm dừng</p>
                  <audio
                    ref={audioRef}
                    src={currentQuestion.audioUrl}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onPause={handleAudioPause}
                    autoPlay
                    controls={false}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Question Image */}
            {currentQuestion?.imageUrl && (
              <div className="w-full flex justify-center py-2 select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Minh họa câu hỏi ${currentQuestion.order}`}
                  className="max-h-[220px] object-contain rounded-2xl border border-border shadow-sm"
                />
              </div>
            )}

            {/* Question Text */}
            <p className="text-base font-extrabold leading-relaxed text-foreground select-text">
              {currentQuestion.questionText}
            </p>

            {/* Answer Options list */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id.toString()] === idx;
                const letter = ["A", "B", "C", "D"][idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                    className={`flex items-center text-left gap-4 p-4 rounded-2xl border text-sm font-bold transition duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100"
                        : "bg-white text-foreground border-border hover:bg-slate-50 hover:border-violet-500/20"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-xl text-xs font-black shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-border pt-4 select-none">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="rounded-xl font-bold gap-1 text-xs px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </Button>
            <Button
              variant="outline"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="rounded-xl font-bold gap-1 text-xs px-4"
            >
              <span>Câu tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Column: Fast Navigation Grid Board */}
        <div className="flex-1 bg-white border border-border rounded-3xl p-5 shadow-sm overflow-y-auto md:max-h-[75vh] select-none flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Bảng đáp án nhanh
            </h3>
            
            <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {questions.map((q, idx) => {
                const questionIdStr = q.id.toString();
                const isAnswered = answers[questionIdStr] !== undefined;
                const isCurrent = currentIndex === idx;
                const isFlagged = flags[idx];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-10 h-10 flex items-center justify-center text-xs font-bold rounded-xl border transition duration-200 cursor-pointer ${
                      isCurrent
                        ? "bg-violet-600 text-white border-violet-600 shadow-md"
                        : isAnswered
                        ? "bg-violet-50 text-violet-700 border-violet-200"
                        : "bg-white text-muted-foreground border-border hover:bg-slate-50"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-bl-md border-t border-r border-white flex items-center justify-center">
                        <Flag className="w-1.5 h-1.5 text-white fill-current" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
