"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  X, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  Award, 
  AlertCircle, 
  BookOpen, 
  WifiOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  PracticeQuestion, 
  startPractice as apiStartPractice, 
  fetchMistakes as apiFetchMistakes, 
  submitPractice as apiSubmitPractice 
} from "@/lib/api/mistake-bank";

interface MistakePracticeSessionProps {
  token: string;
  onClose: () => void;
}

export default function MistakePracticeSession({ token, onClose }: MistakePracticeSessionProps) {
  const [practiceSessionId, setPracticeSessionId] = useState<string>("");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  
  // Trạng thái phiên học
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Trạng thái làm bài
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  
  const [answersDetails, setAnswersDetails] = useState<Record<number, { correctIndex: number; explanation: string }>>({});
  
  // Trạng thái nộp bài
  const [scoreInfo, setScoreInfo] = useState<{ score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // 1. Tải đề ôn tập từ Backend
  const startSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi song song hai API để lấy đề ôn tập và đáp án giải thích chi tiết thông qua API helper
      const [startJson, listJson] = await Promise.all([
        apiStartPractice(token),
        apiFetchMistakes(token, { page: 0, size: 1000 })
      ]);
      
      if (!startJson.data || !startJson.data.questions || startJson.data.questions.length === 0) {
        throw new Error("Không còn câu hỏi sai nào trong bộ nhớ cần ôn tập lúc này!");
      }
      
      setPracticeSessionId(startJson.data.practiceSessionId);
      setQuestions(startJson.data.questions);
      
      // Xây dựng map tra cứu đáp án và giải thích trong bộ nhớ
      const detailsMap: Record<number, { correctIndex: number; explanation: string }> = {};
      (listJson.data || []).forEach((q: any) => {
        detailsMap[q.questionId] = {
          correctIndex: q.correctIndex,
          explanation: q.explanation || "Không có giải thích chi tiết."
        };
      });
      setAnswersDetails(detailsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    startSession();
  }, [startSession]);

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

  // 5. Nộp bài lên Backend
  const submitPracticeResults = async () => {
    setSubmitting(true);
    
    const formattedAnswers = Object.entries(selectedAnswers).map(([qId, sIdx]) => ({
      questionId: parseInt(qId, 10),
      selectedIndex: sIdx
    }));
    
    const payload = {
      practiceSessionId,
      answers: formattedAnswers
    };

    try {
      const json = await apiSubmitPractice(token, practiceSessionId, formattedAnswers);
      setScoreInfo({
        score: json.data.score,
        total: json.data.total
      });
    } catch (err) {
      console.warn("Submit failed. Running offline protection mode...", err);
      // Lưu offline
      localStorage.setItem("offline_practice_submit", JSON.stringify({
        savedToken: token,
        payload
      }));
      setIsOffline(true);
      
      // Tính toán điểm tạm thời hiển thị cho người dùng
      setScoreInfo({
        score: 0, 
        total: questions.length
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="w-12 h-12 border-4 border-violet-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Đang chuẩn bị đề ôn tập câu sai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Không thể bắt đầu</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            {error}
          </p>
        </div>
        <Button onClick={onClose} className="bg-violet-650 hover:bg-violet-700 text-white font-bold px-6 rounded-xl cursor-pointer">
          Quay lại Sổ tay
        </Button>
      </div>
    );
  }

  // Kết quả
  if (scoreInfo) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto shadow-xl text-center space-y-6 animate-fadeIn">
        <div className="mx-auto w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center">
          <Award className="w-10 h-10 text-violet-600" />
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
              <span className="text-5xl font-black text-violet-600">{scoreInfo.score}</span>
              <span className="text-xl font-bold text-slate-400"> / {scoreInfo.total} câu đúng</span>
            </div>
          </div>
        )}

        <Button 
          data-testid="btn-submit-quiz"
          onClick={onClose} 
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl cursor-pointer"
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
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-wider">Phiên ôn tập câu sai</span>
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
          className="bg-violet-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Nội dung câu hỏi */}
      <div className="space-y-4">
        <div className="flex items-start gap-2 text-slate-800">
          <HelpCircle className="w-5 h-5 text-violet-600 mt-1 shrink-0" />
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
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between text-left transition ${
                  isCorrectOption
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm"
                    : isWrongChoice
                    ? "bg-red-50 text-red-800 border-red-300 shadow-sm"
                    : isSelected
                    ? "bg-violet-50 text-violet-800 border-violet-300 shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                } ${isAnswered ? "cursor-default" : "cursor-pointer hover:scale-[1.01] active:scale-[0.99]"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrectOption 
                      ? "bg-emerald-600 text-white" 
                      : isWrongChoice
                      ? "bg-red-600 text-white"
                      : isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span>{opt}</span>
                </div>

                {isCorrectOption && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isWrongChoice && <X className="w-4 h-4 text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hiển thị Giải thích câu hỏi sau khi chọn */}
      {isAnswered && explanation && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-xs sm:text-sm space-y-2 animate-slideDown">
          <div className="font-bold text-violet-850 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Giải thích đáp án:
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            {explanation}
          </p>
        </div>
      )}

      {/* Nút hành động */}
      {isAnswered && (
        <Button
          onClick={handleNext}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow hover:shadow-lg transition active:scale-[0.98]"
        >
          {currentIndex < questions.length - 1 ? "Câu tiếp theo" : "Nộp bài và hoàn thành"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
