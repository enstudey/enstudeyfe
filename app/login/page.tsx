import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập - EnStudey",
  description: "Đăng nhập vào hệ thống học tập EnStudey bằng Google.",
};

export default function LoginPage() {
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 tracking-tight">
            EnStudey
          </Link>
          <p className="text-slate-400 text-sm">Chinh phục TOEIC & IELTS thông minh cùng trợ lý AI</p>
        </div>

        <div className="py-4 space-y-4">
          <h2 className="text-xl font-bold text-slate-200">Chào bạn nha! Vào học thôi nào 🚀</h2>
          <p className="text-slate-400 text-xs leading-relaxed px-4">
            Chúng mình sử dụng tài khoản Google để đồng bộ lịch sử luyện thi và streak học tập của bạn.
          </p>
        </div>

        <div>
          <a
            href={googleLoginUrl}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.014c1.49 0 2.859.549 3.92 1.455l3.224-3.224C19.146 2.88 16.792 2 13.99 2 8.155 2 3.5 6.655 3.5 12.5S8.155 23 13.99 23c5.3 0 9.878-3.727 9.878-10.5 0-.74-.066-1.455-.18-2.215H12.24Z"
              />
            </svg>
            Đăng nhập bằng Google
          </a>
        </div>


        <div className="pt-4 border-t border-white/5 text-xs text-slate-500">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng của EnStudey.
        </div>
      </div>
    </div>
  );
}
