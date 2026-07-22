import type { Metadata } from "next";
import Link from "next/link";
import ErrorReportForm from "@/components/error-report-form";
import GoBackButton from "@/components/ui/go-back-button";
import {
  Home,
  BookOpen,
  Notebook,
  Map,
  Newspaper,
  Compass,
  FileQuestion,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | EnStudey",
  description:
    "Rất tiếc, đường dẫn bạn đang truy cập không tồn tại, đã bị di chuyển hoặc tạm thời không khả dụng trên hệ thống EnStudey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    {
      title: "Luyện đề thi",
      description: "Thực hành đề thi thử THPT QG & Tiếng Anh",
      href: "/luyen-de",
      icon: BookOpen,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Sổ tay câu sai",
      description: "Ôn tập và làm lại các câu hỏi đã chọn đáp án sai",
      href: "/ngan-hang-cau-sai",
      icon: Notebook,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "Lộ trình học tập",
      description: "Định hướng kế hoạch học tập theo mục tiêu điểm số",
      href: "/lo-trinh",
      icon: Map,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Tin tức học thuật",
      description: "Cập nhật tin tức tuyển sinh & cẩm nang học tập",
      href: "/tin-tuc",
      icon: Newspaper,
      color: "text-sky-500 bg-sky-50 dark:bg-sky-950/40",
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        
        {/* Badge 404 & Hero Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <FileQuestion className="w-4 h-4" />
            <span>404 • Không tìm thấy trang</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Không tìm thấy trang yêu cầu
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Rất tiếc, đường dẫn bạn đang truy cập không tồn tại, đã bị di chuyển hoặc tạm thời không khả dụng trên hệ thống EnStudey.
          </p>
        </div>

        {/* Nút hành động chính */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            id="btn-go-home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all btn-interactive"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>

          <GoBackButton />
        </div>

        {/* Khối gợi ý truy cập nhanh */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Compass className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Khám phá các phân hệ học tập khác
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Truy cập</span>
                    <span className="ml-1">&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Form báo cáo sự cố */}
        <div className="pt-4">
          <ErrorReportForm errorCode="404" errorMessage="Page not found" />
        </div>

      </div>
    </div>
  );
}
