"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

export default function NavbarDesktop() {
  const pathname = usePathname();
  const [streak, setStreak] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [activeMenu, setActiveMenu] = useState<"study" | "tools" | null>(null);

  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: "study" | "tools") => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setActiveMenu(menu);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  useEffect(() => {
    // Đọc token từ cookie
    const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    const mainTimer = setTimeout(() => {
      setIsGuest(!token);

      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

        // Lấy profile
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
          .catch(() => {});

        // Lấy streak
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
            const localStreak = localStorage.getItem("user_progress_streak");
            if (localStreak) setStreak(parseInt(localStreak, 10) || 0);
          });
      } else {
        const localStreak = localStorage.getItem("user_progress_streak");
        if (localStreak) setStreak(parseInt(localStreak, 10) || 0);
      }
    }, 0);

    return () => {
      clearTimeout(mainTimer);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [pathname]);

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    const baseClass = "text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 py-5 border-b-2 cursor-pointer ";
    if (isActive) {
      return baseClass + "text-slate-950 border-violet-600";
    }
    return baseClass + "text-slate-500 hover:text-slate-950 border-transparent";
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full h-16 bg-white border-b border-slate-100 z-50 transition-all duration-300" data-testid="desktop-navbar">
      <nav className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between relative">
        {/* Nhóm Logo & Menu trái */}
        <div className="flex items-center gap-8 h-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-950 tracking-tight" data-testid="link-logo-desktop">
            <Image src="/icon-transparent.png" alt="EnStudey Logo" width={28} height={28} className="w-7 h-7" />
            <span>EnStudey</span>
          </Link>

          <div className="flex gap-6 h-full items-center">
            {/* Tab Học tập & Luyện đề */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("study")}
              onMouseLeave={handleMouseLeave}
            >
              <button className={getLinkClass("/quiz") + " " + getLinkClass("/flashcards") + " " + getLinkClass("/so-tay")} data-testid="tab-study-desktop">
                Học tập & Luyện đề <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Menu Học tập */}
              {activeMenu === "study" && (
                <div
                  className="absolute top-16 left-0 w-[600px] bg-white border border-slate-100 shadow-xl rounded-2xl p-6 grid grid-cols-3 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-150"
                  data-testid="mega-menu-study"
                >
                  {/* Cột 1: Tương tác */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Công cụ hỗ trợ</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/flashcards" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        Flashcard ôn tập
                      </Link>
                      <Link href="/so-tay" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        Sổ tay ghi nhớ
                      </Link>
                      <Link href="/speaking" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        AI Luyện nói
                      </Link>
                    </div>
                  </div>

                  {/* Cột 2: Học thuật */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đề thi thử</h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/quiz" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        Kho luyện đề chung
                      </Link>
                      <Link href="/quiz?exam=toeic" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        Luyện đề TOEIC
                      </Link>
                      <Link href="/quiz?exam=ielts" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition">
                        Luyện đề IELTS
                      </Link>
                    </div>
                  </div>

                  {/* Cột 3: Banner gợi ý (Affiliate) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-2 relative">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Gợi ý tài liệu</span>
                    <p className="text-[10px] font-medium text-slate-600 leading-normal">
                      Combo 3 cuốn sách ôn thi TOEIC 900+ kèm đĩa nghe chuẩn ETS.
                    </p>
                    <a
                      href="https://shopee.vn"
                      target="_blank"
                      rel="noopener noreferrer sponsored nofollow"
                      className="text-[10px] font-bold text-violet-600 hover:text-violet-700 block text-right"
                    >
                      Xem chi tiết &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Công cụ tra cứu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("tools")}
              onMouseLeave={handleMouseLeave}
            >
              <button className={getLinkClass("/tinh-diem-tot-nghiep") + " " + getLinkClass("/tra-cuu-tuyen-sinh")} data-testid="tab-tools-desktop">
                Công cụ tra cứu <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu Công cụ */}
              {activeMenu === "tools" && (
                <div
                  className="absolute top-16 left-0 w-[240px] bg-white border border-slate-100 shadow-xl rounded-xl p-4 flex flex-col gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-150"
                  data-testid="dropdown-menu-tools"
                >
                  <Link href="/tinh-diem-tot-nghiep" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition block py-1.5">
                    Tính điểm tốt nghiệp THPT
                  </Link>
                  <Link href="/tra-cuu-tuyen-sinh" className="text-xs font-semibold text-slate-650 hover:text-violet-600 transition block py-1.5">
                    Tra cứu trường Đại học
                  </Link>
                </div>
              )}
            </div>

            {/* Tab Tin tức & Review (Link đơn) */}
            <Link href="/tin-tuc" className={getLinkClass("/tin-tuc")} data-testid="tab-news-desktop">
              Tin tức & Review
            </Link>
          </div>
        </div>

        {/* Nhóm tìm kiếm, Streak, Profile phải */}
        <div className="flex items-center gap-6">
          {/* Thanh Search tổng lực input */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              className="w-48 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs px-3 py-1.5 pl-8 rounded-full border border-slate-200/60 focus:outline-none focus:border-violet-500 focus:w-64 transition-all duration-300"
              data-testid="input-search-desktop"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Widget Streak 🔥 */}
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm" title="Chuỗi ngày học liên tục">
            <span>🔥</span>
            <span className="text-xs font-extrabold text-amber-600" data-testid="streak-count-desktop">{streak} ngày</span>
          </div>

          {/* Profile Avatar / Đăng nhập */}
          {isGuest ? (
            <Link
              href={process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google"}
              className="py-1.5 px-4 bg-violet-650 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition shadow-sm"
              data-testid="link-login-desktop"
            >
              Đăng nhập Google
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2 border-l border-slate-150 pl-5 cursor-pointer" data-testid="link-profile-desktop">
              {avatarUrl ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-250 hover:scale-105 transition duration-150">
                  <Image src={avatarUrl} alt="User Avatar" width={32} height={32} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-650 hover:scale-105 transition duration-150">
                  U
                </div>
              )}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
