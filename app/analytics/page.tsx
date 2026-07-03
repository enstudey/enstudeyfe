import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Báo cáo hiệu năng - EnStudey",
  description: "Phân tích và theo dõi sự tiến bộ trong học tập của bạn.",
};

export default function AnalyticsPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-6">Hiệu Năng Học Tập</h1>
      <p className="text-slate-600 mb-8">
        Xem các phân tích trực quan về tiến trình ôn luyện TOEIC / IELTS và các lỗ hổng kiến thức cần khắc phục.
      </p>

      {/* Placeholder analytics chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 mb-8">
        <span className="text-4xl block mb-2">📊</span>
        <p className="text-sm font-medium">Đang tải biểu đồ mạng nhện kỹ năng và đóng góp đóng góp...</p>
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
