"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Coffee,
  GraduationCap,
  Zap,
  Mic,
  Layers,
  BarChart3,
  Notebook,
  Map,
  Newspaper,
} from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(Boolean(token));
  const [isGuest, setIsGuest] = useState<boolean>(!token);

  useEffect(() => {
    if (token) {
      try {
        const cached = localStorage.getItem("user_profile_cache");
        if (cached) {
          setUser(JSON.parse(cached));
          setIsLoadingUser(false);
        }
      } catch {}

      const fetchData = async () => {
        if (token === "mock-demo-token-12345") {
          const demoUser: UserDto = {
            id: "demo-user",
            email: "demo.user@enstudey.com",
            fullName: "Học Viên Trải Nghiệm 🎓",
            avatarUrl: "",
            role: "STUDENT",
            isAnonymous: false,
            avatarColor: "blue"
          };
          setUser(demoUser);
          setStreak({
            currentStreak: 5,
            longestStreak: 12,
            lastActivityDate: new Date().toISOString()
          });
          setIsGuest(false);
          setIsLoadingUser(false);
          return;
        }

        try {
          const headers = { Authorization: `Bearer ${token}` };
          const [userRes, streakRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/users/me`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/users/me/streak`, { headers })
          ]);

          let hasUser = false;
          if (userRes.ok) {
            const userData = await userRes.json();
            const u = userData.data as UserDto;
            setUser(u);
            setIsGuest(false);
            hasUser = true;
            try {
              localStorage.setItem("user_profile_cache", JSON.stringify(u));
            } catch {}
          } else if (userRes.status === 401) {
            setIsGuest(true);
            setUser(null);
            try {
              localStorage.removeItem("user_profile_cache");
            } catch {}
          }

          if (streakRes.ok) {
            const streakData = await streakRes.json();
            setStreak(streakData.data as UserStreakDto);
          } else if (hasUser) {
            setStreak({ currentStreak: 0, longestStreak: 0, lastActivityDate: null });
          }
        } catch {
          setIsGuest(true);
          setUser(null);
          setStreak(null);
          try {
            localStorage.removeItem("user_profile_cache");
          } catch {}
        } finally {
          setIsLoadingUser(false);
        }
      };
      fetchData();
    } else {
      setIsGuest(true);
      setUser(null);
      setStreak(null);
      setIsLoadingUser(false);
      try {
        localStorage.removeItem("user_profile_cache");
      } catch {}
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
    const baseClass = "text-xs font-bold transition-colors flex items-center h-9 ";
    if (isActive) {
      return baseClass + "text-[#818CF8]";
    }
    return baseClass + "text-[#94A0B8] hover:text-[#FFFFFF]";
  };

  let headerClass = "left-0 right-0 w-full transition-all duration-300 ";

  if (isStatic) {
    headerClass += "relative bg-[#16213A] border-b border-[#243356] h-16 text-[#FFFFFF]";
  } else {
    headerClass += "fixed top-0 z-50 ";

    if (isVisible) {
      headerClass += "translate-y-0 ";
    } else {
      headerClass += "-translate-y-full ";
    }

    if (isSticky) {
      headerClass += "bg-[#16213A]/95 backdrop-blur-md border-b border-[#243356] h-14 shadow-md text-[#FFFFFF]";
    } else {
      headerClass += "bg-[#16213A] border-b border-[#243356] h-16 text-[#FFFFFF]";
    }
  }

  return (
    <>
      {/* Placeholder để tránh Layout Shift khi Header ở trạng thái fixed */}
      {!isStatic && <div className="h-16 shrink-0" />}
      <header className={headerClass} data-testid="header-container">
        <nav className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight" data-testid="link-logo">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={32} height={32} className="w-8 h-8" />
              <span className="font-light tracking-tight text-white">En<span className="font-semibold text-[#818CF8]">Studey</span></span>
            </Link>

            {/* TOEIC Single Mode Badge (Refined smaller SaaS style with EnStudey Hex Tokens) */}
            <div className="hidden sm:flex bg-[#1E294B] rounded-lg px-2.5 py-0.5 text-[10px] font-bold border border-[#243356] items-center gap-1.5 text-[#EEF2FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F9A] animate-pulse" />
              <span>TOEIC ETS 2026</span>
            </div>

            <div className="hidden md:flex gap-6 items-center">
              {/* Dropdown Luyện Đề */}
              <div className="relative group py-2 flex items-center h-full">
                <button className="text-xs font-bold text-[#94A0B8] hover:text-[#FFFFFF] flex items-center gap-1 cursor-pointer transition-colors duration-200 h-9">
                  <span>Luyện đề</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A0B8] group-hover:text-[#FFFFFF] transition-colors" />
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl shadow-xl p-2 w-52 mt-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/exam" className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-[#16213A] hover:bg-[#EEF2FF] hover:text-[#3349D8] rounded-lg transition duration-150">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#5C667A]" />
                      <span>Thi thử đầy đủ (200c)</span>
                    </span>
                    <span className="bg-[#C0392B] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90">HOT</span>
                  </Link>
                  <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#16213A] hover:bg-[#EEF2FF] hover:text-[#3349D8] rounded-lg transition duration-150">
                    <Zap className="w-5 h-5 text-[#5C667A]" />
                    <span>Mini-test hàng ngày (10c)</span>
                  </Link>
                </div>
              </div>

              {/* Sổ tay ôn tập ⭐ */}
              <Link href="/ngan-hang-cau-sai" className={getLinkClass("/ngan-hang-cau-sai")} data-testid="link-mistakes">
                <span className="flex items-center gap-1">
                  <span>Sổ tay ôn tập</span>
                  <span className="text-amber-400 text-xs">⭐</span>
                </span>
              </Link>

              {/* Tiến độ */}
              <Link href="/thong-ke" className={getLinkClass("/thong-ke")} data-testid="link-[#stats]">
                <span>Tiến độ</span>
              </Link>

              {/* Cẩm nang */}
              <Link href="/tin-tuc" className={getLinkClass("/tin-tuc")} data-testid="link-news">
                <span>Cẩm nang</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* User Profile / Skeleton / Login */}
            {isLoadingUser ? (
              <div className="w-9 h-9 rounded-full bg-[#1E294B] animate-pulse border border-[#243356] shrink-0" />
            ) : isGuest ? (
              <Link
                href="/login"
                className="text-xs font-bold bg-[#3349D8] hover:bg-[#2940C5] active:bg-[#1F32A5] text-[#FFFFFF] px-4 h-9 rounded-lg transition duration-200 flex items-center gap-1.5 shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.115-5.136 4.115-3.414 0-6.146-2.73-6.146-6.146 0-3.414 2.732-6.146 6.146-6.146 1.488 0 2.842.533 3.916 1.408l3.116-3.115C19.123 2.13 16.035 1.05 12.24 1.05 6.07 1.05 1.05 6.07 1.05 1.24s5.02 11.19 11.19 11.19c5.8 0 10.66-4.08 10.66-10.66 0-.665-.06-1.305-.165-1.925H12.24z" />
                </svg>
                <span>Đăng nhập</span>
              </Link>
            ) : (
              user && token && <UserProfileDropdown user={user} token={token} />
            )}

            {/* Hamburger Menu Icon (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
              className="flex md:hidden text-[#94A0B8] hover:text-[#FFFFFF] cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer using Shadcn Sheet with EnStudey Hex Tokens */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] p-6 bg-[#16213A] text-white border-[#243356] flex flex-col justify-between">
          <SheetHeader className="pb-4 border-b border-[#243356] shrink-0">
            <SheetTitle className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey" width={24} height={24} />
              Luyện thi TOEIC ETS 2026
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[70vh] py-4 pr-1 flex-grow">
            <Link href="/exam" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-[#1E294B] hover:bg-[#25345D] rounded-xl transition duration-150 border border-[#243356]">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#818CF8]" />
                <span>Luyện đề TOEIC (200c)</span>
              </span>
              <span className="text-[#94A0B8] text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/ngan-hang-cau-sai" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-[#1E294B] hover:bg-[#25345D] rounded-xl transition duration-150 border border-[#243356]">
              <span className="flex items-center gap-2">
                <Notebook className="w-5 h-5 text-[#818CF8]" />
                <span>Sổ tay ôn tập ⭐</span>
              </span>
              <span className="text-[#94A0B8] text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/thong-ke" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-[#1E294B] hover:bg-[#25345D] rounded-xl transition duration-150 border border-[#243356]">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#818CF8]" />
                <span>Tiến độ học tập</span>
              </span>
              <span className="text-[#94A0B8] text-xs font-light">&rarr;</span>
            </Link>
            <Link href="/tin-tuc" onClick={() => setIsDrawerOpen(false)} className="text-sm font-bold text-slate-200 hover:text-white flex items-center justify-between min-h-[48px] px-4 bg-[#1E294B] hover:bg-[#25345D] rounded-xl transition duration-150 border border-[#243356]">
              <span className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#818CF8]" />
                <span>Cẩm nang TOEIC</span>
              </span>
              <span className="text-[#94A0B8] text-xs font-light">&rarr;</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
