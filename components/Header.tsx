"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface HeaderProps {
  isStatic?: boolean;
}

export default function Header({ isStatic = false }: HeaderProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 15; // Ngưỡng cuộn lên tối thiểu (px) để tránh giật lag
  const prevPathname = useRef(pathname);

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
      return baseClass + "text-slate-950 border-b-2 border-violet-600 pb-1";
    }
    return baseClass + "text-slate-500 hover:text-slate-950 pb-1 border-b-2 border-transparent";
  };

  let headerClass = "left-0 right-0 w-full transition-all duration-300 ";
  
  if (isStatic) {
    headerClass += "relative bg-white border-b border-slate-100 h-16";
  } else {
    headerClass += "fixed top-0 z-50 ";
    
    if (isVisible) {
      headerClass += "translate-y-0 ";
    } else {
      headerClass += "-translate-y-full ";
    }

    if (isSticky) {
      headerClass += "bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 shadow-sm";
    } else {
      headerClass += "bg-white border-b border-slate-100 h-16";
    }
  }

  return (
    <>
      {/* Placeholder để tránh Layout Shift khi Header ở trạng thái fixed */}
      {!isStatic && <div className="h-16 shrink-0" />}
      <header className={headerClass} data-testid="header-container">
        <nav className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-slate-950 tracking-tight" data-testid="link-logo">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={32} height={32} className="w-8 h-8" />
              <span>EnStudey</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/tin-tuc" className={getLinkClass("/tin-tuc")} data-testid="link-news">
                Tin tức học thuật
              </Link>
              <Link href="/tinh-diem-tot-nghiep" className={getLinkClass("/tinh-diem-tot-nghiep")} data-testid="link-calc">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-tuyen-sinh" className={getLinkClass("/tra-cuu-tuyen-sinh")} data-testid="link-univ">
                Tra cứu trường đại học
              </Link>
              <Link href="/tram-sac-nang-luong" className={getLinkClass("/tram-sac-nang-luong")} data-testid="link-donors">
                Trạm sạc 🥤
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* ThemeToggle has been removed */}
          </div>
        </nav>
      </header>
    </>
  );
}
