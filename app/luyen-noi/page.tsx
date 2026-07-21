import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Luyện nói với AI - EnStudey",
  description: "Trò chuyện phản xạ nhanh 5 phút cùng AI chatbot.",
};

export default async function SpeakingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Nói Du Kích cùng AI</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Trò chuyện phản xạ trực tiếp qua giọng nói với AI. Hệ thống sử dụng Web Speech API miễn phí trên thiết bị của bạn.
      </p>

      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left max-w-md mx-auto text-sm font-medium">
          <span className="text-lg">⚠️</span>
          <div>
            Bạn đang luyện nói ở mode ẩn danh. Cuộc hội thoại và đánh giá phát âm từ AI sẽ không được lưu lại.{" "}
            <a href={googleLoginUrl} className="underline font-bold text-blue-655 hover:text-blue-700 transition">
              Đăng nhập ngay
            </a>{" "}
            để lưu trữ lịch sử học tập nhé!
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-10 max-w-md mx-auto shadow-xs">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          🎙️
        </div>
        <h2 className="text-xl font-bold mb-2">Bắt đầu hội thoại</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          AI sẽ đưa ra chủ đề và bắt đầu hội thoại với bạn trong vòng 5 phút.
        </p>
        <Button className="font-bold w-full py-5 rounded-xl shadow-md cursor-pointer">
          Kết nối Micro & Bắt đầu
        </Button>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
