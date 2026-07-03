import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu - EnStudey",
  description: "Tìm hiểu về sứ mệnh, tầm nhìn và hành trình đồng hành cùng học viên chinh phục TOEIC/IELTS tại EnStudey.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-950 dark:text-white">Về EnStudey</h1>
      <section className="prose dark:prose-invert leading-relaxed text-slate-700 dark:text-zinc-300 space-y-6">
        <p>
          EnStudey là nền tảng học tiếng Anh (TOEIC & IELTS) thông minh, tận dụng sức mạnh của trí tuệ nhân tạo (AI) 
          và các tương tác tối giản (Micro Sessions) để mang lại trải nghiệm luyện tập hiệu quả nhất.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-950 dark:text-white">Sứ mệnh của chúng tôi</h2>
        <p>
          Chúng tôi mong muốn giúp học viên xây dựng thói quen học tập bền vững thông qua mô hình 
          &ldquo;Daily Mini-Test&rdquo; và luyện nói giao tiếp hiệu quả cùng trợ lý ảo AI.
        </p>
      </section>
      <div className="mt-8">
        <Link href="/" className="text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-medium">
          &larr; Quay lại Trang chủ
        </Link>
      </div>
    </main>
  );
}


