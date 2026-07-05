import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "EnStudy - Nền tảng tra cứu học thuật & nguyện vọng Đại học",
  description: "Công cụ hỗ trợ ôn thi TOEIC/IELTS, tính điểm thi tốt nghiệp THPT và gợi ý nguyện vọng đại học an toàn, tối ưu.",
};

export default function LandingPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-12 w-full text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-zinc-900 border border-orange-200/50 dark:border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
            ✨ Kỷ nguyên EdTech cá nhân hóa
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-950 dark:text-white">
            Công cụ hỗ trợ ôn thi tốt nghiệp & <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Gợi ý nguyện vọng Đại học</span> thông minh
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tra cứu điểm chuẩn các năm của các trường đại học, tính điểm xét tuyển tổ hợp môn tự động và tối ưu hóa danh sách nguyện vọng tốt nghiệp của bạn.
          </p>
        </div>

        {/* Feature Cards / Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
          {/* Card 1: Blog */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="text-3xl">🚀</span>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Tin tức học thuật</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                Chia sẻ lộ trình học tập, cẩm nang ngữ pháp TOEIC/IELTS và cập nhật các phương thức tuyển sinh mới nhất từ Bộ Giáo dục.
              </p>
            </div>
            <Link
              href="/tin-tuc"
              className="w-full text-center py-2.5 bg-slate-900 dark:bg-zinc-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Xem tin tức &rarr;
            </Link>
          </div>

          {/* Card 2: Calculator */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="text-3xl">✨</span>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Tính điểm xét tuyển</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                Nhập điểm thi THPT quốc gia của bạn để tự động tính điểm theo các tổ hợp môn phổ biến A00, A01, B00, D01.
              </p>
            </div>
            <Link
              href="/tinh-diem-tot-nghiep"
              className="w-full text-center py-2.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-650 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Tính điểm ngay &rarr;
            </Link>
          </div>

          {/* Card 3: Finder */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-2">
              <span className="text-3xl">🔍</span>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Tra cứu trường Đại học</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                Đối sánh điểm thi của bạn với cơ sở dữ liệu điểm chuẩn năm ngoái để phân loại vùng nguyện vọng An toàn/Cọ xát/Rủi ro.
              </p>
            </div>
            <Link
              href="/tra-cuu-tuyen-sinh"
              className="w-full text-center py-2.5 bg-slate-900 dark:bg-zinc-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Tra cứu ngay &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
