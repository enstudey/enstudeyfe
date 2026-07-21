"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Layout Error Captured:", error);
  }, [error]);

  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center sm:py-32 lg:px-8 text-zinc-900">
        <div className="text-center">
          <p className="text-base font-semibold text-red-600">Oops! Sự cố nhỏ</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Ứng dụng gặp chút rắc rối rồi</h1>
          <p className="mt-6 text-base leading-7 text-zinc-500 max-w-md mx-auto">
            Có lỗi xảy ra khi tải giao diện hệ thống. Bạn bấm nút dưới để tụi mình tải lại cấu trúc nha.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => reset()}
              size="lg"
              className="rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              Tải lại trang nha
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
