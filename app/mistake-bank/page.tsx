import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sổ tay câu sai - EnStudey",
  description: "Kho lưu trữ và ôn tập các câu trả lời sai của bạn.",
};

export default function MistakeBankPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-6">Sổ tay câu sai (Mistake Bank)</h1>
      <p className="text-slate-600 mb-8">
        Hệ thống tự động lưu trữ các câu trả lời sai của bạn trong quá trình làm Quiz để giúp bạn ôn tập dễ dàng.
      </p>

      {/* Placeholder list */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
        <span className="text-4xl block mb-2">🎉</span>
        <p className="text-sm font-medium">Tuyệt vời! Bạn không có câu sai nào cần ôn tập.</p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
