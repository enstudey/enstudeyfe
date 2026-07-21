"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ErrorReportFormProps {
  errorCode?: string;
  errorMessage?: string;
}

export default function ErrorReportForm({ errorCode, errorMessage }: ErrorReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    try {
      const token = getCookie("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/error-reports`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            url: window.location.href,
            errorCode: errorCode || "UNKNOWN_ERROR",
            errorMessage: errorMessage || "N/A",
            userDescription: description,
          }),
        }
      );

      if (response.ok) {
        setSubmitResult("success");
        setDescription("");
      } else {
        setSubmitResult("error");
      }
    } catch (err) {
      console.error("Failed to send error report:", err);
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitResult(null);
    setDescription("");
  };

  return (
    <div className="mt-8">
      <Button
        variant="link"
        data-testid="btn-open-report-form"
        onClick={() => setIsOpen(true)}
        className="text-sm font-semibold text-accent p-0 h-auto cursor-pointer"
      >
        Báo lỗi cho tụi mình nha
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          {submitResult === "success" ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-500/10">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <DialogHeader className="text-center space-y-2">
                <DialogTitle className="text-lg font-bold text-foreground">Tụi mình cảm ơn nha!</DialogTitle>
                <DialogDescription className="text-sm text-emerald-700 leading-relaxed">
                  Cảm ơn bạn đã dành thời gian báo lỗi cho tụi mình nha! 💜 Sự góp ý của bạn thật sự rất quý và giúp tụi mình cải thiện ứng dụng mỗi ngày. Tụi mình sẽ kiểm tra và khắc phục nhanh chóng.
                </DialogDescription>
              </DialogHeader>
              <Button
                data-testid="btn-close-success-modal"
                onClick={closeModal}
                className="w-full font-semibold cursor-pointer"
              >
                Đóng và tiếp tục học
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-lg font-bold text-foreground">Bạn gặp sự cố gì vậy ta?</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Chia sẻ một xíu về hành động bạn vừa làm trước khi gặp lỗi nha...
                </DialogDescription>
              </DialogHeader>

              <Textarea
                data-testid="input-error-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full resize-none"
                placeholder="Ví dụ: Mình bấm đăng nhập bằng Google thì màn hình báo lỗi này..."
                required
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-zinc-400">
                  {description.length}/500 ký tự
                </span>
                <div className="flex gap-x-2">
                  <Button
                    data-testid="btn-cancel-report-form"
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    className="font-semibold cursor-pointer"
                  >
                    Hủy
                  </Button>
                  <Button
                    data-testid="btn-submit-error-report"
                    type="submit"
                    disabled={isSubmitting}
                    className="font-semibold cursor-pointer"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                  </Button>
                </div>
              </div>

              {submitResult === "error" && (
                <p className="text-xs text-error-text text-center">
                  Oops! Chưa gửi được rồi, bạn kiểm tra lại kết nối mạng nha.
                </p>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
