"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorReportForm from "@/components/error-report-form";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Chỉ ghi log lỗi kỹ thuật ra console, tuyệt đối không in ra UI để bảo mật
    console.error("Runtime Error Captured:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 py-16 text-center lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
          <span>500 • Lỗi hệ thống</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Đã xảy ra sự cố kỹ thuật</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Hệ thống gặp phải lỗi không mong muốn trong quá trình xử lý yêu cầu. Vui lòng tải lại trang hoặc quay về trang chủ.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Button
            onClick={() => reset()}
            className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-md cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white transition-all btn-interactive"
            id="btn-retry"
          >
            Thử lại
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer">
            <Link href="/">
              Về trang chủ
            </Link>
          </Button>
        </div>
        <ErrorReportForm errorCode="500" errorMessage={error.message || error.stack} />
      </div>
    </div>
  );
}
