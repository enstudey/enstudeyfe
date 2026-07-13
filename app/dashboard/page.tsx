import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import Footer from "@/components/Footer";
import DailyQuizWidget from "@/components/quiz/DailyQuizWidget";

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

  let user: UserDto | null = null;
  let streak: UserStreakDto = { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  let isGuest = !token;

  if (token) {
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

      if (userRes.ok) {
        const userData = await userRes.json();
        user = userData.data as UserDto;
      } else if (userRes.status === 401) {
        // Token expired or invalid
        isGuest = true;
      }

      if (streakRes.ok) {
        const streakData = await streakRes.json();
        streak = streakData.data as UserStreakDto;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data, fallback to guest mode", error);
      isGuest = true;
    }
  }

  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <div className="min-h-screen bg-[#FAFAFA] bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.04),transparent_65%)] text-foreground font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-card-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-violet-600">
            <Image src="/icon-transparent.png" alt="EnStudey Logo" width={28} height={28} className="w-7 h-7" />
            <span>EnStudey</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-80">
              <Link href="/quiz" className="hover:text-violet-600 transition">Luyện đề</Link>
              <Link href="/speaking" className="hover:text-violet-600 transition">Luyện nói AI</Link>
              <Link href="/mistake-bank" className="hover:text-violet-600 transition">Sổ tay câu sai</Link>
              <Link href="/analytics" className="hover:text-violet-600 transition">Phân tích</Link>
              <Link href="/blog" className="hover:text-violet-600 transition">Blog</Link>
            </nav>

            {/* Streak Widget */}
            <div
              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full transition ${
                isGuest
                  ? "bg-slate-100 border-slate-200 opacity-60 cursor-help"
                  : "bg-violet-50 border-violet-200"
              }`}
              title={isGuest ? "Đăng nhập bằng Google để rèn luyện tích luỹ streak mỗi ngày nha!" : "Chuỗi ngày học liên tiếp"}
            >
              <span className={isGuest ? "grayscale text-lg" : "text-lg"}>🔥</span>
              <span className={`font-bold text-sm ${
                isGuest
                  ? "text-slate-500"
                  : "text-violet-600"
              }`}>
                {isGuest ? "0 ngày" : `${streak.currentStreak} ngày nè`}
              </span>
            </div>

            {/* User Profile / Login */}
            {isGuest ? (
              <a
                href={googleLoginUrl}
                className="text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.014c1.49 0 2.859.549 3.92 1.455l3.224-3.224C19.146 2.88 16.792 2 13.99 2 8.155 2 3.5 6.655 3.5 12.5S8.155 23 13.99 23c5.3 0 9.878-3.727 9.878-10.5 0-.74-.066-1.455-.18-2.215H12.24Z" />
                </svg>
                Đăng nhập
              </a>
            ) : (
              user && user.avatarUrl && (
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-card-border">
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Guest CTA Banner */}
          {isGuest && (
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
              <div className="relative z-10 space-y-4 max-w-xl">
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Trải nghiệm không giới hạn 🚀
                </span>
                <h2 className="text-2xl font-extrabold leading-tight">
                  Chào bạn mới nha! Cùng bẻ gãy TOEIC & IELTS nào
                </h2>
                <p className="text-violet-50/90 text-sm leading-relaxed">
                  Bạn đang sử dụng hệ thống ở chế độ Khách. Đăng nhập bằng Google chỉ 3s để sở hữu toàn bộ đặc quyền sau:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <span className="text-violet-200">⚡</span> Lưu tiến độ học tập
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-200">🔥</span> Tích luỹ Streak rèn luyện
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-200">🏆</span> Leo top Bảng Xếp Hạng
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-violet-200">💎</span> Tự động lưu Sổ tay câu sai
                  </li>
                </ul>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={googleLoginUrl}
                    className="w-full sm:w-auto text-center font-bold text-sm bg-white text-violet-600 hover:bg-violet-50 px-6 py-3 rounded-2xl shadow-md transition duration-200"
                  >
                    Đăng nhập Google ngay! 🚀
                  </a>
                  <span className="text-xs text-violet-100 font-medium hidden sm:inline">
                    ⚡ Đồng bộ tức thì, học miễn phí
                  </span>
                </div>
              </div>
              <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none text-8xl select-none font-bold hidden lg:block">
                GUEST
              </div>
            </div>
          )}

          {/* Hero Widget: Daily Mini-Test */}
          <DailyQuizWidget userFullName={user?.fullName} />

          {/* Quick Access Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/speaking" className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left group">
              <span className="text-3xl">🎙️</span>
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-violet-600 transition">Luyện nói &ldquo;Du kích&rdquo; với AI nha</h3>
              <p className="opacity-70 text-sm leading-relaxed">
                Chúng mình đang lắng nghe bạn nói nè, cứ tự nhiên phản xạ không độ trễ nha.
              </p>
            </Link>

            <Link href="/mistake-bank" className="bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left group">
              <span className="text-3xl">💎</span>
              <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-violet-600 transition">Sổ tay &ldquo;gột rửa&rdquo; câu sai 💎</h3>
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
                      "bg-violet-100 text-violet-850"
                    }`}>
                      {u.rank}
                    </span>
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                  <span className="text-sm font-bold text-violet-600">{u.streakCount} 🔥</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/analytics" className="block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left">
            <h3 className="text-lg font-bold mb-2">Hiệu năng học tập</h3>
            <p className="opacity-70 text-sm leading-relaxed mb-4">
              Xem chi tiết biểu đồ kỹ năng và lịch đóng góp học tập hàng ngày của bạn nè.
            </p>
            <span className="text-sm font-semibold text-violet-600 hover:underline">
              Xem phân tích ngay &rarr;
            </span>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
