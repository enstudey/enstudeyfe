"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  HelpCircle,
  Check,
  ChevronRight,
  Award,
  BookOpen,
  WifiOff,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  startPractice as apiStartPractice,
  fetchMistakes as apiFetchMistakes,
  submitPractice as apiSubmitPractice
} from "@/lib/api/mistake-bank";
import { useQuery, useMutation } from "@tanstack/react-query";

interface MistakePracticeSessionProps {
  token: string;
  onClose: () => void;
}

export default function MistakePracticeSession({ token, onClose }: MistakePracticeSessionProps) {
  // Trạng thái làm bài
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");

  // Trạng thái nộp bài
  const [scoreInfo, setScoreInfo] = useState<{ score: number; total: number } | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // 1. Tải đề ôn tập từ Backend bằng useQuery
  const {
    data: startData,
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ["practice-session", token],
    queryFn: async () => {
      const [startJson, listJson] = await Promise.all([
        apiStartPractice(token),
        apiFetchMistakes(token, { page: 0, size: 1000 })
      ]);
      return { startJson, listJson };
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0
  });

  const error = queryError instanceof Error ? queryError.message : null;
  const questions = startData?.startJson?.data?.questions || [];
  const practiceSessionId = startData?.startJson?.data?.practiceSessionId || "";

  // Xây dựng map tra cứu đáp án và giải thích trong bộ nhớ
  const answersDetails = React.useMemo(() => {
    const detailsMap: Record<number, { correctIndex: number; explanation: string }> = {};
    if (startData?.listJson?.data) {
      startData.listJson.data.forEach((q) => {
        detailsMap[q.questionId] = {
          correctIndex: q.correctIndex,
          explanation: q.explanation || "Không có giải thích chi tiết."
        };
      });
    }
    return detailsMap;
  }, [startData]);

  // 2. Kiểm tra đáp án cho câu hiện tại (In-memory O(1) lookup)
  const handleSelectOption = (optionIdx: number) => {
    if (isAnswered) return; // Chỉ được chọn 1 lần

    const currentQuestion = questions[currentIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIdx
    }));

    const details = answersDetails[currentQuestion.id];
    if (details) {
      setCorrectAnswerIndex(details.correctIndex);
      setExplanation(details.explanation);
    } else {
      setCorrectAnswerIndex(0);
      setExplanation("Không có giải thích chi tiết.");
    }

    setIsAnswered(true);
  };

  // 3. Chuyển sang câu tiếp theo
  const handleNext = () => {
    setIsAnswered(false);
    setCorrectAnswerIndex(null);
    setExplanation("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Nộp toàn bộ bài làm
      submitPracticeResults();
    }
  };

  // 4. Đồng bộ offline submit
  const syncOfflineSubmissions = useCallback(async () => {
    const saved = localStorage.getItem("offline_practice_submit");
    if (!saved) return;

    try {
      const { savedToken, payload } = JSON.parse(saved);
      await apiSubmitPractice(savedToken, payload.practiceSessionId, payload.answers);

      console.log("Successfully synced offline practice submit.");
      localStorage.removeItem("offline_practice_submit");
      setIsOffline(false);
    } catch (e) {
      console.error("Failed to sync offline submission:", e);
    }
  }, []);

  // Lắng nghe trạng thái online để tự động sync
  useEffect(() => {
    const handleOnline = () => {
      syncOfflineSubmissions();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncOfflineSubmissions]);

  // 5. Nộp bài lên Backend bằng useMutation
  const submitMutation = useMutation({
    mutationFn: (payload: { practiceSessionId: string; answers: { questionId: number; selectedIndex: number }[] }) =>
      apiSubmitPractice(token, payload.practiceSessionId, payload.answers),
    onSuccess: (json) => {
      setScoreInfo({
        score: json.data.score,
        total: json.data.total
      });
    },
    onError: (err, variables) => {
      console.warn("Submit failed. Running offline protection mode...", err);
      // Lưu offline
      localStorage.setItem("offline_practice_submit", JSON.stringify({
        savedToken: token,
        payload: variables
      }));
      setIsOffline(true);

      setScoreInfo({
        score: 0,
        total: questions.length
      });
    }
  });

  const submitPracticeResults = () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(([qId, sIdx]) => ({
      questionId: parseInt(qId, 10),
      selectedIndex: sIdx
    }));

    submitMutation.mutate({
      practiceSessionId,
      answers: formattedAnswers
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Đang chuẩn bị đề ôn tập câu sai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Không thể bắt đầu</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            {error}
          </p>
        </div>
        <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-xl cursor-pointer">
          Quay lại Sổ tay
        </Button>
      </div>
    );
  }

  // Kết quả
  if (scoreInfo) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto shadow-xl text-center space-y-6 animate-fadeIn">
        <div className="mx-auto w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
          <Award className="w-10 h-10 text-blue-500" />
        </div>

        {isOffline ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left flex items-start gap-3 text-amber-800 text-sm font-medium">
            <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Đã lưu bài làm offline</p>
              <p className="opacity-90">
                Mạng gặp sự cố. Kết quả làm bài ôn tập của bạn đã được lưu tạm tại trình duyệt và sẽ tự động gửi lại khi có internet.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Hoàn Thành Ôn Tập!</h3>
            <p className="text-sm text-slate-500">
              Bạn đã hoàn thành lượt ôn tập này. Hệ thống đã cập nhật độ thành thạo và streak tương ứng.
            </p>
            <div className="pt-4">
              <span className="text-5xl font-black text-blue-500 font-mono">{scoreInfo.score}</span>
              <span className="text-xl font-bold text-slate-400"> / {scoreInfo.total} câu đúng</span>
            </div>
          </div>
        )}

        <Button
          data-testid="btn-submit-quiz"
          onClick={onClose}
          className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-4 rounded-xl cursor-pointer"
        >
          Quay lại Dashboard Sổ tay
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white border border-slate-250/60 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-lg text-left space-y-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Phiên ôn tập câu sai</span>
          <h3 className="text-sm font-bold text-slate-800">
            Câu hỏi {currentIndex + 1} / {questions.length}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-650 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tiến độ chạy (Progress Bar) */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Nội dung câu hỏi */}
      <div className="space-y-4">
        <div className="flex items-start gap-2 text-slate-800">
          <HelpCircle className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
          <p className="font-semibold text-sm sm:text-base leading-relaxed">
            {currentQuestion.questionText}
          </p>
        </div>

        {/* Danh sách lựa chọn đáp án */}
        <div className="grid gap-3 pt-2">
          {currentQuestion.options.map((opt, idx) => {
            const userChoice = selectedAnswers[currentQuestion.id];
            const isSelected = userChoice === idx;
            const hasChecked = isAnswered && correctAnswerIndex !== null;
            const isCorrectOption = hasChecked && correctAnswerIndex === idx;
            const isWrongChoice = hasChecked && isSelected && correctAnswerIndex !== idx;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between text-left transition ${isCorrectOption
                    ? "bg-emerald-50/30 text-emerald-800 border-emerald-250 shadow-xs"
                    : isWrongChoice
                      ? "bg-rose-50/50 text-rose-800 border-rose-250 shadow-xs"
                      : isSelected
                        ? "bg-blue-50 text-blue-800 border-blue-300 shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  } ${isAnswered ? "cursor-default" : "cursor-pointer hover:scale-[1.01] active:scale-[0.99]"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrectOption
                      ? "bg-emerald-500 text-white"
                      : isWrongChoice
                        ? "bg-rose-500 text-white"
                        : isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-500"
                    }`}>
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span>{opt}</span>
                </div>

                {isCorrectOption && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isWrongChoice && <X className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hiển thị Giải thích câu hỏi sau khi chọn */}
      {isAnswered && explanation && (
        <div className="bg-blue-50/20 border border-blue-100/50 rounded-2xl p-4 text-xs sm:text-sm space-y-2 animate-slideDown">
          <div className="font-bold text-blue-850 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Giải thích đáp án:
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            {explanation}
          </p>
        </div>
      )}

      {/* Nút hành động */}
      {isAnswered && (
        <Button
          onClick={handleNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow hover:shadow-lg transition active:scale-[0.98]"
        >
          {currentIndex < questions.length - 1 ? "Câu tiếp theo" : "Nộp bài và hoàn thành"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
