"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/lib/quiz-helper";
import { Award, BookOpen, AlertTriangle, CheckCircle, RefreshCw, Home, Share2 } from "lucide-react";
import Link from "next/link";

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  elapsedSeconds: number;
  examType: "TOEIC" | "IELTS";
  onRetry: () => void;
}

export default function QuizResult({ questions, answers, elapsedSeconds, examType, onRetry }: QuizResultProps) {
  // Tính toán kết quả
  const totalQuestions = questions.length;
  let correctCount = 0;
  const incorrectTopics: string[] = [];

  questions.forEach((q) => {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) {
      correctCount++;
    } else {
      incorrectTopics.push(q.topic);
    }
  });

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleShare = () => {
    const shareText = `Hôm nay tôi đã vượt qua thử thách Daily Mini-Test trên EnStudey với kết quả xuất sắc ${correctCount}/${totalQuestions} câu đúng! 🎯 Hãy cùng luyện tập tiếng Anh du kích mỗi ngày cùng tôi tại:`;
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://enstudey.vn";

    if (navigator.share) {
      navigator.share({
        title: "Kết quả Daily Quiz - EnStudey",
        text: shareText,
        url: shareUrl
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        .then(() => {
          alert("Đã sao chép liên kết và kết quả học tập vào Clipboard! Hãy chia sẻ cho bạn bè nhé. 🚀");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  // Nhận xét dựa trên điểm số
  let ratingText = "Cố gắng hơn nữa ở lần sau nha! 💪";
  let ratingColor = "text-amber-600 bg-amber-50 border-amber-200";
  if (correctCount >= 9) {
    ratingText = "Xuất sắc quá bạn ơi! Chuẩn không cần chỉnh 🌟";
    ratingColor = "text-emerald-700 bg-emerald-50 border-emerald-250";
  } else if (correctCount >= 7) {
    ratingText = "Rất tốt! Cố gắng phát huy phong độ nhé! 🎉";
    ratingColor = "text-violet-750 bg-violet-50 border-violet-200";
  } else if (correctCount >= 5) {
    ratingText = "Khá ổn, nhưng vẫn còn một số lỗ hổng cần vá đấy! 🎯";
    ratingColor = "text-indigo-650 bg-indigo-50 border-indigo-200";
  }

  return (
    <div className="space-y-8 text-left animate-fadeIn">
      {/* Khung điểm số nổi bật */}
      <div className={`border p-6 sm:p-8 rounded-3xl shadow-sm text-center space-y-4 ${ratingColor}`}>
        <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Award className="w-9 h-9 text-violet-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Kết Quả Daily Quiz</h2>
        <div className="flex justify-center items-baseline gap-1 text-slate-800">
          <span className="text-5xl font-black text-violet-600">{correctCount}</span>
          <span className="text-xl font-bold opacity-60">/ {totalQuestions} câu đúng</span>
        </div>
        <p className="text-sm font-semibold max-w-md mx-auto leading-relaxed">
          {ratingText}
        </p>
        <div className="flex justify-center gap-6 text-xs font-bold text-slate-500 pt-2 border-t border-slate-205/40">
          <div>Thời gian: <span className="text-slate-800">{minutes}m {seconds}s</span></div>
          <div>Độ chính xác: <span className="text-slate-800">{scorePercent}%</span></div>
          <div>Dạng đề: <span className="text-slate-800">{examType}</span></div>
        </div>
      </div>

      {/* Hành động nhanh */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          onClick={onRetry}
          variant="outline"
          className="w-full sm:w-auto font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Làm đề khác
        </Button>
        <Button
          onClick={handleShare}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-md cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          Chia sẻ kết quả
        </Button>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-md cursor-pointer">
            <Home className="w-4 h-4" />
            Về Dashboard
          </Button>
        </Link>
      </div>

      {/* Review chi tiết câu hỏi */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          Xem lại đáp án chi tiết
        </h3>

        <div className="space-y-5">
          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctIndex;
            const isUnanswered = userAns === undefined;

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition ${
                  isCorrect
                    ? "border-emerald-200 hover:border-emerald-300"
                    : "border-rose-200 hover:border-rose-300"
                }`}
              >
                {/* Header câu hỏi */}
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-700 text-sm">Câu {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {q.topic}
                    </span>
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Đúng
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-650 bg-red-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {isUnanswered ? "Chưa làm" : "Sai"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Câu hỏi */}
                <p className="font-bold text-slate-900 leading-relaxed text-sm sm:text-base">
                  {q.questionText}
                </p>

                {/* Danh sách các Option */}
                <div className="grid gap-2">
                  {q.options.map((option, optIdx) => {
                    const isUserSelected = userAns === optIdx;
                    const isCorrectOption = q.correctIndex === optIdx;

                    let optionStyle = "border-slate-100 bg-slate-50/50 text-slate-800";
                    if (isCorrectOption) {
                      optionStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold";
                    } else if (isUserSelected && !isCorrect) {
                      optionStyle = "bg-red-50 border-red-400 text-red-950 font-bold";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            isCorrectOption
                              ? "bg-emerald-600 text-white"
                              : isUserSelected
                              ? "bg-red-605 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Giải thích câu hỏi */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm space-y-1">
                  <div className="font-bold text-slate-700">Giải thích chi tiết:</div>
                  <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
