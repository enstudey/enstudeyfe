"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startExam } from "@/lib/api/exam";
import { Play, ShieldAlert, Sparkles } from "lucide-react";

interface StartExamCardProps {
  id: string;
  title: string;
  durationSeconds: number;
  totalQuestions: number;
  token?: string;
}

export default function StartExamCard({
  id,
  title,
  durationSeconds,
  totalQuestions,
  token
}: StartExamCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleStart = async () => {
    if (!acceptedTerms) {
      setErrorMsg("Bạn cần đồng ý với các tuyên bố miễn trừ trách nhiệm pháp lý trước khi làm bài.");
      return;
    }

    setLoading(false);
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await startExam(id, token);
      if (res && res.data && res.data.sessionExamId) {
        // Lưu session vào localStorage để hỗ trợ phục hồi
        localStorage.setItem(
          `exam_session_${res.data.sessionExamId}`,
          JSON.stringify({
            examId: id,
            startedAt: res.data.startedAt,
            durationSeconds: res.data.durationSeconds
          })
        );
        router.push(`/exams/session/${res.data.sessionExamId}`);
      } else {
        throw new Error("Không nhận được mã phiên thi hợp lệ từ máy chủ.");
      }
    } catch (err) {
      console.error("Failed to start exam", err);
      setErrorMsg("Không thể khởi tạo bài thi. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-8 space-y-6 w-full max-w-xl mx-auto">
      {/* Title */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-violet-50 rounded-2xl text-violet-600">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">
          Thời gian làm bài: {Math.round(durationSeconds / 60)} phút | Số câu hỏi: {totalQuestions} câu
        </p>
      </div>

      {/* Compliance / Legal Disclaimer (BR-2) */}
      <div className="bg-[#FFFBEB] border border-amber-200/60 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
          <span>Miễn trừ trách nhiệm pháp lý (Nghị định 72/2013/NĐ-CP)</span>
        </div>
        <p className="text-amber-800/85 text-[11px] leading-relaxed text-left">
          Đây là hệ thống thi thử và tự ôn luyện cá nhân phi thương mại. Điểm số chỉ mang tính chất tham khảo, không tương đương chứng chỉ chính thức cấp bởi ETS hay IDP/British Council.
        </p>
        <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (e.target.checked) setErrorMsg(null);
            }}
            className="mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-[11px] text-amber-900/90 font-medium text-left">
            Tôi đã đọc kỹ và đồng ý với các tuyên bố miễn trừ trách nhiệm trên.
          </span>
        </label>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleStart}
        disabled={loading || !acceptedTerms}
        size="lg"
        className="w-full rounded-2xl py-6 font-bold gap-2 shadow-md transition duration-200 hover:scale-[1.01]"
      >
        {loading ? (
          <span>Đang tạo đề thi...</span>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Bắt đầu làm bài</span>
          </>
        )}
      </Button>
    </div>
  );
}
