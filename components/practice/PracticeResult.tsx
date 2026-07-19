"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Sparkles, RefreshCw, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PracticeQuestion } from "@/lib/api/practice";

interface PracticeResultProps {
  questions: PracticeQuestion[];
  answers: Record<number, number>;
  score: number;
  correctCount: number;
  onRetry: () => void;
  isGuest: boolean;
}

export default function PracticeResult({
  questions,
  answers,
  score,
  correctCount,
  onRetry,
  isGuest
}: PracticeResultProps) {
  const total = questions.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 1. Điểm số tổng quan */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-extrabold text-2xl shadow-inner animate-bounce">
          {score}%
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Hoàn thành phiên luyện tập!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bạn đã trả lời đúng <strong>{correctCount}</strong> trên tổng số <strong>{total}</strong> câu hỏi.
          </p>
        </div>

        {/* Thông báo Mistake Bank */}
        {!isGuest ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex items-start gap-2.5 text-left text-xs text-emerald-800 dark:text-emerald-350">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span>Các câu hỏi làm sai đã được đồng bộ tự động vào <strong>Mistake Bank</strong> để ôn tập trong tương lai.</span>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex items-start gap-2.5 text-left text-xs text-amber-800 dark:text-amber-400">
            <span className="text-sm leading-none shrink-0 mt-0.5">⚠️</span>
            <span>Chế độ Khách: Kết quả làm bài không được lưu. Hãy đăng nhập để đồng bộ câu sai sang Mistake Bank.</span>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onRetry}
            variant="outline"
            className="rounded-xl text-xs font-bold py-2.5 px-4 cursor-pointer flex items-center gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            Luyện tập lại
          </Button>
          <Button
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold py-2.5 px-4 cursor-pointer shadow flex items-center gap-1.5"
          >
            <Link href="/dashboard">
              <Home className="w-3.5 h-3.5 shrink-0" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Placeholder quảng cáo chống Layout Shift (CLS = 0) */}
      <div 
        className="w-full max-w-2xl mx-auto bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold tracking-wider min-h-[250px]"
        data-testid="ad-container-result"
      >
        QUẢNG CÁO ĐƯỢC TÀI TRỢ
      </div>

      {/* 2. Chi tiết kết quả làm bài */}
      <div className="space-y-6 max-w-2xl mx-auto text-left">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight px-1">
          Xem lại chi tiết bài làm
        </h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userIndex = answers[q.id];
            const isCorrect = userIndex === q.correctIndex;
            const alphabet = ["A", "B", "C", "D"];

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-4"
              >
                {/* Câu hỏi */}
                <div className="flex items-start gap-3">
                  <span className="font-extrabold text-xs text-slate-400 mt-0.5">
                    Câu {idx + 1}:
                  </span>
                  <div className="flex-1 space-y-3">
                    <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {q.questionText}
                    </p>
                    
                    {/* Trình phát âm thanh nếu có */}
                    {q.audioUrl && (
                      <div className="pt-1">
                        <audio 
                          src={q.audioUrl} 
                          controls 
                          controlsList="nodownload" 
                          className="w-full max-w-md h-8 text-xs bg-slate-50 dark:bg-slate-900 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </div>

                {/* Các lựa chọn đáp án */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                  {q.options
                    .map((opt, optIdx) => ({ opt, optIdx }))
                    .filter(({ opt }) => opt && opt.trim() !== "")
                    .map(({ opt, optIdx }) => {
                      const isUserSelected = userIndex === optIdx;
                      const isRightOption = q.correctIndex === optIdx;

                      let buttonClass = "bg-transparent border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350";
                      if (isRightOption) {
                        buttonClass = "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 font-bold";
                      } else if (isUserSelected) {
                        buttonClass = "bg-rose-50 border-rose-400 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400 font-bold";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`py-2 px-3 border rounded-xl text-xs flex items-center gap-2 ${buttonClass}`}
                        >
                          <span className="font-bold opacity-60">{alphabet[optIdx]}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                </div>


                {/* Lời giải giải thích */}
                <div className="pl-7 pt-3 border-t border-slate-100 dark:border-slate-900 space-y-1.5">
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest block">
                    Lời giải chi tiết:
                  </span>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                    {q.explanation || "Không có giải thích cho câu hỏi này."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
