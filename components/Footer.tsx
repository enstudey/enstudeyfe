"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FEATURE_FLAGS } from "@/lib/config/features";

// Các trang không hiển thị quảng cáo
const DISABLED_ADS_PATHS = [
  "/about",
  "/privacy-policy",
  "/terms-of-service",
  "/tram-sac-nang-luong"
];

export default function Footer() {
  const pathname = usePathname();
  const [isExamMode, setIsExamMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      window.addEventListener("popstate", checkExamMode);
      return () => window.removeEventListener("popstate", checkExamMode);
    }
  }, [pathname]);

  if (!isMounted) {
    return <div className="min-h-[200px]" />;
  }

  // Ẩn hoàn toàn trong chế độ phòng thi áp lực cao
  if (isExamMode) {
    return null;
  }

  // Kiểm tra điều kiện hiển thị quảng cáo
  const isAdsEnabled =
    FEATURE_FLAGS?.ENABLE_ADSENSE &&
    !DISABLED_ADS_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));

  return (
    <footer className="bg-white border-t border-slate-200 mt-20" data-testid="footer-container">
      {/* 1. Khối bọc quảng cáo chống giật khung hình (CLS = 0) */}
      {isAdsEnabled && (
        <div className="max-w-7xl mx-auto px-6 pt-8 w-full">
          <div className="min-h-[250px] mx-auto w-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200/60 flex flex-col items-center justify-center relative transition duration-200">
            <span className="absolute top-2 left-3 text-[9px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
              Quảng cáo
            </span>
            {/* Placeholder hoặc thẻ AdSense thực tế */}
            <div className="text-center p-4">
              <p className="text-xs font-semibold text-slate-400">Không gian quảng cáo AdSense tài trợ</p>
              <p className="text-[10px] text-slate-350 mt-1">Cố định chiều cao ngăn CLS</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* 2. Giao diện Desktop (Ẩn trên mobile, hiện từ md) */}
        <div className="hidden md:grid grid-cols-4 gap-8 items-start justify-between">
          {/* Cột 1: Định danh chủ sở hữu pháp lý */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
              <span className="text-xl font-bold text-slate-950">EnStudey</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Nền tảng hỗ trợ học tập cá nhân hóa.</p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Chịu trách nhiệm nội dung:</p>
              <p>Nguyễn Đức Tâm</p>
              <p className="font-semibold text-slate-700">Địa chỉ nhận mã PIN:</p>
              <p>Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p className="font-semibold text-slate-700">Email liên hệ sạch:</p>
              <p className="text-violet-650 hover:underline">contact@enstudey.com</p>
            </div>
          </div>

          {/* Cột 2: Hệ sinh thái tiện ích SEO */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Khám phá & Công cụ</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500">
              <Link href="/tinh-diem-tot-nghiep" className="hover:text-slate-950 transition font-medium">
                Tính điểm tốt nghiệp THPT
              </Link>
              <Link href="/tra-cuu-tuyen-sinh" className="hover:text-slate-950 transition font-medium">
                Tra cứu trường Đại học
              </Link>
              <Link href="/nganh-hoc" className="hover:text-slate-950 transition font-medium">
                Lọc ngành học phổ biến
              </Link>
              <Link href="/flashcards" className="hover:text-slate-950 transition font-medium">
                Flashcard ôn tập
              </Link>
            </div>
          </div>

          {/* Cột 3: Liên kết pháp lý và AdSense */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Pháp lý & Tài trợ</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500">
              <Link href="/about" className="hover:text-slate-950 transition font-medium">
                Giới thiệu dự án
              </Link>
              <Link href="/tram-sac-nang-luong" className="hover:text-slate-950 transition font-medium">
                Trạm sạc năng lượng 🥤
              </Link>
              <Link href="/terms-of-service" className="hover:text-slate-950 transition font-medium">
                Điều khoản dịch vụ
              </Link>
              <Link href="/privacy-policy" className="hover:text-slate-950 transition font-medium">
                Chính sách bảo mật
              </Link>
            </div>
          </div>

          {/* Cột 4: Badge Uy tín & Version */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Độ tin cậy hệ thống</h2>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-[10px] font-bold text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hệ thống bảo mật SSL</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                EnStudey cam kết bảo vệ dữ liệu cá nhân của học sinh theo Nghị định 13/2023/NĐ-CP.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Giao diện Mobile (Ẩn trên desktop, hiện trên di động) */}
        <div className="block md:hidden space-y-6">
          {/* Accordion thông tin EnStudey */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full px-4 py-3 flex items-center justify-between font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              data-testid="footer-accordion-btn"
            >
              <span>THÔNG TIN PHÁP LÝ & LIÊN HỆ</span>
              {isAccordionOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            
            {isAccordionOpen && (
              <div className="px-4 pb-4 space-y-3 text-xs text-slate-500 border-t border-slate-100 pt-3 animate-in slide-in-from-top-1 duration-150" data-testid="footer-accordion-content">
                <p className="font-bold text-slate-700">EnStudey — Nền tảng học tập cá nhân hóa.</p>
                <p><span className="font-semibold">Đại diện pháp lý:</span> Nguyễn Đức Tâm</p>
                <p><span className="font-semibold">Địa chỉ nhận PIN:</span> Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
                <p><span className="font-semibold">Email hỗ trợ:</span> contact@enstudey.com</p>
              </div>
            )}
          </div>

          {/* Hộp liên kết phẳng tối giản */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <Link href="/terms-of-service" className="hover:text-slate-900">Điều khoản</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-slate-900">Bảo mật</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-900">Giới thiệu</Link>
          </div>
        </div>

        {/* 4. Bản quyền & Version đáy */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            © 2026 EnStudey. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200/60 text-[9px] font-bold text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Version v1.2 - Module Quiz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
