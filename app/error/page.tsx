"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorCode } from "@/types/error-code";

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");

  let title = "Oops! Có chút trục trặc";
  let message = "Có lỗi ngoài ý muốn xảy ra rồi. Thử lại sau một chút nhé.";

  // So khớp cả chuỗi hằng số lẫn giá trị số (ví dụ: "AUTH_SYNC_FAILED" || "7")
  if (
    codeParam === "AUTH_SYNC_FAILED" ||
    codeParam === String(ErrorCode.AUTH_SYNC_FAILED)
  ) {
    title = "Lỗi đồng bộ tài khoản rồi";
    message = "Tụi mình chưa đồng bộ được tài khoản Google của bạn. Thử đăng nhập lại hoặc nhắn cho tụi mình nha.";
  } else if (codeParam === String(ErrorCode.PERMISSION_DENIED)) {
    title = "Chưa được vào đây rồi";
    message = "Khu vực này cần thêm quyền truy cập. Bạn kiểm tra lại thông tin tài khoản nhé.";
  } else if (
    codeParam === String(ErrorCode.TOKEN_INVALID) ||
    codeParam === String(ErrorCode.TOKEN_EXPIRED)
  ) {
    title = "Hết phiên làm việc rồi";
    message = "Phiên đăng nhập của bạn đã hết hạn mất tiêu rồi. Đăng nhập lại nha.";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-error-text">Thông báo một xíu</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-6 text-base leading-7 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {message}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            id="btn-back-to-login"
          >
            Đăng nhập lại nè
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-foreground hover:underline p-2"
          >
            Về trang chủ nha
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        Đang tải thông tin lỗi...
      </div>
    }>
      <ErrorPageContent />
    </Suspense>
  );
}
