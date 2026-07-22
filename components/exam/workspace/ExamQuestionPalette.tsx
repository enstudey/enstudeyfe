"use client";

import React from "react";
import { ExamQuestion } from "@/types/exam";
import { X, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamQuestionPaletteProps {
  questions: ExamQuestion[];
  answers: Record<string, number>;
  flags: Record<string, boolean>;
  currentIndex: number;
  isOpenMobile: boolean;
  onSelectQuestion: (index: number) => void;
  onCloseMobile: () => void;
}

export default function ExamQuestionPalette({
  questions,
  answers,
  flags,
  currentIndex,
  isOpenMobile,
  onSelectQuestion,
  onCloseMobile,
}: ExamQuestionPaletteProps) {
  const renderQuestionGrid = () => (
    <div className="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-10 gap-1.5 max-h-[300px] overflow-y-auto p-1">
      {questions.map((q, idx) => {
        const questionIdStr = q.id.toString();
        const isAnswered = answers[questionIdStr] !== undefined;
        const isCurrent = currentIndex === idx;
        const isFlagged = flags[idx];

        let btnClass =
          "relative w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-all duration-150 cursor-pointer ";

        if (isCurrent) {
          btnClass += "bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200";
        } else if (isFlagged) {
          btnClass += "bg-amber-50 text-amber-800 border-amber-400 font-extrabold";
        } else if (isAnswered) {
          btnClass += "bg-indigo-50 text-indigo-700 border-indigo-200";
        } else {
          btnClass += "bg-white text-slate-500 border-slate-200 hover:bg-slate-50";
        }

        return (
          <button
            key={q.id || idx}
            onClick={() => {
              onSelectQuestion(idx);
              onCloseMobile();
            }}
            className={btnClass}
          >
            <span className="font-mono">{idx + 1}</span>
            {isFlagged && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Compact Horizontal Bottom Bar for Desktop */}
      <div className="hidden lg:flex items-center gap-3 bg-white border-t border-slate-200 px-4 py-1.5 h-11 shrink-0 z-10 shadow-xs select-none">
        <div className="flex items-center gap-1.5 shrink-0 border-r border-slate-200 pr-3">
          <Grid className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-extrabold text-slate-700">
            Bảng câu hỏi ({questions.length})
          </span>
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center gap-2.5 text-[10px] font-medium text-slate-500 shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-white border border-slate-200" /> Chưa làm
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-50 border border-indigo-200 text-indigo-700" /> Đã làm
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-50 border border-amber-400 text-amber-800" /> Cứu xét
          </span>
        </div>

        {/* Quick Horizontal Scroll Items */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-thin flex-1">
          {questions.map((q, idx) => {
            const questionIdStr = q.id.toString();
            const isAnswered = answers[questionIdStr] !== undefined;
            const isCurrent = currentIndex === idx;
            const isFlagged = flags[idx];

            let badgeClass =
              "relative w-6 h-6 flex items-center justify-center text-[10px] font-mono font-bold rounded-md border transition-all cursor-pointer shrink-0 ";

            if (isCurrent) {
              badgeClass += "bg-indigo-600 text-white border-indigo-600 shadow-xs";
            } else if (isFlagged) {
              badgeClass += "bg-amber-50 text-amber-800 border-amber-400";
            } else if (isAnswered) {
              badgeClass += "bg-indigo-50 text-indigo-700 border-indigo-200";
            } else {
              badgeClass += "bg-white text-slate-500 border-slate-200 hover:bg-slate-50";
            }

            return (
              <button
                key={q.id || idx}
                onClick={() => onSelectQuestion(idx)}
                className={badgeClass}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile BottomSheet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-4 shadow-2xl space-y-3 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-800">Danh sách câu hỏi thi thử</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseMobile}
                className="w-7 h-7 rounded-full p-0 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend Mobile */}
            <div className="flex items-center justify-around bg-slate-50 p-2 rounded-xl text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-white border border-slate-200" /> Chưa làm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-indigo-50 border border-indigo-200 text-indigo-700" /> Đã làm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-50 border border-amber-400 text-amber-800" /> Cứu xét
              </span>
            </div>

            {/* Grid Items */}
            <div className="flex-1 overflow-y-auto">{renderQuestionGrid()}</div>
          </div>
        </div>
      )}
    </>
  );
}
