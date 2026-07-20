"use client";

import React, { useState, useEffect } from "react";
import { PerformanceAnalyticsData, PredictedScoreData } from "@/types/analytics";
import {
  EXAM_TYPES,
  ExamType,
  DEFAULT_PREDICTED_DATA,
  DEFAULT_PERFORMANCE_DATA,
} from "@/lib/analytics-constants";
import { getPerformanceAnalytics, getPredictedScore } from "@/lib/api/analytics";
import { ScorePredictorCard } from "./ScorePredictorCard";
import { RadarChart } from "./RadarChart";
import { LineChart } from "./LineChart";
import { WeakTopicsList } from "./WeakTopicsList";

export const AnalyticsDashboard: React.FC = () => {
  const [examType, setExamType] = useState<ExamType>(EXAM_TYPES.TOEIC);
  const [performance, setPerformance] = useState<PerformanceAnalyticsData | null>(null);
  const [predicted, setPredicted] = useState<PredictedScoreData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleExamTypeChange = (type: ExamType) => {
    if (type !== examType) {
      setIsLoading(true);
      setExamType(type);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const fetchAnalytics = async () => {
      try {
        const [perfRes, predRes] = await Promise.all([
          getPerformanceAnalytics(examType),
          getPredictedScore(examType),
        ]);

        if (!isSubscribed) return;

        if (perfRes && perfRes.data) {
          setPerformance(perfRes.data);
        }

        if (predRes && predRes.data) {
          setPredicted(predRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isSubscribed = false;
    };
  }, [examType]);

  const activePredicted = predicted || DEFAULT_PREDICTED_DATA[examType];
  const activePerformance = performance || DEFAULT_PERFORMANCE_DATA;

  return (
    <div className="space-y-8">
      {/* Exam Type Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Báo Cáo Năng Lực Học Tập
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân tích tự động dựa trên kết quả các bài thi thử và bài tập gần nhất.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleExamTypeChange(EXAM_TYPES.TOEIC)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              examType === EXAM_TYPES.TOEIC
                ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            📘 TOEIC (990)
          </button>
          <button
            onClick={() => handleExamTypeChange(EXAM_TYPES.IELTS)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              examType === EXAM_TYPES.IELTS
                ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            📕 IELTS (9.0)
          </button>
        </div>
      </div>

      {/* Loading Overlay State */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
            <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800/60" />
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Predictor Widget */}
          <ScorePredictorCard data={activePredicted} examType={examType} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar Chart Component */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <span>🕸️</span> Phân Tích Kỹ Năng (Radar Chart)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Tỷ lệ trả lời đúng trung bình theo 5 danh mục kỹ năng cốt lõi.
              </p>
              <RadarChart skills={activePerformance.skills} />
            </div>

            {/* Line Chart Component */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <span>📈</span> Xu Hướng Tiến Bộ (Score History)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Biểu đồ điểm số 10 bài thi thử {examType} gần đây nhất.
                </p>
              </div>
              <LineChart
                scoreHistory={activePerformance.scoreHistory}
                examType={examType}
              />
            </div>
          </div>

          {/* Weak Topics Section */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm">
            <WeakTopicsList weakTopics={activePerformance.weakTopics} />
          </div>
        </div>
      )}
    </div>
  );
};
