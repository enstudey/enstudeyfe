"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Send, Maximize2, Minimize2 } from "lucide-react";

interface ExamTopBarProps {
  examTitle?: string;
  examType?: "TOEIC" | "IELTS" | string;
  remainingSeconds: number;
  saveStatus: "saved" | "saving" | "error";
  submitting: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExit: () => void;
  onSubmit: () => void;
}

export default function ExamTopBar({
  examTitle = "ETS Simulation Desk",
  examType = "TOEIC",
  remainingSeconds,
  saveStatus,
  submitting,
  isFullscreen,
  onToggleFullscreen,
  onExit,
  onSubmit,
}: ExamTopBarProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isTimeUrgent = remainingSeconds <= 300; // < 5 phút

  return (
    <header className="h-12 sm:h-14 bg-white border-b border-slate-200 flex justify-between px-3 sm:px-6 items-center shrink-0 z-20 select-none shadow-xs sticky top-0">
      {/* Bên trái: Nút thoát & Tiêu đề bài thi */}
      <div className="flex items-center gap-2 sm:gap-4 truncate">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="rounded-xl hover:bg-slate-100 gap-1 font-bold text-xs h-8 px-2 sm:px-3 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Thoát</span>
        </Button>
        <span className="h-4 w-px bg-slate-200 shrink-0" />
        
        <div className="flex items-center gap-2 truncate">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0">
            {examType}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[140px] sm:max-w-[240px] md:max-w-[320px]">
            {examTitle}
          </span>
        </div>
      </div>

      {/* Ở giữa: Save Status (Desktop) & Live Countdown Timer */}
      <div className="flex items-center gap-3">
        {/* Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium select-none">
          {saveStatus === "saving" && (
            <span className="text-slate-400 animate-pulse flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Đang tự động lưu...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Đã lưu bài làm
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-rose-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Lỗi kết nối
            </span>
          )}
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-xl shadow-xs border transition-colors duration-300 font-mono ${
            isTimeUrgent
              ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
              : "bg-indigo-50/80 border-indigo-100 text-indigo-700"
          }`}
        >
          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
          <span
            data-testid="timer-countdown"
            className="font-mono text-base sm:text-xl font-extrabold tracking-tight leading-none"
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Bên phải: Fullscreen mode toggle & CTA Nộp bài */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Mở toàn màn hình thi thử"}
          className="rounded-xl h-8 sm:h-9 px-2 sm:px-3 text-slate-600 border-slate-200 hover:bg-slate-100 hidden sm:flex items-center gap-1 text-xs font-semibold"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cửa sổ</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Toàn màn hình</span>
            </>
          )}
        </Button>

        <Button
          onClick={onSubmit}
          disabled={submitting}
          data-testid="btn-submit-quiz"
          className="rounded-xl font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-xs gap-1.5 px-3 sm:px-5 h-8 sm:h-9 text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Nộp bài</span>
        </Button>
      </div>
    </header>
  );
}
