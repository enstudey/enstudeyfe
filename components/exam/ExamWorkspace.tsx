"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resumeExam, saveExamAnswer, submitExam } from "@/lib/api/exam";
import { ExamQuestion } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Flag, Volume2, ArrowLeft, ArrowRight, Send } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"passage" | "question">("question");
  const [isOffline, setIsOffline] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Bộ đếm thời gian
  const targetEndTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

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

  // Tự động phát khi chuyển câu hỏi & dọn dẹp bộ nhớ ngắt âm thanh khi unmount/đổi câu
  useEffect(() => {
    const currentAudio = audioRef.current;
    if (currentAudio && currentQuestion?.audioUrl) {
      lastAudioTimeRef.current = 0;
      currentAudio.load();
      currentAudio.play().catch((e) => console.log("Audio autoplay check", e));
    }

    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentIndex, currentQuestion?.audioUrl]);

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
    if (submitting || isSubmittingRef.current) return;

    const confirmSubmit = window.confirm("Bạn có chắc chắn muốn nộp bài thi thử? Bạn không thể sửa đáp án sau khi nộp.");
    if (!confirmSubmit) return;

    isSubmittingRef.current = true;
    setSubmitting(true);
    setErrorMsg(null);

    // Xử lý nộp offline khi mất mạng
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
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isTimeUrgent = remainingSeconds <= 300; // < 5 mins

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Đang tải phòng thi giả lập, chờ xíu nhé...</p>
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

  const isReading = currentQuestion?.part?.toLowerCase()?.includes("part 5") ||
    currentQuestion?.part?.toLowerCase()?.includes("part 6") ||
    currentQuestion?.part?.toLowerCase()?.includes("part 7") ||
    currentQuestion?.part?.toLowerCase()?.includes("reading");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] select-none h-screen overflow-hidden">
      {/* Top Fixed Header */}
      <header className="h-16 bg-white border-b border-slate-100 flex justify-between px-6 items-center shrink-0 z-10 select-none">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/exam")}
            className="rounded-xl hover:bg-slate-50 gap-1 font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát</span>
          </Button>
          <span className="h-4 w-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline truncate max-w-[200px]">
            ETS Simulation Desk
          </span>
        </div>

        {/* Sync status */}
        <div className="hidden md:flex items-center gap-2 select-none">
          {saveStatus === "saving" && (
            <span className="text-[10px] text-slate-400 animate-pulse font-medium">
              Đang tự động lưu bài...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Đã lưu bài làm
            </span>
          )}
        </div>

        {/* Timer & Submit CTA */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-0.5 rounded-xl shadow-inner transition-colors duration-300 font-mono ${isTimeUrgent
              ? "bg-rose-50 border border-rose-100 text-rose-600 animate-pulse"
              : "bg-blue-50 border border-blue-100/50 text-blue-700"
            }`}>
            <Clock className="w-5 h-5 shrink-0" />
            <span data-testid="timer-countdown" className="exam-timer font-mono text-3xl md:text-4xl font-extrabold leading-none">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            data-testid="btn-submit-quiz"
            className="rounded-xl font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-sm gap-1.5 px-5 h-9"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài</span>
          </Button>
        </div>
      </header>

      {/* Tab Switcher for Mobile & Tablet context */}
      {isReading && currentQuestion?.passage && (
        <div className="flex border-b border-slate-100 bg-white lg:hidden shrink-0">
          <button
            onClick={() => setActiveTab("passage")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "passage" ? "border-primary text-primary" : "border-transparent text-slate-500"
              }`}
          >
            📖 Đoạn văn đọc hiểu
          </button>
          <button
            onClick={() => setActiveTab("question")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "question" ? "border-primary text-primary" : "border-transparent text-slate-500"
              }`}
          >
            ✏️ Câu hỏi & Đáp án
          </button>
        </div>
      )}

      {/* Main Workspace Body (Split Screen - Tối ưu 2026) */}
      <main className="flex-1 overflow-hidden grid lg:grid-cols-12 w-full max-w-[1600px] mx-auto px-2 md:px-6 py-4 md:py-6 gap-4 md:gap-6">

        {/* Nửa bên Trái: Ngữ cảnh bài thi */}
        <div className={`lg:col-span-7 h-full overflow-y-auto pr-2 space-y-6 ${isReading && currentQuestion?.passage && activeTab !== "passage" ? "hidden lg:block" : "block"
          }`}>
          {/* Passage Section */}
          {isReading && currentQuestion?.passage ? (
            <div className="bg-white border border-border/50 rounded-xl p-6 shadow-sm select-text">
              <span className="inline-flex items-center bg-blue-50 text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider mb-4">
                📖 Đoạn văn đọc hiểu
              </span>
              <div className="exam-passage-container whitespace-pre-wrap select-text">
                {currentQuestion.passage}
              </div>
            </div>
          ) : (
            /* Playlist Audio block for Listening (Audio Guard) */
            !isReading && currentQuestion?.audioUrl && (
              <div className="bg-white border border-border/50 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6 select-none min-h-[300px]">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-300 relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                    <Volume2 className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-800">Trình phát Audio Listening Guard</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tự động phát • Không được tua / tạm dừng</p>
                </div>
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
            )
          )}
        </div>

        {/* Nửa bên Phải: Answer options & Navigation Grid */}
        <div className={`lg:col-span-5 h-full overflow-y-auto pl-2 flex flex-col gap-6 ${isReading && currentQuestion?.passage && activeTab !== "question" ? "hidden lg:flex" : "flex"
          }`}>
          {/* Answer Panel Card */}
          <div className="bg-white border border-border/50 rounded-xl p-6 shadow-sm flex flex-col justify-between gap-6 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
                <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  {currentQuestion?.part || "TEST"} - Câu {currentQuestion?.order || currentIndex + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFlag(currentIndex)}
                  className={`rounded-xl gap-1 text-xs font-bold ${flags[currentIndex] ? "bg-amber-50 text-amber-600 border border-amber-100" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <Flag className={`w-4 h-4 ${flags[currentIndex] ? "fill-current text-amber-500" : ""}`} />
                  <span>Cứu xét</span>
                </Button>
              </div>

              {/* Question Image if any */}
              {currentQuestion?.imageUrl && (
                <div className="w-full flex justify-center py-2 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQuestion.imageUrl}
                    alt={`Minh họa câu hỏi ${currentQuestion.order}`}
                    className="max-h-[180px] object-contain rounded-xl border border-slate-100"
                  />
                </div>
              )}

              {/* Question Text */}
              <p className="text-[17px] md:text-[18px] font-bold leading-relaxed text-slate-800 select-text">
                {currentQuestion?.questionText}
              </p>

              {/* Answer options A-B-C-D grid (Tối ưu Touch Targets >= 48px cho Tablet/Mobile) */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion?.options?.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id.toString()] === idx;
                  const letter = ["A", "B", "C", "D"][idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                      className={`flex items-center text-left gap-4 p-4 md:p-5 rounded-xl border text-[16px] md:text-[18px] font-medium min-h-[48px] transition-all duration-150 cursor-pointer ${isSelected
                          ? "bg-primary text-white border-primary shadow-md shadow-blue-100"
                          : "bg-white text-slate-800 border-slate-100 hover:bg-slate-50 hover:border-primary/20"
                        }`}
                    >
                      <span className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-[15px] md:text-base font-black shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                        {letter}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prev/Next buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 select-none">
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

          {/* Navigation Grid Board (Tối ưu hóa lưới câu hỏi đáp án nhanh) */}
          <div className="bg-white border border-border/50 rounded-xl p-5 shadow-sm select-none flex-1 overflow-y-auto">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-4">
              Bảng đáp án nhanh
            </h3>

            <div className="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-10 md:grid-cols-8 lg:grid-cols-7 gap-2">
              {questions.map((q, idx) => {
                const questionIdStr = q.id.toString();
                const isAnswered = answers[questionIdStr] !== undefined;
                const isCurrent = currentIndex === idx;
                const isFlagged = flags[idx];

                let gridBtnClass = "relative w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl border transition-all duration-150 cursor-pointer ";

                if (isCurrent) {
                  gridBtnClass += "bg-primary text-white border-primary shadow-md";
                } else if (isFlagged) {
                  gridBtnClass += "bg-amber-50 text-amber-800 border-amber-400";
                } else if (isAnswered) {
                  gridBtnClass += "bg-blue-50 text-primary border-blue-100";
                } else {
                  gridBtnClass += "bg-white text-slate-400 border-slate-100 hover:bg-slate-50";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setActiveTab("question");
                    }}
                    className={gridBtnClass}
                  >
                    <span className="font-mono">{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
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
