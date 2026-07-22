"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RedirectHandler() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url");

  useEffect(() => {
    if (targetUrl) {
      window.location.replace(decodeURIComponent(targetUrl));
    }
  }, [targetUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4" />
      <p className="text-sm text-slate-500">Đang chuyển hướng đến đối tác...</p>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm">Đang tải...</p>
        </div>
      }>
        <RedirectHandler />
      </Suspense>
    </>
  );
}
