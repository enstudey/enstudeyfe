"use client";

import { useState } from "react";

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
      <button
        data-testid="btn-open-report-form"
        onClick={() => setIsOpen(true)}
        className="text-sm font-semibold text-accent hover:underline cursor-pointer"
      >
        Báo lỗi cho tụi mình nha
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay làm tối background 75% */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-card border border-card-border p-6 text-left shadow-2xl transition-all z-10">
            {submitResult === "success" ? (
              <div className="text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Tụi mình cảm ơn nha!</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed mb-6">
                  Cảm ơn bạn đã dành thời gian báo lỗi cho tụi mình nha! 🧡 Sự góp ý của bạn thật sự rất quý và giúp tụi mình cải thiện ứng dụng mỗi ngày. Tụi mình sẽ kiểm tra và khắc phục sớm nhất có thể.
                </p>
                <button
                  data-testid="btn-close-success-modal"
                  onClick={closeModal}
                  className="w-full rounded-md bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Đóng và tiếp tục học
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground">Bạn gặp sự cố gì vậy ta?</h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-zinc-400 hover:text-zinc-500 cursor-pointer"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  Chia sẻ một xíu về hành động bạn vừa làm trước khi gặp lỗi nha...
                </p>

                <textarea
                  data-testid="input-error-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full rounded-md border border-card-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none mb-2"
                  placeholder="Ví dụ: Mình bấm đăng nhập bằng Google thì màn hình báo lỗi này..."
                  required
                />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {description.length}/500 ký tự
                  </span>
                  <div className="flex gap-x-2">
                    <button
                      data-testid="btn-cancel-report-form"
                      type="button"
                      onClick={closeModal}
                      className="rounded px-4 py-2 text-sm font-semibold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      data-testid="btn-submit-error-report"
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                    </button>
                  </div>
                </div>

                {submitResult === "error" && (
                  <p className="mt-3 text-xs text-error-text text-center">
                    Oops! Chưa gửi được rồi, bạn kiểm tra lại kết nối mạng nha.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
