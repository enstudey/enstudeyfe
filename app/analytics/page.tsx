import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Báo cáo hiệu năng - EnStudey",
  description: "Phân tích và theo dõi sự tiến bộ trong học tập của bạn.",
};

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-6">Hiệu Năng Học Tập</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Xem các phân tích trực quan về tiến trình ôn luyện TOEIC / IELTS và các lỗ hổng kiến thức cần khắc phục.
      </p>

      {isGuest ? (
        <div className="relative border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 min-h-[350px] flex items-center justify-center overflow-hidden">
          {/* Blurred mock content to stimulate engagement */}
          <div className="absolute inset-0 filter blur-md opacity-25 dark:opacity-10 pointer-events-none select-none p-12 flex flex-col justify-between">
            <div className="w-full h-8 bg-slate-300 rounded" />
            <div className="flex gap-4">
              <div className="w-1/3 h-32 bg-slate-300 rounded-full" />
              <div className="w-2/3 h-32 bg-slate-300 rounded" />
            </div>
            <div className="w-full h-12 bg-slate-300 rounded" />
          </div>

          {/* CTA Box overlay */}
          <div className="relative z-10 bg-slate-900/90 border border-orange-500/20 text-white rounded-3xl p-8 max-w-md text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto">
              📊
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Xem biểu đồ kỹ năng cá nhân 🎯</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đăng nhập bằng tài khoản Google để theo dõi mức độ tiến bộ, biểu đồ điểm mạnh điểm yếu và lịch sử học tập chi tiết của riêng bạn nha.
              </p>
            </div>
            <div>
              <a
                href={googleLoginUrl}
                className="inline-flex items-center gap-2 font-bold text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Đăng nhập Google ngay! ⚡
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-slate-400 mb-8">
          <span className="text-4xl block mb-2">📊</span>
          <p className="text-sm font-medium">Đang tải biểu đồ mạng nhện kỹ năng và đóng góp học tập...</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/dashboard" className="text-sm text-orange-600 dark:text-orange-500 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
