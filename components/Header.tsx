"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Coffee,
  GraduationCap,
  Zap,
  Mic,
  Layers,
  BarChart3,
  Notebook,
  Calculator,
  School,
  Map,
  Newspaper,
  Info,
  ShieldCheck,
  FileText
} from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  isAnonymous: boolean;
  avatarColor: string | null;
}

interface UserStreakDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

interface HeaderProps {
  isStatic?: boolean;
  token?: string;
}

export default function Header({ isStatic = false, token }: HeaderProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 15; // Ngưỡng cuộn lên tối thiểu (px) để tránh giật lag
  const prevPathname = useRef(pathname);

  const [user, setUser] = useState<UserDto | null>(null);
  const [streak, setStreak] = useState<UserStreakDto | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const [userRes, streakRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me/streak`, { headers })
          ]);

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.data as UserDto);
            setIsGuest(false);
          } else if (userRes.status === 401) {
            setIsGuest(true);
          }

          if (streakRes.ok) {
            const streakData = await streakRes.json();
            setStreak(streakData.data as UserStreakDto);
          }
        } catch (e) {
          console.error("Failed to fetch user data in header client-side", e);
          setIsGuest(true);
        }
      };
      fetchData();
    } else {
      Promise.resolve().then(() => {
        setIsGuest(true);
        setUser(null);
        setStreak(null);
      });
    }
  }, [token]);

  useEffect(() => {
    // Xác định xem đây có phải là chuyển đổi giữa các bài viết chi tiết tin tức (Related Articles click)
    const isRelatedArticleClick =
      prevPathname.current.startsWith("/tin-tuc/") &&
      prevPathname.current !== "/tin-tuc" &&
      pathname.startsWith("/tin-tuc/") &&
      pathname !== "/tin-tuc" &&
      prevPathname.current !== pathname;

    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: isRelatedArticleClick ? "smooth" : "instant",
      });
    };

    // Thực hiện cuộn ngay lập tức
    handleScrollToTop();

    // Thực hiện cuộn lại sau khi DOM/layout ổn định (tránh bị lệch do CLS ảnh)
    const timer = setTimeout(handleScrollToTop, 50);

    prevPathname.current = pathname;
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isStatic) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // 1. Xác định trạng thái Sticky (co lại, mờ kính)
        if (currentScrollY >= 50) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }

        // 2. Xác định trạng thái ẩn/hiện (Smart Sticky)
        if (currentScrollY < 50) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          // Cuộn xuống -> ẩn
          setIsVisible(false);
        } else if (lastScrollY.current - currentScrollY > scrollThreshold) {
          // Cuộn lên vượt ngưỡng -> hiện
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
      };

      let ticking = false;
      const scrollListener = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", scrollListener, { passive: true });
      return () => window.removeEventListener("scroll", scrollListener);
    }
  }, [isStatic]);

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    const baseClass = "text-xs font-bold uppercase tracking-wider transition-colors flex items-center h-9 ";
    if (isActive) {
      return baseClass + "text-blue-400";
    }
    return baseClass + "text-slate-400 hover:text-white";
  };

  let headerClass = "left-0 right-0 w-full transition-all duration-300 ";

  if (isStatic) {
    headerClass += "relative bg-[#0F172A] border-b border-slate-800 h-16 text-white";
  } else {
    headerClass += "fixed top-0 z-50 ";

    if (isVisible) {
      headerClass += "translate-y-0 ";
    } else {
      headerClass += "-translate-y-full ";
    }

    if (isSticky) {
      headerClass += "bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 h-14 shadow-md text-white";
    } else {
      headerClass += "bg-[#0F172A] border-b border-slate-800 h-16 text-white";
    }
  }

  return (
    <>
      {/* Placeholder để tránh Layout Shift khi Header ở trạng thái fixed */}
      {!isStatic && <div className="h-16 shrink-0" />}
      <header className={headerClass} data-testid="header-container">
        <nav className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight" data-testid="link-logo">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={32} height={32} className="w-8 h-8" />
              <span className="font-light tracking-tight text-white">en<span className="font-semibold text-blue-400">Studey</span></span>
            </Link>

            {/* Mode Switch (TOEIC / IELTS) */}
            <div className="hidden sm:flex bg-slate-800 rounded-xl p-0.5 text-[10px] font-bold border border-slate-700 h-8 items-center">
              <button className="bg-blue-500 text-white px-2.5 py-1 rounded-lg">TOEIC Mode</button>
              <button className="text-slate-400 hover:text-white px-2.5 py-1">IELTS Mode</button>
            </div>

            <div className="hidden md:flex gap-6 items-center">
              {/* Dropdown Luyện Đề */}
              <div className="relative group py-2 flex items-center h-full">
                <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors duration-200 h-9">
                  <span>Luyện đề</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-48 mt-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/exam" className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-slate-500" />
                      <span>Thi thử đầy đủ</span>
                    </span>
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90">HOT</span>
                  </Link>
                  <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Zap className="w-5 h-5 text-slate-500" />
                    <span>Mini-test hàng ngày</span>
                  </Link>
                  <Link href="/luyen-noi" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Mic className="w-5 h-5 text-slate-500" />
                    <span>Luyện nói AI</span>
                  </Link>
                  <Link href="/the-ghi-nho" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Layers className="w-5 h-5 text-slate-500" />
                    <span>Flashcard từ vựng</span>
                  </Link>
                </div>
              </div>

              {/* Dropdown Công cụ & Khám Phá */}
              <div className="relative group py-2 flex items-center h-full">
                <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors duration-200 h-9">
                  <span>Công cụ & Khám phá</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-52 mt-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/thong-ke" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <BarChart3 className="w-5 h-5 text-slate-500" />
                    <span>Phân tích học tập</span>
                  </Link>
                  <Link href="/ngan-hang-cau-sai" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Notebook className="w-5 h-5 text-slate-500" />
                    <span>Sổ tay câu sai</span>
                  </Link>
                  <Link href="/tinh-diem-tot-nghiep" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Calculator className="w-5 h-5 text-slate-500" />
                    <span>Công cụ tính điểm</span>
                  </Link>
                  <Link href="/tra-cuu-tuyen-sinh" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <School className="w-5 h-5 text-slate-500" />
                    <span>Tra cứu Đại học</span>
                  </Link>
                  <Link href="/lo-trinh" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition duration-150">
                    <Map className="w-5 h-5 text-slate-500" />
                    <span>Lộ trình học tập</span>
                  </Link>
                </div>
              </div>

              <Link href="/tin-tuc" className={getLinkClass("/tin-tuc")} data-testid="link-news">
                Tin tức
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Trạm sạc năng lượng ☕ */}
            <Link
              href="/tram-sac-nang-luong"
              className="hidden sm:flex items-center gap-1 border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 h-9 rounded-full text-xs font-bold shadow-sm transition"
              title="Trạm sạc năng lượng - Ủng hộ dự án"
            >
              <Coffee className="w-3.5 h-3.5 fill-current text-amber-600" />
              <span className="hidden md:inline">Trạm sạc</span>
            </Link>

            {/* Streak Widget */}
            <div
              className={`flex items-center gap-1.5 border px-3 h-9 rounded-full transition ${isGuest
                  ? "bg-slate-800 border-slate-700 opacity-60 cursor-help"
                  : "bg-blue-500/10 border-blue-500/20"
                }`}
              title={isGuest ? "Đăng nhập bằng Google để rèn luyện tích luỹ streak mỗi ngày nha!" : "Chuỗi ngày học liên tiếp"}
            >
              <span className={`text-lg select-none ${isGuest ? "grayscale animate-pulse" : "font-emoji animate-pulse"}`}>🔥</span>
              <span className={`font-bold text-xs ${isGuest
                  ? "text-slate-400"
                  : "text-blue-400"
                }`}>
                {isGuest ? "0 ngày" : `${streak?.currentStreak || 0} ngày`}
              </span>
            </div>

            {/* User Profile / Login */}
            {isGuest ? (
              <a
                href={googleLoginUrl}
                className="text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 h-9 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.115-5.136 4.115-3.414 0-6.146-2.73-6.146-6.146 0-3.414 2.732-6.146 6.146-6.146 1.488 0 2.842.533 3.916 1.408l3.116-3.115C19.123 2.13 16.035 1.05 12.24 1.05 6.07 1.05 1.05 6.07 1.05 1.24s5.02 11.19 11.19 11.19c5.8 0 10.66-4.08 10.66-10.66 0-.665-.06-1.305-.165-1.925H12.24z" />
                </svg>
                <span>Đăng nhập</span>
              </a>
            ) : (
              user && token && <UserProfileDropdown user={user} token={token} />
            )}

            {/* Hamburger Menu Icon (Mobile) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex md:hidden text-slate-400 hover:text-white p-1.5 cursor-pointer transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Content (Nâng cấp bo góc rounded-l-2xl và Touch Targets 48px) */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-slate-950/95 backdrop-blur-md border-l border-slate-800/80 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:hidden rounded-l-2xl ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="space-y-6 flex-grow flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
            <span className="font-bold text-sm uppercase tracking-wider text-slate-400">Danh mục</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[70vh] pr-1 flex-grow">
            <Link href="/thong-ke" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Phân tích học tập</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/ngan-hang-cau-sai" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <Notebook className="w-5 h-5 text-blue-400" />
                <span>Sổ tay câu sai</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/tinh-diem-tot-nghiep" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Công cụ tính điểm</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/tra-cuu-tuyen-sinh" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-400" />
                <span>Tra cứu Đại học</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/lo-trinh" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-400" />
                <span>Lộ trình học tập</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/tin-tuc" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-400" />
                <span>Tin tức học thuật</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/about" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>Giới thiệu</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/privacy-policy" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>Bảo mật</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/terms-of-service" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-slate-800/40 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition duration-150 border border-slate-800/50">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Điều khoản</span>
              </span>
              <span className="text-slate-500 text-xs font-light">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Drawer Footer / Account */}
        <div className="border-t border-slate-800 pt-4 mt-auto shrink-0">
          <Link href="/tram-sac-nang-luong" onClick={() => setIsDrawerOpen(false)} className="flex items-center justify-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 py-3.5 rounded-xl text-sm font-bold hover:bg-amber-500/20 transition min-h-[48px]">
            <Coffee className="w-4 h-4" />
            <span>Trạm sạc năng lượng</span>
          </Link>
        </div>
      </div>
    </>
  );
}
