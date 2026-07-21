"use client";

import React, { useState, useEffect, useCallback } from "react";
import QuizSession from "./QuizSession";
import QuizResult from "./QuizResult";
import { QuizQuestion, getRandomQuiz } from "@/lib/quiz-helper";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertCircle, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getDailyQuizStatus, getDailyQuizQuestions, submitDailyQuiz } from "@/lib/api/quiz";
import { recordStreakActivity } from "@/lib/api/streak";


interface QuizContainerProps {
  isGuest: boolean;
  googleLoginUrl: string;
  token?: string;
}

interface QuizSessionData {
  examType: "TOEIC" | "IELTS";
  answers: Record<string, number>;
  currentIndex: number;
  startTime: number;
  quizIds: string[];
}

export default function QuizContainer({ isGuest, googleLoginUrl, token }: QuizContainerProps) {
  const [stage, setStage] = useState<"select" | "quiz" | "result">("select");
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
      setStage("quiz");
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
    let active = true;

    async function checkStatus() {
      if (!isGuest && token) {
        try {
          const res = await getDailyQuizStatus(token);
          if (active && res && res.data) {
            if (res.data.completedToday) {
              setIsCompletedToday(true);
              setLastScoreInfo({
                score: res.data.score ?? 0,
                examType: "Mini-Test"
              });
              return;
            }
          }
        } catch (e) {
          console.error("Failed to check daily quiz completion status from server", e);
        }
      }

      // Fallback client-only
      const todayStr = new Date().toLocaleDateString("en-CA");
      const completedDate = localStorage.getItem("daily_quiz_completed_date");
      if (completedDate === todayStr && active) {
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
    }

    const timer = setTimeout(() => {
      checkStatus();

      // Kiểm tra session dở dang
      const saved = localStorage.getItem("daily_quiz_session");
      if (saved && active) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.examType && parsed.quizIds && parsed.quizIds.length > 0 && Date.now() - parsed.startTime < 900000) {
            restoreSession(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved session", e);
        }
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [restoreSession, isGuest, token]);

  // Bắt đầu bài quiz mới
  const handleStartQuiz = async (type: "TOEIC" | "IELTS") => {
    setLoading(true);
    setErrorMsg(null);
    setExamType(type);

    try {
      let selected: QuizQuestion[] = [];
      let sessionId = "";

      if (!isGuest && token) {
        const res = await getDailyQuizQuestions(type, token);
        if (res && res.data && res.data.questions) {
          sessionId = res.data.sessionId;
          selected = res.data.questions.map((q) => ({
            id: q.id.toString(),
            questionText: q.questionText,
            options: q.options,
            correctIndex: -1, // Sẽ được chấm điểm ở Server
            explanation: "",
            part: "",
            topic: ""
          }));
        } else {
          throw new Error("Không tải được đề thi từ máy chủ.");
        }
      } else {
        // Fallback Khách vãng lai tải đề tĩnh
        const res = await fetch(`/english-data/quiz-pool-${type.toLowerCase()}.json`);
        if (!res.ok) {
          throw new Error("Không tải được danh sách câu hỏi. Vui lòng thử lại sau.");
        }
        const pool: QuizQuestion[] = await res.json();

        let weakTopics: string[] = [];
        const savedWeak = localStorage.getItem("quiz_weak_topics");
        if (savedWeak) {
          try {
            weakTopics = JSON.parse(savedWeak);
          } catch (e) {
            console.error("Failed to parse weak topics", e);
          }
        }

        selected = getRandomQuiz(pool, weakTopics);
      }

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
          sessionId
        })
      );

      setQuestions(selected);
      setAnswers({});
      setStage("quiz");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      console.error(err);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành bài quiz
  const handleCompleteQuiz = async (finalAnswers: Record<string, number>, seconds: number) => {
    setAnswers(finalAnswers);
    setElapsedSeconds(seconds);
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!isGuest && token) {
        // Đọc session dở dang để lấy sessionId
        const savedSession = localStorage.getItem("daily_quiz_session");
        const parsedSession = savedSession ? JSON.parse(savedSession) : null;
        const sessionId = parsedSession ? parsedSession.sessionId : "";

        // Chuẩn bị payload nộp bài
        const answersPayload = questions.map((q) => ({
          questionId: parseInt(q.id, 10),
          selectedIndex: finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : -1
        }));

        const submitPayload = {
          sessionId: sessionId || "client-session-id",
          answers: answersPayload
        };

        const resSubmit = await submitDailyQuiz(submitPayload, token);
        if (resSubmit && resSubmit.data) {
          const result = resSubmit.data;

          try {
            await recordStreakActivity(token, "DAILY_QUIZ", sessionId || "client-session-id");
          } catch (streakErr) {
            console.error("Failed to record streak activity", streakErr);
          }

          // Cập nhật đáp án đúng và giải thích từ Server trả về vào questions state

          const evaluatedQuestions = questions.map((q) => {
            const serverResult = result.results.find((r) => r.questionId.toString() === q.id);
            return {
              ...q,
              correctIndex: serverResult ? serverResult.correctAnswerIndex : -1,
              explanation: serverResult ? serverResult.explanation : "Không có giải thích từ máy chủ."
            };
          });

          setQuestions(evaluatedQuestions);
          setIsCompletedToday(true);
          setLastScoreInfo({
            score: result.score,
            examType: "Mini-Test"
          });
          localStorage.removeItem("daily_quiz_session");
        } else {
          throw new Error("Không nhận được kết quả chấm điểm từ máy chủ.");
        }
      } else {
        // Chế độ khách vãng lai (client-only)
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

        if (failedTopics.length > 0) {
          let currentWeak: string[] = [];
          const savedWeak = localStorage.getItem("quiz_weak_topics");
          if (savedWeak) {
            try {
              currentWeak = JSON.parse(savedWeak);
            } catch {
              // Parse error ignored silenty
            }
          }
          const updatedWeak = Array.from(new Set([...currentWeak, ...failedTopics])).slice(0, 10);
          localStorage.setItem("quiz_weak_topics", JSON.stringify(updatedWeak));
        }

        const todayStr = new Date().toLocaleDateString("en-CA");
        localStorage.setItem("daily_quiz_completed_date", todayStr);
        setIsCompletedToday(true);

        const scoreData = { score: correctCount, examType, date: todayStr };
        localStorage.setItem("daily_quiz_last_score", JSON.stringify(scoreData));
        setLastScoreInfo(scoreData);
        localStorage.removeItem("daily_quiz_session");
      }

      setStage("result");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi khi nộp bài.";
      console.error(err);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
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
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Đang chuẩn bị học liệu...</p>
        </div>
      ) : stage === "select" ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <GraduationCap className="w-9 h-9 text-blue-500" />
              Daily Mini-Test 10 Câu
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Duy trì thói quen học tiếng Anh mỗi ngày cùng đề kiểm tra nhanh. Đề thi sẽ tự động ưu tiên các chủ đề bạn làm chưa tốt!
            </p>
          </div>

          {/* Cảnh báo chưa đăng nhập (Guest Mode) */}
          {isGuest && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-2xl p-4 flex items-start gap-3 text-left max-w-xl mx-auto text-sm font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                Bạn đang làm bài ở chế độ ẩn danh. Để tích lũy Streak hàng ngày và lưu sổ tay câu sai vĩnh viễn, hãy{" "}
                <a href={googleLoginUrl} className="underline font-bold text-blue-600 hover:text-blue-700 transition">
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
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-655 text-lg">
                  T
                </div>
                <h3 className="text-xl font-bold text-slate-900">TOEIC Mini-Test</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tập trung vào ngữ pháp Part 5, từ vựng công sở và các giới từ hay xuất hiện trong bài thi TOEIC.
                </p>
              </div>
              <Button
                onClick={() => handleStartQuiz("TOEIC")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow cursor-pointer"
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow cursor-pointer"
              >
                Làm đề IELTS
              </Button>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
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
          onRetry={() => setStage("select")}
        />
      )}
    </div>
  );
}
