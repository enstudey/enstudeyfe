"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  isStatic?: boolean;
}

export default function Header({ isStatic = false }: HeaderProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 15; // Ngưỡng cuộn lên tối thiểu (px) để tránh giật lag

  useEffect(() => {
    if (isStatic) return;

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
  }, [isStatic]);

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    const baseClass = "text-xs font-bold uppercase tracking-wider transition-colors ";
    if (isActive) {
      return baseClass + "text-slate-950 dark:text-white border-b-2 border-orange-500 pb-1";
    }
    return baseClass + "text-slate-500 hover:text-slate-950 dark:hover:text-white pb-1 border-b-2 border-transparent";
  };

  let headerClass = "left-0 right-0 w-full transition-all duration-300 ";
  
  if (isStatic) {
    headerClass += "relative bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 h-16";
  } else {
    headerClass += "fixed top-0 z-50 ";
    
    if (isVisible) {
      headerClass += "translate-y-0 ";
    } else {
      headerClass += "-translate-y-full ";
    }

    if (isSticky) {
      headerClass += "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 h-14 shadow-sm";
    } else {
      headerClass += "bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 h-16";
    }
  }

  return (
    <>
      {/* Placeholder để tránh Layout Shift khi Header ở trạng thái fixed */}
      {!isStatic && <div className="h-16 shrink-0" />}
      <header className={headerClass} data-testid="header-container">
        <nav className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-2xl text-slate-950 dark:text-white tracking-tight" data-testid="link-logo">
              EnStudy
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/tin-tuc" className={getLinkClass("/tin-tuc")} data-testid="link-news">
                Tin tức học thuật
              </Link>
              <Link href="/tinh-diem" className={getLinkClass("/tinh-diem")} data-testid="link-calc">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-truong-dai-hoc" className={getLinkClass("/tra-cuu-truong-dai-hoc")} data-testid="link-univ">
                Tra cứu trường đại học
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
