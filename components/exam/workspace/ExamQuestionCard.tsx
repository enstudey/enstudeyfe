"use client";

import React from "react";
import { ExamQuestion } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Flag, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

interface ExamQuestionCardProps {
  question: ExamQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionIndex?: number;
  isFlagged: boolean;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onToggleFlag: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ExamQuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionIndex,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrev,
  onNext,
}: ExamQuestionCardProps) {
  if (!question) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between gap-3.5 h-full overflow-y-auto">
      <div className="space-y-3">
        {/* Header câu hỏi + Nút Flag Cứu xét */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
            {question.part || "TEST"} • Câu {question.order || currentIndex + 1}/{totalQuestions}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFlag(currentIndex)}
            data-testid="btn-flag-question"
            className={`rounded-xl gap-1 text-[11px] font-bold h-7 px-2.5 ${
              isFlagged
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Flag className={`w-3 h-3 ${isFlagged ? "fill-current text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã đánh dấu" : "Cứu xét"}</span>
          </Button>
        </div>

        {/* Đồ họa minh họa nếu có */}
        {question.imageUrl && (
          <div className="w-full flex justify-center py-1 select-none relative max-h-[140px] sm:max-h-[150px]">
            <Image
              src={question.imageUrl}
              alt={`Minh họa câu hỏi ${question.order}`}
              width={360}
              height={150}
              className="max-h-[140px] sm:max-h-[150px] w-auto object-contain rounded-lg border border-slate-100"
            />
          </div>
        )}

        {/* Nội dung câu hỏi */}
        <p className="text-sm sm:text-base font-bold leading-snug text-slate-900 select-text">
          {question.questionText}
        </p>

        {/* Các phương án A, B, C, D - Compact Touch Target min-h-[42px] */}
        <div className="grid grid-cols-1 gap-2 pt-0.5">
          {question.options?.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const letter = ["A", "B", "C", "D"][idx];

            return (
              <button
                key={idx}
                onClick={() => onSelectOption(question.id, idx)}
                data-testid={`option-card-${idx}`}
                className={`flex items-center text-left gap-3 py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium min-h-[42px] transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-indigo-300"
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black shrink-0 ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 leading-tight">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Điều hướng Câu trước / Câu tiếp theo - Chuẩn h-9 px-4 */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 select-none">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={onPrev}
          data-testid="btn-prev-question"
          className="rounded-xl font-bold gap-1 text-xs px-4 h-9 border-slate-200 text-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Câu trước</span>
        </Button>

        <Button
          variant="default"
          disabled={currentIndex === totalQuestions - 1}
          onClick={onNext}
          data-testid="btn-next-question"
          className="rounded-xl font-bold gap-1 text-xs px-4 h-9 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <span>Câu tiếp theo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
