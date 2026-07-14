"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export default function Header() {
  const pathname = usePathname();
  const [isExamMode, setIsExamMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    // Tự động cuộn trang lên đầu khi chuyển route (tránh lệch CLS)
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkExamMode = () => {
        const params = new URLSearchParams(window.location.search);
        const stage = params.get("stage");
        const mode = params.get("mode");
        const isExam = pathname.startsWith("/quiz/exam") || stage === "quiz" || mode === "exam";
        setIsExamMode(isExam);
      };

      checkExamMode();
      
      // Lắng nghe sự kiện pushState/replaceState thủ công nếu cần
      window.addEventListener("popstate", checkExamMode);
      return () => window.removeEventListener("popstate", checkExamMode);
    }
  }, [pathname]);

  if (!isMounted) {
    return <div className="h-16" />; // Tránh giật màn hình khi SSR tải
  }

  // Ẩn hoàn toàn trong chế độ phòng thi áp lực cao
  if (isExamMode) {
    return null;
  }

  return (
    <>
      {/* Ẩn hiện responsive bằng Tailwind class để Next.js SSR tối ưu */}
      <div className="hidden md:block">
        <NavbarDesktop />
      </div>
      <div className="block md:hidden">
        <NavbarMobile />
      </div>
    </>
  );
}
