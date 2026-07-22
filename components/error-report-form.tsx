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
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 p-0 h-auto cursor-pointer hover:underline transition-colors"
      >
        Báo cáo sự cố cho ban quản trị
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
                <DialogTitle className="text-lg font-bold text-foreground">Đã gửi báo cáo thành công</DialogTitle>
                <DialogDescription className="text-sm text-emerald-700 leading-relaxed">
                  Cảm ơn bạn đã gửi phản hồi. Chúng tôi đã ghi nhận thông tin và sẽ tiến hành kiểm tra xử lý trong thời gian sớm nhất.
                </DialogDescription>
              </DialogHeader>
              <Button
                data-testid="btn-close-success-modal"
                onClick={closeModal}
                className="w-full font-semibold cursor-pointer"
              >
                Đóng cửa sổ
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-lg font-bold text-foreground">Báo cáo sự cố hệ thống</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Vui lòng mô tả chi tiết thao tác hoặc lỗi bạn vừa gặp phải để ban quản trị hỗ trợ xử lý.
                </DialogDescription>
              </DialogHeader>

              <Textarea
                data-testid="input-error-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full resize-none"
                placeholder="Mô tả chi tiết lỗi hoặc thao tác xảy ra trước khi gặp sự cố..."
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
                <p className="text-xs text-error-text text-center font-medium">
                  Không thể gửi báo cáo. Vui lòng kiểm tra lại kết nối mạng.
                </p>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
