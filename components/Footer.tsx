import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 mt-20 min-h-[250px] hidden md:block">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start justify-between">
          {/* Cột 1: Định danh chủ quản & Thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
              <span className="text-xl font-bold text-white">EnStudey</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Nền tảng luyện TOEIC chuẩn ETS được cá nhân hóa bằng AI.
            </p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>Chịu trách nhiệm nội dung: Nguyễn Đức Tâm</p>
              <p>Địa chỉ: Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p>Email hỗ trợ: contact@enstudey.com</p>
            </div>
          </div>

          {/* Cột 2: Luyện đề TOEIC */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">Luyện đề TOEIC</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/exam" className="hover:text-white transition font-medium">
                Thi thử đầy đủ (200 câu Part 1-7)
              </Link>
              <Link href="/" className="hover:text-white transition font-medium">
                Daily Mini-Test (10 câu)
              </Link>
              <Link href="/ngan-hang-cau-sai" className="hover:text-white transition font-medium">
                Sổ tay ôn tập (SuperMemo-2)
              </Link>
              <Link href="/roadmap" className="hover:text-white transition font-medium">
                Lộ trình học cá nhân
              </Link>
            </div>
          </div>

          {/* Cột 3: Khám phá & Cẩm nang */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">Khám phá & Cẩm nang</h2>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/thong-ke" className="hover:text-white transition font-medium">
                Phân tích điểm & Tiến độ
              </Link>
              <Link href="/tin-tuc" className="hover:text-white transition font-medium">
                Cẩm nang ôn thi TOEIC
              </Link>
              <Link href="/about" className="hover:text-white transition font-medium">
                Khám phá gói Premium
              </Link>
            </div>
          </div>

          {/* Cột 4: Cộng đồng & Pháp lý */}
          <div className="space-y-3 md:text-right">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase md:text-right">Cộng đồng & Thông tin</h2>
            <div className="flex flex-col md:items-end gap-2.5 text-xs text-slate-400">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition font-medium">
                Cộng đồng Facebook
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition font-medium">
                Kênh Youtube Bài giảng
              </a>
              <Link href="/about" className="hover:text-white transition font-medium">
                Giới thiệu EnStudey
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

          {/* Badge Version trực quan SaaS */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Version 2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
