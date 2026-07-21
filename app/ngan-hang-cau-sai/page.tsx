import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import MistakeBankDashboard from "@/components/mistake-bank/MistakeBankDashboard";

export const metadata: Metadata = {
  title: "Sổ tay câu sai - EnStudey",
  description: "Kho lưu trữ và ôn tập các câu trả lời sai của bạn.",
};

export default async function MistakeBankPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  return (
    <main className="w-full py-12 flex-grow">
      <h1 className="text-3xl font-extrabold mb-6 text-slate-900 flex items-center gap-2">
        <span>📖</span> Sổ tay câu sai (Mistake Bank)
      </h1>

      {isGuest ? (
        <div className="bg-white border border-blue-500/20 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xl space-y-6">
          <div className="w-20 h-20 bg-blue-50 border border-blue-500/10 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto animate-pulse">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Gột rửa lỗi sai của riêng bạn 💎</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Tính năng Mistake Bank tự động ghi nhận các lỗi sai, phân loại theo dạng ngữ pháp/từ vựng để giúp bạn vá lỗ hổng kiến thức. Đăng nhập để sử dụng tính năng này nha!
            </p>
          </div>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="font-bold text-sm bg-gradient-to-r from-blue-500 to-blue-655 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <Link href="/login">
                Đăng nhập ngay! 🚀
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <MistakeBankDashboard token={token} />
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
