import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import StartSpeakingButton from "@/components/speech/StartSpeakingButton";
import AdSenseSlot from "@/components/ads/AdSenseSlot";

export const metadata: Metadata = {
  title: "Luyện nói với AI - EnStudey",
  description: "Trò chuyện phản xạ nhanh 5 phút cùng AI chatbot.",
};

export default async function SpeakingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  return (
    <main className="w-full py-12 text-center flex-grow">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Nói Du Kích cùng AI</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Trò chuyện phản xạ trực tiếp qua giọng nói với AI. Hệ thống sử dụng Web Speech API miễn phí trên thiết bị của bạn.
      </p>

      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left max-w-md mx-auto text-sm font-medium">
          <span className="text-lg">⚠️</span>
          <div>
            Bạn đang luyện nói ở mode ẩn danh. Cuộc hội thoại và đánh giá phát âm từ AI sẽ không được lưu lại.{" "}
            <Link href="/login" className="underline font-bold text-indigo-655 hover:text-indigo-700 transition">
              Đăng nhập ngay
            </Link>{" "}
            để lưu trữ lịch sử học tập nhé!
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto items-start text-center lg:text-left">
        {/* Khung chính */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-xs text-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            🎙️
          </div>
          <h2 className="text-xl font-bold mb-2">Bắt đầu hội thoại</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Trợ lý AI sẽ đưa ra chủ đề và bắt đầu hội thoại với bạn trong vòng 5 phút.
          </p>
          <StartSpeakingButton />
        </div>

        {/* Khung quảng cáo AdSense dọc */}
        <div className="lg:col-span-4 w-full">
          <AdSenseSlot slotId="speaking-sidebar-slot-id" format="vertical" minHeight="280px" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
