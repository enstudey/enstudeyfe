import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Sổ tay câu sai - EnStudey",
  description: "Kho lưu trữ và ôn tập các câu trả lời sai của bạn.",
};

export default async function MistakeBankPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-6">Sổ tay câu sai (Mistake Bank)</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Hệ thống tự động lưu trữ các câu trả lời sai của bạn trong quá trình làm Quiz để giúp bạn ôn tập dễ dàng.
      </p>

      {isGuest ? (
        <div className="bg-gradient-to-br from-slate-900/50 via-zinc-900/50 to-black/50 border border-orange-500/10 backdrop-blur-md rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xl space-y-6">
          <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto animate-pulse">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-200">Gột rửa lỗi sai của riêng bạn 💎</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              Tính năng Mistake Bank tự động ghi nhận các lỗi sai, phân loại theo dạng ngữ pháp/từ vựng để giúp bạn vá lỗ hổng kiến thức. Đăng nhập để sử dụng tính năng này nha!
            </p>
          </div>
          <div className="pt-2">
            <a
              href={googleLoginUrl}
              className="inline-flex items-center gap-2 font-bold text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Đăng nhập bằng Google ngay! 🚀
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center text-slate-400">
          <span className="text-4xl block mb-2">🎉</span>
          <p className="text-sm font-medium">Tuyệt vời! Bạn không có câu sai nào cần ôn tập.</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-sm text-orange-600 dark:text-orange-500 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
