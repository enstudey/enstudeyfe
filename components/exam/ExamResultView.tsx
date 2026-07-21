"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitExam } from "@/lib/api/exam";
import { ExamSubmitResponse } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";
import AffiliateInFeedCard from "@/components/affiliate/AffiliateInFeedCard";

interface ExamResultViewProps {
  sessionId: string;
  token?: string;
}

export default function ExamResultView({ sessionId, token }: ExamResultViewProps) {
  const router = useRouter();
  const [result, setResult] = useState<ExamSubmitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "correct" | "incorrect" | "unanswered">("all");

  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await submitExam(sessionId, token);
        if (res && res.data) {
          setResult(res.data);
        } else {
          throw new Error("Không lấy được kết quả thi.");
        }
      } catch (err) {
        console.error("Failed to fetch exam result", err);
        setErrorMsg("Không thể tải kết quả thi hoặc phiên làm bài chưa được nộp.");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [sessionId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-muted-foreground font-medium">Đang tải và phân tích kết quả...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Lỗi tải kết quả</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{errorMsg}</p>
          <Button onClick={() => router.push("/exam")} className="w-full rounded-lg py-5 font-bold">
            Quay lại danh sách đề
          </Button>
        </div>
      </div>
    );
  }

  // Lọc kết quả
  const filteredResults = result.results.filter((r) => {
    const matchType =
      filterType === "all" ||
      (filterType === "correct" && r.isCorrect) ||
      (filterType === "incorrect" && !r.isCorrect && r.userAnswerIndex !== -1) ||
      (filterType === "unanswered" && r.userAnswerIndex === -1);

    return matchType;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full space-y-10 select-none">
      {/* Back Link */}
      <Link
        href="/exam"
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-sky-500 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Quay lại danh sách đề thi</span>
      </Link>

      {/* Summary Score Panel */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-1 bg-sky-50 text-sky-600 border border-sky-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
            Kết quả thi thử
          </div>
          <h2 className="text-xl font-black text-slate-900">Hoàn Thành Bài Thi!</h2>
          <p className="text-xs text-slate-400">
            Làm bài xong lúc: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Score Board */}
        <div className="flex flex-col items-center justify-center space-y-1 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Điểm số quy đổi
          </span>
          <span className="text-4xl font-black text-sky-500 tracking-tight font-mono">
            {result.score}
          </span>
          <span className="text-[9px] text-slate-400 uppercase font-bold">
            Thang điểm chuẩn hóa
          </span>
        </div>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center space-y-1">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto shrink-0" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Trả lời đúng</p>
            <p className="text-sm font-black text-slate-700">
              {result.correctAnswers} / {result.totalQuestions}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center space-y-1">
            <Clock className="w-5 h-5 text-sky-500 mx-auto shrink-0" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Thời gian làm</p>
            <p className="text-sm font-black text-slate-700">
              {Math.floor(result.completedDurationSeconds / 60)} phút
            </p>
          </div>
        </div>
      </div>

      {/* Detail Results Section in 70 / 30 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (70% - Review List) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-500" />
              <span>Chi Tiết Từng Câu Hỏi</span>
            </h3>

            {/* Filtering Controls */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${filterType === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
              >
                Tất cả ({result.totalQuestions})
              </button>
              <button
                onClick={() => setFilterType("correct")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${filterType === "correct"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                  }`}
              >
                Đúng ({result.correctAnswers})
              </button>
              <button
                onClick={() => setFilterType("incorrect")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${filterType === "incorrect"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-700"
                  }`}
              >
                Sai ({result.results.filter((r) => !r.isCorrect && r.userAnswerIndex !== -1).length})
              </button>
              <button
                onClick={() => setFilterType("unanswered")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${filterType === "unanswered"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-700"
                  }`}
              >
                Bỏ trống ({result.results.filter((r) => r.userAnswerIndex === -1).length})
              </button>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {filteredResults.map((r, idx) => {
              const showAd = (idx + 1) % 3 === 0;
              const adType = Math.floor((idx + 1) / 3) % 2 === 1 ? "sense" : "affiliate";

              return (
                <React.Fragment key={r.questionId}>
                  <div
                    className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 ${r.isCorrect
                        ? "border-emerald-100"
                        : r.userAnswerIndex === -1
                          ? "border-amber-100"
                          : "border-rose-100"
                      }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <span className="text-[10px] font-bold text-slate-400">
                        Câu {idx + 1} (Mã: #{r.questionId})
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold">
                        {r.isCorrect ? (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Đúng
                          </span>
                        ) : r.userAnswerIndex === -1 ? (
                          <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Chưa làm
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Sai
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <p className="text-sm font-extrabold leading-relaxed text-slate-800 select-text">
                        {r.questionText}
                      </p>

                      {/* Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {r.options.map((option, oIdx) => {
                          const isUserChoice = r.userAnswerIndex === oIdx;
                          const isCorrectChoice = r.correctAnswerIndex === oIdx;
                          const letter = ["A", "B", "C", "D"][oIdx];

                          let cardStyle = "bg-white border-slate-100 text-slate-800";
                          let letterStyle = "bg-slate-100 text-slate-600";

                          if (isCorrectChoice) {
                            cardStyle = "bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold";
                            letterStyle = "bg-emerald-500 text-white";
                          } else if (isUserChoice && !r.isCorrect) {
                            cardStyle = "bg-rose-50 border-rose-200 text-rose-800 font-extrabold";
                            letterStyle = "bg-rose-500 text-white";
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs transition duration-200 ${cardStyle}`}
                            >
                              <span
                                className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black shrink-0 ${letterStyle}`}
                              >
                                {letter}
                              </span>
                              <span>{option}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Explanation + Affiliate box */}
                      {r.explanation && (
                        <div className="bg-sky-50/30 border border-sky-100/50 rounded-2xl p-4 space-y-3.5 select-text">
                          <div>
                            <p className="text-xs font-black text-sky-800">Lời giải chi tiết:</p>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">
                              {r.explanation}
                            </p>
                          </div>
                           {/* Bẫy chuyển đổi Affiliate */}
                           <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-4">
                             <div className="flex items-center gap-2.5">
                               <BookOpen className="w-5 h-5 text-slate-500 shrink-0" />
                               <div>
                                 <h4 className="text-[10px] font-bold text-slate-800">Cẩm nang ôn luyện thi ETS 2026</h4>
                                 <p className="text-[9px] text-slate-400 leading-none">Combo giải đề chi tiết cùng phương pháp Linearthinking</p>
                               </div>
                             </div>
                             <a
                               href="https://shopee.vn"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition shrink-0"
                             >
                               Mua ngay
                             </a>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showAd && (
                    <div className="my-6">
                      {adType === "sense" ? (
                        <AdBanner adSlotId={`in-feed-ad-${r.questionId}`} />
                      ) : (
                        <AffiliateInFeedCard currentPage={1} rowIndex={idx} />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (30% - Sticky Sidebar Ad Slot) */}
        <div className="lg:col-span-4 sticky top-20 hidden lg:block">
          <AdBanner adSlotId="sidebar-result-ad" heightClass="h-[600px]" className="" />
        </div>
      </div>
    </div>
  );
}
