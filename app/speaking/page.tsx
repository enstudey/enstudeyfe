import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Luyện nói với AI - EnStudey",
  description: "Trò chuyện phản xạ nhanh 5 phút cùng AI chatbot.",
};

export default async function SpeakingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Nói Du Kích cùng AI</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Trò chuyện phản xạ trực tiếp qua giọng nói với AI. Hệ thống sử dụng Web Speech API miễn phí trên thiết bị của bạn.
      </p>

      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left max-w-md mx-auto text-sm font-medium">
          <span className="text-lg">⚠️</span>
          <div>
            Bạn đang luyện nói ở mode ẩn danh. Cuộc hội thoại và đánh giá phát âm từ AI sẽ không được lưu lại.{" "}
            <a href={googleLoginUrl} className="underline font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition">
              Đăng nhập ngay
            </a>{" "}
            để lưu trữ lịch sử học tập nhé!
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 max-w-md mx-auto shadow-sm">
        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          🎙️
        </div>
        <h2 className="text-xl font-bold mb-2">Bắt đầu hội thoại</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          AI sẽ đưa ra chủ đề và bắt đầu hội thoại với bạn trong vòng 5 phút.
        </p>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold w-full py-3 rounded-xl shadow-md transition duration-200">
          Kết nối Micro & Bắt đầu
        </button>
      </div>

      <div className="mt-8">
        <Link href="/dashboard" className="text-sm text-orange-600 dark:text-orange-500 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
