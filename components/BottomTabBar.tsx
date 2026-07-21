"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Award, BookOpen, User } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();
  
  const getTabClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    return `flex flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors ${
      isActive ? "text-sky-500" : "text-slate-400 hover:text-slate-600"
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 md:hidden flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-2">
      <Link href="/" className={getTabClass("/")}>
        <Home className="w-5 h-5" />
        <span>Trang chủ</span>
      </Link>
      <Link href="/exam" className={getTabClass("/exam")}>
        <Award className="w-5 h-5" />
        <span>Thi thử</span>
      </Link>
      <Link href="/ngan-hang-cau-sai" className={getTabClass("/ngan-hang-cau-sai")}>
        <BookOpen className="w-5 h-5" />
        <span>Sổ câu sai</span>
      </Link>
      <Link href="/" className={getTabClass("/profile")}>
        <User className="w-5 h-5" />
        <span>Tôi</span>
      </Link>
    </div>
  );
}
