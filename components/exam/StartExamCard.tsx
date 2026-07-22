"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { startExam } from "@/lib/api/exam";
import { Play, ShieldCheck, Clock, FileText, GraduationCap, Loader2 } from "lucide-react";

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

  const handleStart = async () => {
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

  const durationMinutes = Math.round(durationSeconds / 60);

  return (
    <Card className="max-w-xl mx-auto rounded-3xl border border-border/60 shadow-lg shadow-slate-200/40 dark:shadow-none p-6 md:p-8 space-y-6 bg-card text-card-foreground">
      {/* Header Badge & Title */}
      <CardHeader className="space-y-4 text-center p-0">
        <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 text-primary rounded-2xl mx-auto ring-8 ring-primary/5">
          <GraduationCap className="w-8 h-8" />
        </div>
        
        <div className="space-y-1.5">
          <CardTitle className="text-xl md:text-2xl font-extrabold text-foreground leading-snug tracking-tight">
            {title}
          </CardTitle>
        </div>

        {/* Specs Badges Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <Clock className="w-4.5 h-4.5 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Thời gian</p>
              <p className="text-xs font-extrabold text-foreground">{durationMinutes} phút</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <FileText className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Số câu hỏi</p>
              <p className="text-xs font-extrabold text-foreground">{totalQuestions} câu</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Clean Flat Disclaimer Box */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Miễn trừ trách nhiệm pháp lý (Nghị định 72/2013/NĐ-CP)</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed pl-6">
            Đây là hệ thống thi thử và tự ôn luyện cá nhân phi thương mại. Điểm số chỉ mang tính chất tham khảo, không tương đương chứng chỉ chính thức cấp bởi ETS hay IDP/British Council.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 flex flex-col space-y-3">
        <Button
          onClick={handleStart}
          disabled={loading}
          size="lg"
          className="w-full h-13 text-base font-extrabold rounded-2xl gap-2 shadow-md shadow-primary/20 btn-interactive"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tạo bài thi...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Bắt đầu làm bài</span>
            </>
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground font-medium">
          ⚡ Hệ thống tự động ghi nhận thời gian làm bài khi bạn nhấn bắt đầu.
        </p>
      </CardFooter>
    </Card>
  );
}
