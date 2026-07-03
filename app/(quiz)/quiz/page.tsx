import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Luyện đề - EnStudey",
  description: "Trang luyện đề TOEIC / IELTS với bộ câu hỏi chọn lọc.",
};

export default function QuizPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Đề Luyện Thi</h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Bắt đầu làm các bài Mini-Test 10 câu hoặc các bài thi Full-test chuẩn cấu trúc đề thi thực tế.
      </p>
      
      <div className="inline-block bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Mini-Test #01 (Ngữ pháp & Từ vựng)</h2>
        <div className="text-sm text-slate-500 mb-6 space-y-1">
          <p>Số câu hỏi: 10 câu</p>
          <p>Thời gian: Không giới hạn</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition">
          Bắt đầu làm bài
        </button>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
