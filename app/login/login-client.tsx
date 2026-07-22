"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showDemoModal, setShowDemoModal] = useState(!googleLoginUrl);

  const handleGoogleLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!googleLoginUrl) {
      e.preventDefault();
      setShowDemoModal(true);
    }
  };

  const handleDemoLogin = () => {
    document.cookie = `token=mock-demo-token-12345; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex items-center justify-center p-4 relative overflow-hidden font-sans">
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

        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold px-6 py-6 rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <a href={googleLoginUrl || "#"} onClick={handleGoogleLogin}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.014c1.49 0 2.859.549 3.92 1.455l3.224-3.224C19.146 2.88 16.792 2 13.99 2 8.155 2 3.5 6.655 3.5 12.5S8.155 23 13.99 23c5.3 0 9.878-3.727 9.878-10.5 0-.74-.066-1.455-.18-2.215H12.24Z"
                />
              </svg>
              Đăng nhập bằng Google
            </a>
          </Button>

          {/* Nút đăng nhập trải nghiệm nhanh */}
          <Button
            onClick={handleDemoLogin}
            size="lg"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-6 rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            ⚡ Trải nghiệm nhanh (Tài khoản Demo)
          </Button>
        </div>

        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng của EnStudey.
        </div>
      </div>

      {/* Modal Cảnh báo Backend Offline bằng Shadcn Dialog */}
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
