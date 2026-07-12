import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 min-h-[200px]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/icon-transparent.png" alt="EnStudey Logo" width={24} height={24} className="w-6 h-6" />
              <span className="text-xl font-bold text-slate-950">EnStudey</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Nền tảng hỗ trợ học tập cá nhân hóa.</p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>Chịu trách nhiệm nội dung: Nguyễn Đức Tâm</p>
              <p>Địa chỉ: Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p>Email hỗ trợ: contact@enstudey.com</p>
            </div>
          </div>
          <div className="space-y-3 md:text-right">
            <h2 className="text-xs font-bold text-slate-900 tracking-widest uppercase">Thông tin pháp lý</h2>
            <div className="flex flex-col md:items-end gap-2 text-xs text-slate-500">
              <Link href="/gioi-thieu" className="hover:text-slate-950 transition">
                Giới thiệu
              </Link>
              <Link href="/flashcards" className="hover:text-slate-950 transition">
                Flashcard ôn tập
              </Link>
              <Link href="/terms-of-service" className="hover:text-slate-950 transition">
                Điều khoản dịch vụ
              </Link>
              <Link href="/privacy-policy" className="hover:text-slate-950 transition">
                Chính sách bảo mật
              </Link>
              <Link href="/tram-sac-nang-luong" className="hover:text-slate-950 transition">
                Trạm sạc năng lượng
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
            © 2026 EnStudey. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
