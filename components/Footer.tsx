import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 mt-20 min-h-[250px] hidden md:block">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start justify-between">
          {/* Cột 1: Định danh chủ quản */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
              <span className="text-xl font-bold text-white">enStudey</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Giúp học viên chinh phục điểm số TOEIC/IELTS & THPT QG với AI.
            </p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>Chịu trách nhiệm nội dung: Nguyễn Đức Tâm</p>
              <p>Địa chỉ: Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p>Email hỗ trợ: contact@enstudey.com</p>
            </div>
          </div>

          {/* Cột 2: Luyện đề (Quick Menu) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase">Luyện đề</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/exam" className="hover:text-white transition font-medium">
                Thi thử đầy đủ (Full-Test)
              </Link>
              <Link href="/" className="hover:text-white transition font-medium">
                Mini-test hàng ngày
              </Link>
              <Link href="/luyen-noi" className="hover:text-white transition font-medium">
                Luyện nói AI
              </Link>
              <Link href="/the-ghi-nho" className="hover:text-white transition font-medium">
                Flashcard từ vựng
              </Link>
            </div>
          </div>

          {/* Cột 3: Khám phá & Công cụ */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase">Khám phá & Công cụ</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/ngan-hang-cau-sai" className="hover:text-white transition font-medium">
                Sổ tay câu sai
              </Link>
              <Link href="/thong-ke" className="hover:text-white transition font-medium">
                Phân tích học tập
              </Link>
              <Link href="/lo-trinh" className="hover:text-white transition font-medium">
                Lộ trình học tập
              </Link>
            </div>
          </div>

          {/* Cột 4: An toàn pháp lý */}
          <div className="space-y-3 md:text-right">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase md:text-right">Về EnStudey</h2>
            <div className="flex flex-col md:items-end gap-2.5 text-xs text-slate-400">
              <Link href="/about" className="hover:text-white transition font-medium">
                Giới thiệu
              </Link>
              <Link href="/tram-sac-nang-luong" className="hover:text-white transition font-medium">
                Trạm sạc
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition font-medium">
                Chính sách bảo mật
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition font-medium">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>

        {/* Đường vạch ngang ngăn cách phần đáy */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider">
            © 2026 EnStudey. All rights reserved.
          </p>

          {/* Badge Version trực quan */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Version 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
