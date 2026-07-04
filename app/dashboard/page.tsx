import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
}

interface UserStreakDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: UserDto | null = null;
  let streak: UserStreakDto = { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  let fetchFailed = false;

  try {
    const [userRes, streakRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me/streak`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }
      })
    ]);

    if (!userRes.ok) {
      fetchFailed = true;
    } else {
      const userData = await userRes.json();
      user = userData.data as UserDto;
    }

    if (streakRes.ok) {
      const streakData = await streakRes.json();
      streak = streakData.data as UserStreakDto;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    fetchFailed = true;
  }

  if (fetchFailed) {
    redirect("/login");
  }


  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-card-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500">
            EnStudey
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-80">
              <Link href="/quiz" className="hover:text-orange-600 dark:hover:text-orange-500 transition">Luyện đề</Link>
              <Link href="/speaking" className="hover:text-orange-600 dark:hover:text-orange-500 transition">Luyện nói AI</Link>
              <Link href="/mistake-bank" className="hover:text-orange-600 dark:hover:text-orange-500 transition">Sổ tay câu sai</Link>
              <Link href="/analytics" className="hover:text-orange-600 dark:hover:text-orange-500 transition">Phân tích</Link>
              <Link href="/blog" className="hover:text-orange-600 dark:hover:text-orange-500 transition">Blog</Link>
            </nav>

            <ThemeToggle />

            {/* Streak Widget */}
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 px-3 py-1.5 rounded-full" title="Chuỗi ngày học liên tiếp">
              <span className="text-orange-500 text-lg">🔥</span>
              <span className="font-bold text-orange-700 dark:text-orange-400 text-sm">
                {streak.currentStreak} ngày nè
              </span>
            </div>

            {/* User Avatar */}
            {user && user.avatarUrl && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-card-border">
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Hero Widget: Daily Mini-Test */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-lg">
              <span className="bg-orange-400/30 text-orange-100 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Hôm nay nè bạn ơi! 🔥
              </span>
              <h2 className="text-3xl font-extrabold">
                Chào {user ? user.fullName : "bạn"} nha! Hôm nay chúng mình làm tí Mini-test nhỉ? 🔥
              </h2>
              <p className="text-orange-100/90 text-sm leading-relaxed">
                Hoàn thành nhanh 10 câu hỏi rút gọn để giữ lửa Streak đỉnh chóp và củng cố ngữ pháp, từ vựng hôm nay nha.
              </p>
              <div>
                <Link href="/quiz" className="inline-flex items-center justify-center bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-orange-50 transition transform hover:-translate-y-0.5">
                  Chiến luôn đề này nha! 🎯
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
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition">Luyện nói &ldquo;Du kích&rdquo; với AI nha</h3>
              <p className="opacity-70 text-sm leading-relaxed">
                Chúng mình đang lắng nghe bạn nói nè, cứ tự nhiên phản xạ không độ trễ nha.
              </p>
            </Link>

            <Link href="/mistake-bank" className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left group">
              <span className="text-3xl">💎</span>
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition">Sổ tay "gột rửa" câu sai 💎</h3>
              <p className="opacity-70 text-sm leading-relaxed">
                Kho báu tự động lưu và phân loại chi tiết lỗi sai giúp bạn sửa đổi lỗ hổng kiến thức.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              <span>Bảng Xếp Hạng</span>
              <span className="text-xs font-semibold opacity-50">Streak tuần</span>
            </h3>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((u) => (
                <div key={u.rank} className="flex items-center justify-between py-2 border-b border-card-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      u.rank === 1 ? "bg-amber-100 text-amber-800" :
                      u.rank === 2 ? "bg-slate-100 text-slate-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {u.rank}
                    </span>
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{u.streakCount} 🔥</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/analytics" className="block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left">
            <h3 className="text-lg font-bold mb-2">Hiệu năng học tập</h3>
            <p className="opacity-70 text-sm leading-relaxed mb-4">
              Xem chi tiết biểu đồ kỹ năng và lịch đóng góp học tập hàng ngày của bạn nè.
            </p>
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-500 hover:underline">
              Xem phân tích ngay &rarr;
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
