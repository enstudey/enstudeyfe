"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoginClientProps {
  googleLoginUrl: string | null;
}

export default function LoginClient({ googleLoginUrl }: LoginClientProps) {
  const [showDemoModal, setShowDemoModal] = useState(!googleLoginUrl);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!googleLoginUrl) {
      setShowDemoModal(true);
      return;
    }

    const isLocalhost = googleLoginUrl.includes("localhost") || googleLoginUrl.includes("127.0.0.1");

    // Local Dev: Chuyển hướng trực tiếp sang Google OAuth
    if (isLocalhost) {
      window.location.href = googleLoginUrl;
      return;
    }

    // Server Prod: Kiểm tra kết nối Render trước khi chuyển hướng
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/health/ping`,
        { signal: controller.signal, cache: "no-store" }
      );
      clearTimeout(timer);

      if (res.ok || res.status === 200 || res.status === 401) {
        window.location.href = googleLoginUrl;
      } else {
        setShowDeployModal(true);
      }
    } catch {
      setShowDeployModal(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDemoLogin = () => {
    document.cookie = `token=mock-demo-token-12345; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    window.location.href = "/";
  };

  return (
    <div className="w-full py-10 md:py-16 text-foreground flex items-center justify-center p-4 relative overflow-hidden font-sans flex-grow">
      {/* Decorative Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-8">
        <div className="space-y-2 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-foreground hover:text-indigo-600 transition-colors tracking-tight">
            <Image src="/icon-transparent.png" alt="EnStudey Logo" width={36} height={36} className="w-9 h-9" />
            <span className="text-indigo-600 dark:text-indigo-400">EnStudey</span>
          </Link>
          <p className="text-muted-foreground text-sm">Chinh phục TOEIC & IELTS thông minh cùng trợ lý AI</p>
        </div>

        <div className="py-2 space-y-3">
          <h2 className="text-xl font-bold text-foreground">Chào bạn nha! Vào học thôi nào 🚀</h2>
          <p className="text-muted-foreground text-xs leading-relaxed px-4">
            Chúng mình sử dụng tài khoản Google để đồng bộ lịch sử luyện thi và streak học tập của bạn.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Nút đăng nhập bằng Google (PRIMARY) */}
          <a
            href={googleLoginUrl || "#"}
            onClick={handleGoogleLogin}
            className={`w-full h-13 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-6 rounded-2xl shadow-md transition-all duration-200 text-sm ${
              isChecking ? "opacity-80 pointer-events-none cursor-wait" : "cursor-pointer"
            }`}
          >
            {isChecking ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang kết nối máy chủ...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 p-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.36v3.15C3.33 21.28 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.36C.49 8.29 0 10.09 0 12s.49 3.71 1.36 5.44l3.96-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.33 2.72 1.36 6.56l3.96 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
                    />
                  </svg>
                </div>
                <span>Đăng nhập bằng Google</span>
              </>
            )}
          </a>

          {/* Nút đăng nhập trải nghiệm nhanh (SECONDARY / PHỤ) */}
          <Button
            onClick={handleDemoLogin}
            size="lg"
            variant="outline"
            className="w-full h-13 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 font-semibold px-6 rounded-2xl border border-slate-200 dark:border-zinc-700 active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
          >
            ⚡ Trải nghiệm nhanh (Tài khoản Demo)
          </Button>
        </div>

        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng của EnStudey.
        </div>
      </div>

      {/* Modal Cảnh báo Backend Offline / Deploying */}
      <Dialog open={showDeployModal} onOpenChange={setShowDeployModal}>
        <DialogContent className="max-w-sm rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-indigo-200/50">
            ⏳
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Máy chủ đang khởi động hoặc cập nhật!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Máy chủ Backend (Render) đang trong quá trình khởi động hoặc nâng cấp phiên bản mới (thường mất khoảng 30 giây đến 1 phút).
              <br />
              <span className="font-semibold text-slate-600 block mt-1">
                Bạn có thể thử kết nối lại sau vài giây hoặc tiếp tục học bằng Tài khoản Demo!
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleGoogleLogin as unknown as React.MouseEventHandler<HTMLButtonElement>}
              className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 cursor-pointer text-xs"
            >
              🔄 Thử kết nối lại
            </Button>
            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full font-bold text-slate-700 hover:bg-slate-100 rounded-xl py-3 cursor-pointer text-xs"
            >
              ⚡ Vào học ngay bằng Tài khoản Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Cảnh báo Backend Chưa được cấu hình */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-sm rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-amber-200/50">
            🛠️
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Hệ thống đang được nâng cấp!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Đăng nhập bằng tài khoản Google hiện đang tạm khóa để thực hiện bảo trì máy chủ.
              <br />
              <span className="font-semibold text-slate-600 block mt-1">
                Bạn có muốn sử dụng chế độ Trải nghiệm nhanh với đầy đủ tính năng ở Frontend không?
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleDemoLogin}
              className="w-full font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3 cursor-pointer text-xs"
            >
              Vào học ngay bằng Tài khoản Demo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDemoModal(false)}
              className="w-full font-bold text-slate-500 hover:text-slate-800 py-3 text-xs"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
