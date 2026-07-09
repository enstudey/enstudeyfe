import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Newspaper, Calculator, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "EnStudey - Nền tảng tra cứu học thuật & Hỗ trợ tuyển sinh Đại học",
  description: "Cẩm nang học tiếng Anh TOEIC/IELTS, công cụ tự động tính điểm thi tốt nghiệp và phân tích cơ hội trúng tuyển Đại học chuẩn xác.",
};

export default function LandingPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-16 w-full text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-zinc-900 border border-orange-200/50 dark:border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Đồng hành cùng học sinh THPT tuyển sinh Đại học</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-950 dark:text-white">
            Nền tảng ôn tập Tiếng Anh & <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Hỗ trợ tra cứu nguyện vọng</span> chuẩn xác
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hệ thống hỗ trợ tự học hiệu quả. Tính toán điểm xét tuyển tự động, đối sánh điểm chuẩn các năm để tối ưu hóa danh sách đăng ký nguyện vọng.
          </p>
          <div className="pt-4">
            <Link
              href="/tinh-diem-tot-nghiep"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-655 text-white font-bold rounded-2xl shadow-md transition duration-200 hover:scale-[1.02]"
            >
              Tính điểm xét tuyển ngay
            </Link>
          </div>
        </div>

        {/* 3 Pillars Section */}
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white">
            Công cụ hỗ trợ học tập & tuyển sinh cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            {/* Card 1: Blog */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Newspaper className="w-8 h-8 text-orange-600 dark:text-orange-500 shrink-0" />
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Cẩm nang học tiếng Anh</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Lộ trình ôn tập TOEIC, IELTS chất lượng và các mẹo làm bài hữu ích từ đội ngũ chuyên gia biên soạn chi tiết.
                </p>
              </div>
              <Link
                href="/tin-tuc"
                className="w-full text-center py-2.5 bg-slate-900 dark:bg-zinc-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Đọc cẩm nang &rarr;
              </Link>
            </div>

            {/* Card 2: Calculator */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Calculator className="w-8 h-8 text-orange-600 dark:text-orange-500 shrink-0" />
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Tính điểm tốt nghiệp</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Nhập điểm số thi THPT quốc gia của bạn để quy đổi điểm xét tuyển Đại học nhanh chóng theo các khối ngành và tổ hợp môn.
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
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-orange-500/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Search className="w-8 h-8 text-orange-600 dark:text-orange-500 shrink-0" />
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Tra cứu trường Đại học</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Đối sánh điểm thi của bạn với phổ điểm chuẩn và cơ sở dữ liệu các năm để xếp loại vùng nguyện vọng tối ưu, an toàn.
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
