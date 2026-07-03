import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "EnStudey - Luyện thi TOEIC & IELTS thông minh bằng AI",
  description: "Bẻ gãy áp lực phòng thi với Trợ lý Luyện đề AI thế hệ mới. Học miễn phí liền nè bạn ơi! 🚀",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-200">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500 tracking-tight">
          EnStudey
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="text-sm font-semibold bg-foreground text-background px-5 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            Vào học ngay
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/60 px-3 py-1 rounded-full text-xs font-bold text-orange-700 uppercase tracking-wider dark:bg-orange-950/45 dark:border-orange-900 dark:text-orange-300">
          ✨ Kỷ nguyên EdTech cá nhân hóa 2026
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Bẻ gãy áp lực phòng thi với <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Trợ lý Luyện đề AI</span> thế hệ mới
        </h1>
        <p className="opacity-75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Tối ưu hóa điểm số TOEIC & IELTS cực dễ thông qua phương pháp học chia nhỏ (Micro Sessions) và chấm điểm nói trực tiếp bằng Web Speech API nha.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-center font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-98"
          >
            Học miễn phí liền nè! 🚀
          </Link>
          <span className="text-xs opacity-50 font-medium sm:block hidden">
            ⚡ Join cùng chúng mình nha
          </span>
        </div>
      </section>

      {/* Section 2: Social Proof / Contributions Grid */}
      <section className="bg-card border-y border-card-border py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-10">
          <p className="text-xs font-semibold opacity-50 uppercase tracking-widest">
            Bám sát cấu trúc đề thi chuẩn ETS TOEIC & Dự báo Forecast IELTS mới nhất
          </p>

          {/* GitHub Contributions Style Grid mock */}
          <div className="max-w-xl mx-auto bg-background border border-card-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold opacity-85">Lịch sử rèn luyện của chúng mình nè</span>
              <span className="text-xs text-orange-600 font-bold">Giữ lửa 5 ngày liên tiếp rồi nè, đỉnh chóp bạn ơi! ⚡</span>
            </div>

            {/* Contrib grid */}
            <div className="grid grid-cols-12 gap-1.5">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${i > 28 ? "bg-emerald-500" :
                    i > 20 ? "bg-emerald-400" :
                      i > 10 ? "bg-emerald-200" :
                        "bg-card-border"
                    }`}
                />
              ))}
            </div>
            <div className="flex justify-end items-center gap-1.5 text-xs opacity-50">
              <span>Ít</span>
              <div className="w-2.5 h-2.5 bg-card-border rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-200 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
              <span>Nhiều</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Core Value Propositions */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold">
            Học thông minh hơn, không mệt mỏi hơn
          </h2>
          <p className="opacity-70 text-sm md:text-base leading-relaxed">
            Thay thế các bài kiểm tra dài 2 tiếng gây nản bằng các thử thách tinh gọn được tối ưu hóa cho người bận rộn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition space-y-4">
            <span className="text-3xl">🚀</span>
            <h3 className="text-lg font-bold">Daily Mini-Challenge</h3>
            <p className="opacity-75 text-sm leading-relaxed">
              10 câu hỏi rút gọn mỗi ngày giúp bẻ nhỏ bài test, duy trì chuỗi Streak và duy trì động lực học tập.
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition space-y-4">
            <span className="text-3xl">📘</span>
            <h3 className="text-lg font-bold">Sổ tay câu sai (Mistake Bank)</h3>
            <p className="opacity-75 text-sm leading-relaxed">
              Tự động phát hiện lỗi sai, phân loại theo chuyên đề và giải thích chi tiết lỗ hổng kiến thức.
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition space-y-4">
            <span className="text-3xl">🎙️</span>
            <h3 className="text-lg font-bold">AI Micro Speaking Session</h3>
            <p className="opacity-75 text-sm leading-relaxed">
              Luyện nói tiếng Anh giao tiếp 5 phút phản xạ không độ trễ tận dụng Web Speech API miễn phí trên client.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Bottom CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 text-white rounded-3xl p-12 text-center relative overflow-hidden shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold">Bắt đầu chinh phục TOEIC & IELTS cùng chúng mình nha! 🎯</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join cùng hàng ngàn bạn đang tiến bộ mỗi ngày bằng phương pháp học thông minh của EnStudey nha.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-block font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Học miễn phí liền nè! 🚀
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-75 text-sm">
          <span>&copy; 2026 EnStudey. Tối ưu hóa học tập bằng AI.</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:underline">Giới thiệu</Link>
            <Link href="/privacy" className="hover:underline">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:underline">Điều khoản sử dụng</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

