import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

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
      <p className="text-slate-600 mb-8">
        Xem các phân tích trực quan về tiến trình ôn luyện TOEIC / IELTS và các lỗ hổng kiến thức cần khắc phục.
      </p>

      {isGuest ? (
        <div className="relative border border-slate-200 rounded-3xl p-8 min-h-[350px] flex items-center justify-center overflow-hidden bg-white shadow-sm">
          {/* Blurred mock content to stimulate engagement */}
          <div className="absolute inset-0 filter blur-md opacity-25 pointer-events-none select-none p-12 flex flex-col justify-between">
            <div className="w-full h-8 bg-slate-300 rounded" />
            <div className="flex gap-4">
              <div className="w-1/3 h-32 bg-slate-300 rounded-full" />
              <div className="w-2/3 h-32 bg-slate-300 rounded" />
            </div>
            <div className="w-full h-12 bg-slate-300 rounded" />
          </div>

          {/* CTA Box overlay */}
          <div className="relative z-10 bg-white border border-violet-500/20 text-slate-900 rounded-3xl p-8 max-w-md text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-violet-500/10">
              📊
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Xem biểu đồ kỹ năng cá nhân 🎯</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đăng nhập bằng tài khoản Google để theo dõi mức độ tiến bộ, biểu đồ điểm mạnh điểm yếu và lịch sử học tập chi tiết của riêng bạn nha.
              </p>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="font-bold text-xs bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-5 rounded-2xl shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <a href={googleLoginUrl}>
                  Đăng nhập Google ngay! ⚡
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-slate-400 mb-8">
          <span className="text-4xl block mb-2">📊</span>
          <p className="text-sm font-medium">Đang tải biểu đồ mạng nhện kỹ năng và đóng góp học tập...</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/dashboard" className="text-sm text-violet-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
