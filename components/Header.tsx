"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
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
    const baseClass = "text-xs font-bold uppercase tracking-wider transition-colors ";
    if (isActive) {
      return baseClass + "text-white border-b-2 border-sky-500 pb-1";
    }
    return baseClass + "text-slate-400 hover:text-white pb-1 border-b-2 border-transparent";
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
        <nav className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight" data-testid="link-logo">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={32} height={32} className="w-8 h-8" />
              <span className="font-light tracking-tight text-white">en<span className="font-semibold text-sky-400">Studey</span></span>
            </Link>
            
            {/* Mode Switch (TOEIC / IELTS) */}
            <div className="hidden sm:flex bg-slate-800 rounded-xl p-0.5 text-[10px] font-bold border border-slate-700">
              <button className="bg-sky-500 text-white px-2.5 py-1 rounded-lg">TOEIC Mode</button>
              <button className="text-slate-400 hover:text-white px-2.5 py-1">IELTS Mode</button>
            </div>

            <div className="hidden md:flex gap-6 items-center">
              {/* Dropdown Luyện Đề */}
              <div className="relative group py-2">
                <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors duration-200">
                  <span>Luyện đề</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-48 mt-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/exam" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🏛️ Thi thử đầy đủ</Link>
                  <Link href="/" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">⚡ Mini-test hàng ngày</Link>
                  <Link href="/speaking" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🎙️ Luyện nói AI</Link>
                  <Link href="/flashcards" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🗂️ Flashcard</Link>
                </div>
              </div>

              {/* Dropdown Khám Phá */}
              <div className="relative group py-2">
                <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors duration-200">
                  <span>Khám phá</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-52 mt-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/analytics" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">📊 Phân tích học tập</Link>
                  <Link href="/roadmap" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🗺️ Lộ trình</Link>
                  <Link href="/tin-tuc" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">📰 Tin tức học thuật</Link>
                  <Link href="/tinh-diem-tot-nghiep" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🧮 Tính điểm tốt nghiệp</Link>
                  <Link href="/tra-cuu-tuyen-sinh" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🎓 Tra cứu tuyển sinh</Link>
                  <Link href="/tram-sac-nang-luong" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition duration-150">🥤 Trạm sạc</Link>
                </div>
              </div>

              <Link href="/mistake-bank" className={getLinkClass("/mistake-bank")} data-testid="link-mistake-bank">
                Sổ câu sai
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Streak Widget */}
            <div
              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full transition ${
                isGuest
                  ? "bg-slate-800 border-slate-700 opacity-60 cursor-help"
                  : "bg-sky-500/10 border-sky-500/20"
              }`}
              title={isGuest ? "Đăng nhập bằng Google để rèn luyện tích luỹ streak mỗi ngày nha!" : "Chuỗi ngày học liên tiếp"}
            >
              <span className={isGuest ? "grayscale text-lg" : "text-lg"}>🔥</span>
              <span className={`font-bold text-xs ${
                isGuest
                  ? "text-slate-400"
                  : "text-sky-400"
              }`}>
                {isGuest ? "0 ngày" : `${streak?.currentStreak || 0} ngày`}
              </span>
            </div>

            {/* User Profile / Login */}
            {isGuest ? (
              <a
                href={googleLoginUrl}
                className="text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.115-5.136 4.115-3.414 0-6.146-2.73-6.146-6.146 0-3.414 2.732-6.146 6.146-6.146 1.488 0 2.842.533 3.916 1.408l3.116-3.115C19.123 2.13 16.035 1.05 12.24 1.05 6.07 1.05 1.05 6.07 1.05 12.24s5.02 11.19 11.19 11.19c5.8 0 10.66-4.08 10.66-10.66 0-.665-.06-1.305-.165-1.925H12.24z"/>
                </svg>
                <span>Đăng nhập</span>
              </a>
            ) : (
              user && token && <UserProfileDropdown user={user} token={token} />
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
