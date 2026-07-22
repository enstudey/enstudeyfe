import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import DailyQuizWidget from "@/components/quiz/DailyQuizWidget";
import ExamLibraryShelf from "@/components/exam/ExamLibraryShelf";
import StarterPackWidget from "@/components/affiliate/StarterPackWidget";
import { getStreakLeaderboard, LeaderboardResponse } from "@/lib/api/streak";

export const metadata: Metadata = {
  title: "EnStudey - Nền tảng học tập cá nhân hóa",
  description: "Trang chủ học tập cá nhân hóa của bạn tại EnStudey.",
};

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  isAnonymous: boolean;
  avatarColor: string | null;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: UserDto | null = null;
  let leaderboardData: LeaderboardResponse = { topUsers: [], currentUserRank: null };
  let isGuest = !token;

  if (token) {
    try {
      const [userRes, leaderboardRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 0 }
        }),
        getStreakLeaderboard(token, 20).catch(err => {
          console.error("Failed to fetch leaderboard", err);
          return { data: { topUsers: [], currentUserRank: null } };
        })
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        user = userData.data as UserDto;
      } else if (userRes.status === 401) {
        isGuest = true;
      }

      if (leaderboardRes && leaderboardRes.data) {
        leaderboardData = leaderboardRes.data;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data, fallback to guest mode", error);
      isGuest = true;
    }
  } else {
    try {
      const leaderboardRes = await getStreakLeaderboard(undefined, 20);
      if (leaderboardRes && leaderboardRes.data) {
        leaderboardData = leaderboardRes.data;
      }
    } catch (error) {
      console.error("Failed to fetch public leaderboard", error);
    }
  }

  return (
    <main className="py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-4 gap-6 flex-grow w-full px-2 md:px-0">
      {/* Cột chính (Left/Center Area) - 8/12 Laptops, 3/4 Desktops */}
      <div className="lg:col-span-8 xl:col-span-3 space-y-6">
        {/* Guest CTA Banner */}
        {isGuest && (
          <div className="bg-indigo-600 text-white rounded-xl p-8 shadow-md relative overflow-hidden border border-indigo-600/30">
            <div className="relative z-10 space-y-4 max-w-xl">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Trải nghiệm không giới hạn 🚀
              </span>
              <h2 className="text-2xl font-extrabold leading-tight">
                Chào bạn mới nha! Cùng bẻ gãy TOEIC & IELTS nào
              </h2>
              <p className="text-indigo-50/90 text-sm leading-relaxed">
                Bạn đang sử dụng hệ thống ở chế độ Khách. Đăng nhập bằng Google chỉ 3s để sở hữu toàn bộ đặc quyền sau:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-200">⚡</span> Lưu tiến độ học tập
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-200">🔥</span> Tích luỹ Streak rèn luyện
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-200">🏆</span> Leo top Bảng Xếp Hạng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-200">💎</span> Tự động lưu Sổ tay câu sai
                </li>
              </ul>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-center font-bold text-sm bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl shadow-sm transition duration-200"
                >
                  Đăng nhập ngay! 🚀
                </Link>
                <span className="text-xs text-indigo-100 font-medium hidden sm:inline">
                  ⚡ Đồng bộ tức thì, học miễn phí
                </span>
              </div>
            </div>
            <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none text-8xl select-none font-bold hidden lg:block">
              GUEST
            </div>
          </div>
        )}

        {/* Hero Widget: Daily Mini-Test (with progress ring redesigned) */}
        <DailyQuizWidget userFullName={user?.fullName} token={token} />

        {/* Core Feature: Full Mock Test */}
        <div className="bg-[#0F172A] text-white rounded-xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden border border-slate-800/80">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-9xl select-none font-bold translate-x-10 -translate-y-10">
            EXAM
          </div>
          <div className="space-y-3">
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider border border-indigo-500/20">
              🏛️ Phòng thi giả lập áp lực cao
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold">Full-Length Mock Test Workspace</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
              Trải nghiệm phòng thi máy IDP/BC & ETS thực tế. Hệ thống tự kích hoạt Full-Screen Mode, ghim Listening Audio Guard khóa tua/tạm dừng file nghe và đếm ngược thời gian nghiêm ngặt.
            </p>
          </div>
          <div>
            <Link
              href="/exam"
              className="inline-flex items-center gap-1.5 font-bold text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-sm transition duration-200"
            >
              Vào phòng thi ngay 🚀
            </Link>
          </div>
        </div>

        {/* Exam Library Shelf (Static Shelf data placeholder) */}
        <ExamLibraryShelf />

        {/* Quick Access Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/luyen-noi" className="bento-card p-6 text-left group flex flex-col justify-between">
            <div>
              <span className="text-3xl">🎙️</span>
              <h3 className="text-base font-bold mt-4 mb-2 group-hover:text-indigo-500 transition">Luyện nói &ldquo;Du kích&rdquo; với AI nha</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Chúng mình đang lắng nghe bạn nói nè, cứ tự nhiên phản xạ không độ trễ nha.
              </p>
            </div>
          </Link>

          <Link href="/ngan-hang-cau-sai" className="bento-card p-6 text-left group flex flex-col justify-between">
            <div>
              <span className="text-3xl">💎</span>
              <h3 className="text-base font-bold mt-4 mb-2 group-hover:text-indigo-500 transition">Sổ tay &ldquo;gột rửa&rdquo; câu sai 💎</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kho báu tự động lưu và phân loại chi tiết lỗi sai giúp bạn sửa đổi lỗ hổng kiến thức.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Cột phụ (Right Sidebar Area) - 4/12 Laptops, 1/4 Desktops */}
      <div className="lg:col-span-4 xl:col-span-1 space-y-6">
        {/* Bảng Xếp Hạng */}
        <div className="bento-card p-6 min-h-[300px]">
          <h3 className="text-sm font-bold mb-4 flex items-center justify-between text-slate-800">
            <span>Bảng Xếp Hạng</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chuỗi ngày (Streak)</span>
          </h3>
          <div className="space-y-2">
            {leaderboardData.topUsers.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Chưa có dữ liệu xếp hạng.</p>
            ) : (
              <>
                {leaderboardData.topUsers.map((u) => {
                  const isCurrent = u.isCurrentUser;
                  return (
                    <div
                      key={u.rank}
                      className={`flex items-center justify-between py-2 px-2.5 rounded-xl transition ${isCurrent
                        ? "bg-indigo-50/70 border border-indigo-100 font-bold"
                        : "hover:bg-slate-50/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${u.rank === 1 ? "bg-amber-100 text-amber-800" :
                          u.rank === 2 ? "bg-slate-100 text-slate-800" :
                            isCurrent ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-650"
                          }`}>
                          {u.rank}
                        </span>
                        {u.avatarColor ? (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase select-none shrink-0"
                            style={{ backgroundColor: u.avatarColor }}
                          >
                            {u.nickname.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold uppercase select-none shrink-0">
                            {u.nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-slate-800 truncate max-w-[110px]">{u.nickname}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-500 shrink-0">{u.currentStreak} 🔥</span>
                    </div>
                  );
                })}

                {leaderboardData.currentUserRank && leaderboardData.currentUserRank.surroundingUsers.length > 0 && (
                  <>
                    <div className="flex justify-center py-1.5 select-none" aria-hidden="true">
                      <span className="text-slate-400 text-xs font-bold tracking-widest">•••</span>
                    </div>
                    {leaderboardData.currentUserRank.surroundingUsers.map((u) => {
                      const isCurrent = u.isCurrentUser;
                      return (
                        <div
                          key={`surround-${u.rank}`}
                          className={`flex items-center justify-between py-2 px-2.5 rounded-xl transition ${isCurrent
                            ? "bg-indigo-50/70 border border-indigo-100 font-bold"
                            : "hover:bg-slate-50/50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isCurrent ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-650"
                              }`}>
                              {u.rank}
                            </span>
                            {u.avatarColor ? (
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase select-none shrink-0"
                                style={{ backgroundColor: u.avatarColor }}
                              >
                                {u.nickname.charAt(0).toUpperCase()}
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold uppercase select-none shrink-0">
                                {u.nickname.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-xs text-slate-800 truncate max-w-[110px]">{u.nickname}</span>
                          </div>
                          <span className="text-xs font-bold text-indigo-500 shrink-0">{u.currentStreak} 🔥</span>
                        </div>
                      );
                    })}
                  </>
                )}

                {isGuest && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center space-y-3 relative overflow-hidden rounded-xl bg-slate-50/50 p-4 border border-dashed border-slate-200">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                      Bạn đang đứng thứ mấy? Đăng nhập bằng Google để kích hoạt ngọn lửa Streak và ghi danh lên bảng vàng liền nè! 🚀
                    </p>
                    <div>
                      <Link
                        href="/login"
                        className="inline-flex text-[10px] font-extrabold bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl transition duration-200 shadow-sm"
                      >
                        Đăng nhập ngay
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Radar Chart (Diagnostics Widget Mock Placeholder or Link) */}
        <Link href="/thong-ke" className="bento-card p-6 text-left block">
          <h3 className="text-sm font-bold mb-2 text-slate-800">Chẩn đoán Năng lực</h3>
          <p className="text-slate-500 text-xs leading-relaxed mb-4">
            Xem biểu đồ Radar phân tích kỹ năng và đánh giá các phần yếu nhất để cải thiện kịp thời.
          </p>
          <span className="text-xs font-bold text-indigo-500 hover:underline">
            Phân tích học tập ngay &rarr;
          </span>
        </Link>

        {/* Bento Widget Starter Pack */}
        <StarterPackWidget />
      </div>
    </main>
  );
}
