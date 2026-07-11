import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Luyện đề - EnStudey",
  description: "Trang luyện đề TOEIC / IELTS với bộ câu hỏi chọn lọc.",
};

export default async function QuizPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Luyện Đề Luyện Thi</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Bắt đầu làm các bài Mini-Test 10 câu hoặc các bài thi Full-test chuẩn cấu trúc đề thi thực tế.
      </p>

      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left max-w-md mx-auto text-sm font-medium">
          <span className="text-lg">⚠️</span>
          <div>
            Bạn đang làm bài ở mode ẩn danh. Kết quả và các câu sai sẽ không được lưu trữ.{" "}
            <a href={googleLoginUrl} className="underline font-bold text-violet-600 hover:text-violet-700 transition">
              Đăng nhập bằng Google ngay
            </a>{" "}
            để đồng bộ tiến độ học tập nhé!
          </div>
        </div>
      )}

      <div className="inline-block bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Mini-Test #01 (Ngữ pháp & Từ vựng)</h2>
        <div className="text-sm text-muted-foreground mb-6 space-y-1">
          <p>Số câu hỏi: 10 câu</p>
          <p>Thời gian: Không giới hạn</p>
        </div>
        <Button className="font-bold px-6 py-5 rounded-xl shadow-md">
          Bắt đầu làm bài
        </Button>
      </div>

      <div className="mt-8">
        <Link href="/dashboard" className="text-sm text-violet-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>
      </div>
    </main>
  );
}
