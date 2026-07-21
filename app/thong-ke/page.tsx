import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Báo cáo hiệu năng - EnStudey",
  description: "Phân tích và theo dõi sự tiến bộ trong học tập TOEIC và IELTS của bạn.",
};

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl =
    process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL ||
    "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="w-full py-10 flex-grow">
      <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-slate-100">
        Hiệu Năng Học Tập
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
        Xem các phân tích trực quan về tiến trình ôn luyện TOEIC / IELTS và các lỗ hổng kiến thức cần khắc phục.
      </p>

      {isGuest ? (
        <div className="relative border border-slate-200 dark:border-slate-800 rounded-3xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
          {/* Blurred mock content to stimulate engagement */}
          <div className="absolute inset-0 filter blur-md opacity-25 pointer-events-none select-none p-12 flex flex-col justify-between">
            <div className="w-full h-8 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="flex gap-4">
              <div className="w-1/3 h-32 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="w-2/3 h-32 bg-slate-300 dark:bg-slate-700 rounded" />
            </div>
            <div className="w-full h-12 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>

          {/* CTA Box overlay */}
          <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 border border-blue-500/20 text-slate-900 dark:text-slate-100 rounded-3xl p-8 max-w-md text-center shadow-2xl space-y-6 backdrop-blur-md">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-500/20">
              📊
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Xem biểu đồ kỹ năng cá nhân 🎯</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Đăng nhập bằng tài khoản Google để theo dõi mức độ tiến bộ, biểu đồ điểm mạnh điểm yếu và lịch sử học tập chi tiết của riêng bạn.
              </p>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="font-bold text-xs bg-gradient-to-r from-blue-500 to-blue-655 text-white px-6 py-5 rounded-2xl shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <a href={googleLoginUrl}>Đăng nhập Google ngay! ⚡</a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <AnalyticsDashboard />
      )}

      <div className="text-center mt-10">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
