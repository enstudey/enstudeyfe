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
    // Xuất sắc
    ratingText = "Xuất sắc quá bạn ơi! Chuẩn không cần chỉnh 🌟";
    ratingColor = "text-emerald-700 bg-emerald-50 border-emerald-250";
  } else if (correctCount >= 7) {
    // Tốt
    ratingText = "Rất tốt! Cố gắng phát huy phong độ nhé! 🎉";
    ratingColor = "text-sky-700 bg-sky-50 border-sky-200";
  } else if (correctCount >= 5) {
    // Khá
    ratingText = "Khá ổn, nhưng vẫn còn một số lỗ hổng cần vá đấy! 🎯";
    ratingColor = "text-indigo-650 bg-indigo-50 border-indigo-200";
  }

  return (
    <div className="space-y-8 text-left animate-fadeIn">
      {/* Khung điểm số nổi bật */}
      <div className={`border p-6 sm:p-8 rounded-3xl shadow-sm text-center space-y-4 ${ratingColor}`}>
        <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Award className="w-9 h-9 text-sky-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">Kết Quả Daily Quiz</h2>
        <div className="flex justify-center items-baseline gap-1 text-slate-800">
          <span className="text-4xl font-black text-sky-500 font-mono">{correctCount}</span>
          <span className="text-sm font-bold opacity-60">/ {totalQuestions} câu đúng</span>
        </div>
        <p className="text-xs font-semibold max-w-md mx-auto leading-relaxed">
          {ratingText}
        </p>
        <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-200/40 font-mono">
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
          className="w-full sm:w-auto font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-sm cursor-pointer text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          Làm đề khác
        </Button>
        <Button
          onClick={handleShare}
          className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-md cursor-pointer text-xs"
        >
          <Share2 className="w-4 h-4" />
          Chia sẻ kết quả
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 py-5 px-6 shadow-md cursor-pointer text-xs">
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </Button>
        </Link>
      </div>

      {/* Review chi tiết câu hỏi */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-500" />
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
                    ? "border-emerald-100 hover:border-emerald-250"
                    : "border-rose-100 hover:border-rose-250"
                }`}
              >
                {/* Header câu hỏi */}
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-700 text-xs">Câu {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
                      {q.topic}
                    </span>
                    {isCorrect ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Đúng
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {isUnanswered ? "Chưa làm" : "Sai"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Câu hỏi */}
                <p className="font-bold text-slate-800 leading-relaxed text-sm">
                  {q.questionText}
                </p>

                {/* Danh sách các Option */}
                <div className="grid gap-2">
                  {q.options.map((option, optIdx) => {
                    const isUserSelected = userAns === optIdx;
                    const isCorrectOption = q.correctIndex === optIdx;

                    let optionStyle = "border-slate-100 bg-slate-50/50 text-slate-850";
                    if (isCorrectOption) {
                      optionStyle = "bg-emerald-50/30 border-emerald-200 text-emerald-950 font-bold";
                    } else if (isUserSelected && !isCorrect) {
                      optionStyle = "bg-rose-50/50 border-rose-200 text-rose-950 font-bold";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${
                            isCorrectOption
                              ? "bg-emerald-500 text-white"
                              : isUserSelected
                              ? "bg-rose-500 text-white"
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
                <div className="bg-sky-50/20 p-4 rounded-xl border border-sky-100/50 text-xs space-y-1">
                  <div className="font-bold text-sky-850">Giải thích chi tiết:</div>
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
