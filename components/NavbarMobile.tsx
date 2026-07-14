"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, DialogTrigger, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu, X, Home, Pencil, Mic, GraduationCap } from "lucide-react";

export default function NavbarMobile() {
  const pathname = usePathname();
  const [streak, setStreak] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    // Đọc token từ cookie
    const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    const mainTimer = setTimeout(() => {
      setIsGuest(!token);

      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        
        // Lấy thông tin Profile
        fetch(`${apiUrl}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Unauthorized");
          })
          .then((body) => {
            if (body.data && body.data.avatarUrl) {
              setAvatarUrl(body.data.avatarUrl);
            }
          })
          .catch(() => {
            // Xử lý âm thầm
          });

        // Lấy thông tin Streak
        fetch(`${apiUrl}/api/v1/users/me/streak`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Unauthorized");
          })
          .then((body) => {
            if (body.data && typeof body.data.currentStreak === "number") {
              setStreak(body.data.currentStreak);
            }
          })
          .catch(() => {
            // Fallback sang localStorage nếu API lỗi
            const localStreak = localStorage.getItem("user_progress_streak");
            if (localStreak) setStreak(parseInt(localStreak, 10) || 0);
          });
      } else {
        // Chưa đăng nhập -> Đọc streak từ localStorage
        const localStreak = localStorage.getItem("user_progress_streak");
        if (localStreak) setStreak(parseInt(localStreak, 10) || 0);
      }
    }, 0);

    return () => clearTimeout(mainTimer);
  }, [pathname]);

  const getLinkClass = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    const baseClass = "flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-500 hover:text-slate-900 transition-all duration-200 relative cursor-pointer ";
    if (isActive) {
      return baseClass + "text-violet-600 font-bold";
    }
    return baseClass + "text-slate-400";
  };

  const getDrawerLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    const baseClass = "text-sm font-bold uppercase tracking-wider transition-colors py-2 block border-b border-transparent ";
    if (isActive) {
      return baseClass + "text-violet-600 border-violet-600";
    }
    return baseClass + "text-slate-500 hover:text-slate-950";
  };

  return (
    <>
      {/* Top Bar cố định ở đỉnh */}
      <header className="fixed top-0 left-0 right-0 w-full h-14 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg text-slate-950 tracking-tight" data-testid="link-logo-mobile">
          <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
          <span>EnStudey</span>
        </Link>

        {/* Streak 🔥 */}
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse" title="Chuỗi ngày học liên tục">
          <span className="text-xs">🔥</span>
          <span className="text-xs font-black text-amber-600" data-testid="streak-count-mobile">{streak}</span>
        </div>

        {/* Nút Profile / Menu phụ (Bung Drawer) */}
        <div className="flex items-center">
          <Dialog>
            <DialogTrigger className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer" aria-label="Mở menu" data-testid="btn-menu-drawer">
              {avatarUrl ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                  <Image src={avatarUrl} alt="Avatar" width={28} height={28} className="w-full h-full object-cover" />
                </div>
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </DialogTrigger>
            <DialogPortal>
              <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/20 duration-150 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
              <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 h-full w-3/4 max-w-xs border-l bg-white p-6 shadow-lg duration-150 flex flex-col justify-start outline-none data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
                <DialogTitle className="sr-only">Menu chính</DialogTitle>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">Danh mục phụ</span>
                  <DialogPrimitive.Close render={<button className="p-2 -mr-2 text-slate-500 hover:text-slate-900 cursor-pointer" aria-label="Đóng menu" />}>
                    <X className="w-5 h-5" />
                  </DialogPrimitive.Close>
                </div>
                <div className="flex flex-col gap-5 pt-6">
                  <Link href="/tin-tuc" className={getDrawerLinkClass("/tin-tuc")} data-testid="link-news-mobile">
                    Tin tức học thuật
                  </Link>
                  <Link href="/about" className={getDrawerLinkClass("/about")} data-testid="link-about-mobile">
                    Giới thiệu
                  </Link>
                  <Link href="/tram-sac-nang-luong" className={getDrawerLinkClass("/tram-sac-nang-luong")} data-testid="link-donors-mobile">
                    Trạm sạc 🥤
                  </Link>
                  <Link href="/terms-of-service" className={getDrawerLinkClass("/terms-of-service")} data-testid="link-terms-mobile">
                    Điều khoản dịch vụ
                  </Link>
                  <Link href="/privacy-policy" className={getDrawerLinkClass("/privacy-policy")} data-testid="link-privacy-mobile">
                    Chính sách bảo mật
                  </Link>
                  {isGuest && (
                    <Link
                      href={process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google"}
                      className="mt-4 text-center py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      data-testid="link-login-mobile"
                    >
                      Đăng nhập Google
                    </Link>
                  )}
                </div>
              </DialogPrimitive.Popup>
            </DialogPortal>
          </Dialog>
        </div>
      </header>

      {/* Spacer cho Top Bar */}
      <div className="h-14 shrink-0 w-full" />

      {/* Bottom Navigation Bar cố định ở đáy */}
      <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 flex items-center justify-around pb-safe-bottom" data-testid="bottom-navigation-bar">
        <Link href="/" className={getLinkClass("/")} data-testid="tab-home">
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Trang chủ</span>
          {pathname === "/" && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-600" />}
        </Link>
        <Link href="/quiz" className={getLinkClass("/quiz")} data-testid="tab-quiz">
          <Pencil className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Kho đề</span>
          {pathname.startsWith("/quiz") && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-600" />}
        </Link>
        <Link href="/speaking" className={getLinkClass("/speaking")} data-testid="tab-speaking">
          <Mic className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">AI Luyện nói</span>
          {pathname.startsWith("/speaking") && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-600" />}
        </Link>
        <Link href="/tinh-diem-tot-nghiep" className={getLinkClass("/tinh-diem-tot-nghiep")} data-testid="tab-tools">
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Công cụ</span>
          {(pathname.startsWith("/tinh-diem-tot-nghiep") || pathname.startsWith("/tra-cuu-tuyen-sinh")) && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-600" />
          )}
        </Link>
      </nav>
    </>
  );
}
