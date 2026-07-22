"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
        localStorage.setItem(
          `exam_session_${res.data.sessionExamId}`,
          JSON.stringify({
            examId: id,
            startedAt: res.data.startedAt,
            durationSeconds: res.data.durationSeconds
          })
        );
        router.push(`/exam/session/${res.data.sessionExamId}`);
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
    <Card className="max-w-xl mx-auto rounded-2xl border-border shadow-sm p-6 md:p-8 space-y-6">
      <CardHeader className="space-y-2 text-center p-0">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-xl text-indigo-600 mx-auto w-fit">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <CardTitle className="text-xl md:text-2xl font-black text-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Thời gian làm bài: {Math.round(durationSeconds / 60)} phút | Số câu hỏi: {totalQuestions} câu
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div className="bg-[#FFFBEB] border border-amber-200/60 rounded-xl p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
            <span>Miễn trừ trách nhiệm pháp lý (Nghị định 72/2013/NĐ-CP)</span>
          </div>
          <p className="text-amber-800/85 text-[11px] leading-relaxed text-left">
            Đây là hệ thống thi thử và tự ôn luyện cá nhân phi thương mại. Điểm số chỉ mang tính chất tham khảo, không tương đương chứng chỉ chính thức cấp bởi ETS hay IDP/British Council.
          </p>
          <div className="flex items-start gap-3 pt-2 select-none cursor-pointer">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => {
                const val = Boolean(checked);
                setAcceptedTerms(val);
                if (val) setErrorMsg(null);
              }}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-[11px] text-amber-900/90 font-medium text-left cursor-pointer">
              Tôi đã đọc kỹ và đồng ý với các tuyên bố miễn trừ trách nhiệm trên.
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0">
        <Button
          onClick={handleStart}
          disabled={loading || !acceptedTerms}
          size="lg"
          className="w-full rounded-lg py-6 font-bold gap-2 shadow-md transition duration-200 hover:scale-[1.01]"
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
      </CardFooter>
    </Card>
  );
}
