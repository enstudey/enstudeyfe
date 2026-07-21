"use client";

import React from "react";
import { PredictedScoreData } from "@/types/analytics";
import { MAX_SCORES, ExamType } from "@/lib/analytics-constants";

interface ScorePredictorCardProps {
  data: PredictedScoreData;
  examType: ExamType;
}

export const ScorePredictorCard: React.FC<ScorePredictorCardProps> = ({
  data,
  examType,
}) => {
  const { predictedScore, targetScore, distanceToTarget } = data;
  const isIelts = examType === "IELTS";

  const maxScore = MAX_SCORES[examType];
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((predictedScore / (targetScore || maxScore)) * 100))
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 via-slate-900/40 to-purple-950/30 p-6 sm:p-8 shadow-xl backdrop-blur-md">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Dự Báo Band Điểm Thực Tế
            </h3>
          </div>
          <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20">
            Kỳ thi {examType}
          </span>
        </div>

        {/* Main Grid Score Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* Predicted Score */}
          <div className="rounded-2xl border border-blue-500/20 bg-white/60 dark:bg-slate-900/60 p-4 backdrop-blur-sm shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Điểm Dự Báo Hiện Tại
            </span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isIelts ? predictedScore.toFixed(1) : predictedScore}
              <span className="text-xs font-normal text-slate-400 ml-1">
                /{isIelts ? "9.0" : "990"}
              </span>
            </div>
          </div>

          {/* Target Score */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 backdrop-blur-sm shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Mục Tiêu Học Tập
            </span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              {isIelts ? targetScore.toFixed(1) : targetScore}
            </div>
          </div>

          {/* Distance to Target */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur-sm shadow-sm">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Khoảng Cách Còn Thiếu
            </span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">
              {distanceToTarget > 0
                ? isIelts
                  ? `-${distanceToTarget.toFixed(1)}`
                  : `-${distanceToTarget}`
                : "Đạt!"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Tiến độ chinh phục mục tiêu</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {progressPercent}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
