import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Dashboard - EnStudey",
  description: "Trang chủ học tập cá nhân hóa của bạn tại EnStudey.",
};

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Thành Đạt", streakCount: 42 },
  { rank: 2, name: "Khánh Linh", streakCount: 38 },
  { rank: 3, name: "Minh Tuấn", streakCount: 35 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-card-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EnStudey
          </Link>
          <div className="flex items-center gap-6">
            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-80">
              <Link href="/quiz" className="hover:text-blue-600">Luyện đề</Link>
              <Link href="/speaking" className="hover:text-blue-600">Luyện nói AI</Link>
              <Link href="/mistake-bank" className="hover:text-blue-600">Sổ tay câu sai</Link>
              <Link href="/analytics" className="hover:text-blue-600">Phân tích</Link>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            </nav>

            <ThemeToggle />

            {/* Streak Widget */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full" title="Chuỗi ngày học liên tiếp">
              <span className="text-orange-500 text-lg">🔥</span>
              <span className="font-bold text-orange-700 text-sm">5 ngày</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* Left & Middle Column (Main features) */}
        <div className="md:col-span-2 space-y-8">
          {/* Hero Widget: Daily Mini-Test */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="bg-blue-500/30 text-blue-100 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Hôm nay
              </span>
              <h2 className="text-3xl font-extrabold">Daily Mini-Test</h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Hoàn thành nhanh 10 câu hỏi rút gọn để duy trì chuỗi Streak và củng cố ngữ pháp, từ vựng hôm nay.
              </p>
              <div>
                <Link href="/quiz" className="inline-flex items-center justify-center bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-50 transition">
                  Bắt đầu ngay &rarr;
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-9xl select-none font-bold">
              10Q
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/speaking" className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left group">
              <span className="text-3xl">🎙️</span>
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-blue-600 transition">Luyện nói &ldquo;Du kích&rdquo; với AI</h3>
              <p className="opacity-70 text-sm leading-relaxed">
                Hội thoại 5 phút phản xạ nhanh cùng Chatbot AI kết hợp Web Speech API.
              </p>
            </Link>

            <Link href="/mistake-bank" className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left group">
              <span className="text-3xl">📘</span>
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-blue-600 transition">Sổ tay câu sai (Mistake Bank)</h3>
              <p className="opacity-70 text-sm leading-relaxed">
                Tự động lưu và phân tích chi tiết lỗi sai giúp bạn cải thiện lỗ hổng.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column (Side widgets) */}
        <div className="space-y-8">
          {/* Leaderboard Widget */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              <span>Bảng Xếp Hạng</span>
              <span className="text-xs font-semibold opacity-50">Streak tuần</span>
            </h3>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((user) => (
                <div key={user.rank} className="flex items-center justify-between py-2 border-b border-card-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? "bg-amber-100 text-amber-800" :
                      user.rank === 2 ? "bg-slate-100 text-slate-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {user.rank}
                    </span>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{user.streakCount} 🔥</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Analytics Summary */}
          <Link href="/analytics" className="block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left">
            <h3 className="text-lg font-bold mb-2">Hiệu năng học tập</h3>
            <p className="opacity-70 text-sm leading-relaxed mb-4">
              Xem chi tiết biểu đồ mạng nhện kỹ năng và lịch đóng góp học tập hàng ngày.
            </p>
            <span className="text-sm font-semibold text-blue-600 hover:underline">
              Xem phân tích &rarr;
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-75 text-sm">
          <span>&copy; 2026 EnStudey. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:underline">Giới thiệu</Link>
            <Link href="/privacy" className="hover:underline">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:underline">Điều khoản</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
