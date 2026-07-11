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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-red-600">Có chút trục trặc rồi</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Oops! Có lỗi xảy ra mất rồi</h1>
        <p className="mt-6 text-base leading-7 text-zinc-500 max-w-md mx-auto">
          Tụi mình đang kiểm tra và xử lý trục trặc này. Bạn yên tâm nha, thử bấm nút dưới để tải lại xem sao nè.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Button
            onClick={() => reset()}
            className="rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm cursor-pointer"
            id="btn-retry"
          >
            Thử lại nha
          </Button>
          <Button asChild variant="ghost" className="cursor-pointer">
            <Link href="/">
              Về trang chủ thôi &rarr;
            </Link>
          </Button>
        </div>
        <ErrorReportForm errorCode="500" errorMessage={error.message || error.stack} />
      </div>
    </div>
  );
}
