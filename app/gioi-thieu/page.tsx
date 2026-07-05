import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Giới thiệu về EnStudey - Nền tảng học tập & hướng nghiệp",
  description: "EnStudey cung cấp các công cụ hỗ trợ tính điểm xét tuyển tốt nghiệp THPT và cẩm nang tự học tiếng Anh hiệu quả.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Giới thiệu về EnStudey</h1>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed">
          <p>
            EnStudey là một dự án EdTech cá nhân phi lợi nhuận hướng tới mục tiêu bẻ gãy mọi áp lực phòng thi tốt nghiệp THPT và số hóa các công cụ tiện ích học tập cho học sinh Việt Nam.
          </p>
          <p>
            Ở Giai đoạn 1, EnStudey phát triển tinh gọn các công cụ chạy hoàn toàn tĩnh phía client như Tính điểm thi THPT, Gợi ý nguyện vọng Đại học và chuyên mục Tin tức học thuật. Chúng mình hy vọng dự án sẽ đồng hành hiệu quả cùng các sĩ tử trên con đường chinh phục ước mơ học tập.
          </p>

          <section className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Thông tin liên hệ dự án</h2>
            <p>
              Mọi thắc mắc, đóng góp ý kiến hoặc yêu cầu hợp tác liên quan đến nội dung học thuật trên hệ thống EnStudey, xin vui lòng liên hệ với ban quản trị dự án:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Người chịu trách nhiệm dự án:</strong> Nguyễn Văn Tâm</li>
              <li><strong>Email hỗ trợ chính thức:</strong> <a href="mailto:contact@enstudy.edu.vn" className="text-orange-600 dark:text-orange-500 hover:underline">contact@enstudy.edu.vn</a></li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
