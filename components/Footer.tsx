import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 min-h-[200px]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
          {/* Cột 1: Giới thiệu thực thể dự án */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
              <span className="text-xl font-bold text-slate-950">EnStudey</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Nền tảng hỗ trợ học tập cá nhân hóa.</p>
            <div className="space-y-1.5 text-xs text-slate-650">
              <p>Chịu trách nhiệm nội dung: Nguyễn Đức Tâm</p>
              <p>Địa chỉ: Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p>Email hỗ trợ: contact@enstudey.com</p>
            </div>
          </div>

          {/* Cột 2: Khám phá & Công cụ (SEO & Traffic Navigator) */}
          <div className="space-y-3 md:pl-8">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Khám phá & Công cụ</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600">
              <Link href="/tin-tuc" className="hover:text-slate-950 transition font-medium">
                Tin tức học thuật
              </Link>
              <Link href="/flashcards" className="hover:text-slate-950 transition font-medium">
                Flashcard ôn tập
              </Link>
              <Link href="/tinh-diem-tot-nghiep" className="hover:text-slate-950 transition font-medium">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-tuyen-sinh" className="hover:text-slate-950 transition font-medium">
                Tra cứu trường Đại học
              </Link>
            </div>
          </div>

          {/* Cột 3: Pháp lý & Liên hệ */}
          <div className="space-y-3 md:text-right">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Pháp lý & Liên hệ</h2>
            <div className="flex flex-col md:items-end gap-2.5 text-xs text-slate-600">
              <Link href="/about" className="hover:text-slate-950 transition font-medium">
                Giới thiệu
              </Link>
              <Link href="/tram-sac-nang-luong" className="hover:text-slate-950 transition font-medium">
                Trạm sạc năng lượng
              </Link>
              <Link href="/terms-of-service" className="hover:text-slate-950 transition font-medium">
                Điều khoản dịch vụ
              </Link>
              <Link href="/privacy-policy" className="hover:text-slate-950 transition font-medium">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>

        {/* Đường vạch ngang ngăn cách phần đáy */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
            © 2026 EnStudey. All rights reserved.
          </p>
          
          {/* Badge Version trực quan */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200/60 text-[9px] font-bold text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Version v1.2.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
