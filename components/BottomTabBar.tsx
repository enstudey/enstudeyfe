"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Notebook, User } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();

  const getTabClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    return `flex flex-col items-center gap-1.5 py-1.5 text-[10px] font-extrabold tracking-wide transition-colors ${
      isActive ? "text-blue-500" : "text-slate-400 hover:text-slate-600"
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/80 md:hidden flex justify-around items-center h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-2 rounded-t-2xl">
      <Link href="/" className={getTabClass("/")}>
        <Home className="w-[22px] h-[22px]" />
        <span>Trang chủ</span>
      </Link>
      <Link href="/luyen-de" className={getTabClass("/luyen-de")}>
        <BookOpen className="w-[22px] h-[22px]" />
        <span>Luyện đề</span>
      </Link>
      <Link href="/ngan-hang-cau-sai" className={getTabClass("/ngan-hang-cau-sai")}>
        <Notebook className="w-[22px] h-[22px]" />
        <span>Sổ tay câu sai</span>
      </Link>
      <Link href="/login" className={getTabClass("/login")}>
        <User className="w-[22px] h-[22px]" />
        <span>Tôi</span>
      </Link>
    </div>
  );
}
