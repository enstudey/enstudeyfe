"use client";

import React, { useState, useEffect, useCallback } from "react";
import QuizSession from "./QuizSession";
import QuizResult from "./QuizResult";
import { QuizQuestion, getRandomQuiz } from "@/lib/quiz-helper";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

interface QuizContainerProps {
  isGuest: boolean;
  googleLoginUrl: string;
}

interface QuizSessionData {
  examType: "TOEIC" | "IELTS";
  answers: Record<string, number>;
  currentIndex: number;
  startTime: number;
  quizIds: string[];
}

export default function QuizContainer({ isGuest, googleLoginUrl }: QuizContainerProps) {
  const [stage, setStage] = useState<"select" | "quiz" | "result">("select");

  const updateStage = (newStage: "select" | "quiz" | "result") => {
    setStage(newStage);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newStage === "select") {
        url.searchParams.delete("stage");
      } else {
        url.searchParams.set("stage", newStage);
      }
      window.history.pushState(null, "", url.toString());
      window.dispatchEvent(new Event("popstate"));
    }
  };
  const [examType, setExamType] = useState<"TOEIC" | "IELTS">("TOEIC");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Trạng thái đã làm quiz hôm nay chưa
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [lastScoreInfo, setLastScoreInfo] = useState<{ score: number; examType: string } | null>(null);

  // Phục hồi session cũ
  const restoreSession = useCallback(async (session: QuizSessionData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/english-data/quiz-pool-${session.examType.toLowerCase()}.json`);
      if (!res.ok) throw new Error("Không tải được danh sách câu hỏi.");
      
      const pool: QuizQuestion[] = await res.json();
      
      // Lọc và sắp xếp các câu hỏi đúng theo thứ tự quizIds trong session
      const restoredQuestions = session.quizIds
        .map((id: string) => pool.find((q) => q.id === id))
        .filter((q: QuizQuestion | undefined): q is QuizQuestion => q !== undefined);

      if (restoredQuestions.length === 0) {
        throw new Error("Không thể phục hồi các câu hỏi trong phiên cũ.");
      }

      setExamType(session.examType);
      setQuestions(restoredQuestions);
      setAnswers(session.answers || {});
      updateStage("quiz");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể khôi phục phiên làm bài dở dang.";
      console.error(err);
      setErrorMsg(errorMessage);
      localStorage.removeItem("daily_quiz_session"); // Xóa session lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra trạng thái hoàn thành hôm nay và khôi phục session dở dang khi mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const todayStr = new Date().toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD
      const completedDate = localStorage.getItem("daily_quiz_completed_date");
      
      if (completedDate === todayStr) {
        setIsCompletedToday(true);
        const lastScore = localStorage.getItem("daily_quiz_last_score");
        if (lastScore) {
          try {
            setLastScoreInfo(JSON.parse(lastScore));
          } catch (e) {
            console.error("Failed to parse last score info", e);
          }
        }
      }

      // Kiểm tra session dở dang
      const saved = localStorage.getItem("daily_quiz_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Nếu session chưa quá hạn 15 phút
          if (parsed.examType && parsed.quizIds && parsed.quizIds.length > 0 && Date.now() - parsed.startTime < 900000) {
            restoreSession(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved session", e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [restoreSession]);

  // Bắt đầu bài quiz mới
  const handleStartQuiz = async (type: "TOEIC" | "IELTS") => {
    setLoading(true);
    setErrorMsg(null);
    setExamType(type);
    
    try {
      const res = await fetch(`/english-data/quiz-pool-${type.toLowerCase()}.json`);
      if (!res.ok) {
        throw new Error("Không tải được danh sách câu hỏi. Vui lòng thử lại sau.");
      }
      const pool: QuizQuestion[] = await res.json();
      
      // Đọc các chủ đề yếu từ localStorage
      let weakTopics: string[] = [];
      const savedWeak = localStorage.getItem("quiz_weak_topics");
      if (savedWeak) {
        try {
          weakTopics = JSON.parse(savedWeak);
        } catch (e) {
          console.error("Failed to parse weak topics", e);
        }
      }

      // Bốc 10 câu ngẫu nhiên adaptive
      const selected = getRandomQuiz(pool, weakTopics);
      if (selected.length === 0) {
        throw new Error("Danh sách câu hỏi trống.");
      }

      const quizIds = selected.map((q) => q.id);
      
      // Khởi tạo session lưu trữ dở dang
      localStorage.setItem(
        "daily_quiz_session",
        JSON.stringify({
          examType: type,
          answers: {},
          currentIndex: 0,
          startTime: Date.now(),
          quizIds,
        })
      );

      setQuestions(selected);
      setAnswers({});
      updateStage("quiz");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      console.error(err);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành bài quiz
  const handleCompleteQuiz = (finalAnswers: Record<string, number>, seconds: number) => {
    setAnswers(finalAnswers);
    setElapsedSeconds(seconds);
    updateStage("result");

    // Tính toán số câu đúng và thu thập chủ đề yếu
    let correctCount = 0;
    const failedTopics: string[] = [];

    questions.forEach((q) => {
      const isCorrect = finalAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        correctCount++;
      } else {
        failedTopics.push(q.topic);
      }
    });

    // 1. Cập nhật weak topics vào localStorage
    if (failedTopics.length > 0) {
      let currentWeak: string[] = [];
      const savedWeak = localStorage.getItem("quiz_weak_topics");
      if (savedWeak) {
        try {
          currentWeak = JSON.parse(savedWeak);
        } catch {
          // Xử lý lỗi parse âm thầm
        }
      }
      
      // Trộn thêm các topic làm sai mới vào, loại bỏ trùng lặp
      const updatedWeak = Array.from(new Set([...currentWeak, ...failedTopics])).slice(0, 10);
      localStorage.setItem("quiz_weak_topics", JSON.stringify(updatedWeak));
    }

    // 2. Đánh dấu ngày hoàn thành hôm nay (để chặn spam và duy trì streak)
    const todayStr = new Date().toLocaleDateString("en-CA");
    localStorage.setItem("daily_quiz_completed_date", todayStr);
    setIsCompletedToday(true);

    // 3. Lưu điểm số làm bài gần nhất của hôm nay
    const scoreData = { score: correctCount, examType, date: todayStr };
    localStorage.setItem("daily_quiz_last_score", JSON.stringify(scoreData));
    setLastScoreInfo(scoreData);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
      {/* Alert hiển thị lỗi nếu có */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-750 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left max-w-xl mx-auto text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Lỗi tải dữ liệu</p>
            <p className="opacity-90">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold text-red-600 hover:underline text-xs">
            Đóng
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm font-medium">Đang chuẩn bị học liệu...</p>
        </div>
      ) : stage === "select" ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <GraduationCap className="w-9 h-9 text-violet-600" />
              Daily Mini-Test 10 Câu
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Duy trì thói quen học tiếng Anh mỗi ngày cùng đề kiểm tra nhanh. Đề thi sẽ tự động ưu tiên các chủ đề bạn làm chưa tốt!
            </p>
          </div>

          {/* Cảnh báo chưa đăng nhập (Guest Mode) */}
          {isGuest && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-2xl p-4 flex items-start gap-3 text-left max-w-xl mx-auto text-sm font-medium">
              <span className="text-lg">⚠️</span>
              <div>
                Bạn đang làm bài ở chế độ ẩn danh. Để tích lũy Streak hàng ngày và lưu sổ tay câu sai vĩnh viễn, hãy{" "}
                <a href={googleLoginUrl} className="underline font-bold text-violet-600 hover:text-violet-700 transition">
                  Đăng nhập Google ngay
                </a>!
              </div>
            </div>
          )}

          {/* Widget Trạng thái Hôm nay */}
          {isCompletedToday && lastScoreInfo && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-3 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
                <Sparkles className="w-4 h-4" />
                Đã hoàn thành thử thách hôm nay!
              </div>
              <p className="text-sm opacity-90">
                Bạn đã làm bài quiz <strong>{lastScoreInfo.examType}</strong> hôm nay với kết quả{" "}
                <strong className="text-emerald-800">{lastScoreInfo.score}/10</strong> câu đúng. Bạn vẫn có thể làm thêm các bài luyện tập khác dưới đây để củng cố kiến thức.
              </p>
            </div>
          )}

          {/* Chọn đề */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto pt-4">
            {/* TOEIC Option Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 text-lg">
                  T
                </div>
                <h3 className="text-xl font-bold text-slate-900">TOEIC Mini-Test</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tập trung vào ngữ pháp Part 5, từ vựng công sở và các giới từ hay xuất hiện trong bài thi TOEIC.
                </p>
              </div>
              <Button
                onClick={() => handleStartQuiz("TOEIC")}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow cursor-pointer"
              >
                Làm đề TOEIC
              </Button>
            </div>

            {/* IELTS Option Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center font-bold text-emerald-600 text-lg">
                  I
                </div>
                <h3 className="text-xl font-bold text-slate-900">IELTS Academic Mini-Test</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Luyện tập các điểm ngữ pháp học thuật nâng cao, collocations và từ vựng chủ đề môi trường, giáo dục, công nghệ.
                </p>
              </div>
              <Button
                onClick={() => handleStartQuiz("IELTS")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow cursor-pointer"
              >
                Làm đề IELTS
              </Button>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/dashboard" className="text-sm text-violet-600 hover:underline inline-flex items-center gap-1">
              &larr; Quay lại Dashboard
            </Link>
          </div>
        </div>
      ) : stage === "quiz" ? (
        <QuizSession questions={questions} examType={examType} onComplete={handleCompleteQuiz} />
      ) : (
        <QuizResult
          questions={questions}
          answers={answers}
          elapsedSeconds={elapsedSeconds}
          examType={examType}
          onRetry={() => updateStage("select")}
        />
      )}
    </div>
  );
}
