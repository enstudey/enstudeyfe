import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Luyện nói với AI - EnStudey",
  description: "Trò chuyện phản xạ nhanh 5 phút cùng AI chatbot.",
};

export default function SpeakingPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Nói Du Kích cùng AI</h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Trò chuyện phản xạ trực tiếp qua giọng nói với AI. Hệ thống sử dụng Web Speech API miễn phí trên thiết bị của bạn.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md mx-auto shadow-sm">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          🎙️
        </div>
        <h2 className="text-xl font-bold mb-2">Bắt đầu hội thoại</h2>
        <p className="text-sm text-slate-500 mb-6">
          AI sẽ đưa ra chủ đề và bắt đầu hội thoại với bạn trong vòng 5 phút.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-xl shadow-md transition">
          Kết nối Micro & Bắt đầu
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
