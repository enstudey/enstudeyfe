import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng - EnStudey",
  description: "Các điều khoản và quy định khi tham gia học tập trên EnStudey.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-950 dark:text-white">Điều khoản sử dụng</h1>
      <section className="prose dark:prose-invert leading-relaxed text-slate-700 dark:text-zinc-300 space-y-6">
        <p>
          Chào mừng bạn đến với EnStudey. Khi truy cập và sử dụng dịch vụ của chúng tôi, 
          bạn đồng ý tuân thủ các điều khoản sau:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-750 dark:text-zinc-400">
          <li>Sử dụng dịch vụ đúng mục đích học tập cá nhân.</li>
          <li>Không sử dụng các công cụ tự động can thiệp vào hệ thống chấm điểm và thi thử.</li>
          <li>Chấp nhận việc hiển thị quảng cáo không che khuất nội dung từ hệ thống đối tác của chúng tôi.</li>
        </ul>
      </section>
      <div className="mt-8">
        <Link href="/" className="text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-medium">
          &larr; Quay lại Trang chủ
        </Link>
      </div>
    </main>
  );
}


