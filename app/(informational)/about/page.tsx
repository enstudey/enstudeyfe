import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu - EnStudey",
  description: "Tìm hiểu về sứ mệnh, tầm nhìn và giá trị cốt lõi của EnStudey.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Về EnStudey</h1>
      <section className="prose leading-relaxed text-gray-700 space-y-6">
        <p>
          EnStudey là nền tảng học tiếng Anh (TOEIC & IELTS) thông minh, tận dụng sức mạnh của AI 
          và các tương tác cực ngắn (Micro Sessions) để mang lại trải nghiệm luyện tập hiệu quả nhất.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Sứ mệnh của chúng tôi</h2>
        <p>
          Chúng tôi mong muốn giúp người dùng xây dựng thói quen học tập bền vững thông qua mô hình 
          &ldquo;Daily Mini-Test&rdquo; và luyện Nói giao tiếp không áp lực với trợ lý ảo AI.
        </p>
      </section>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Quay lại Trang chủ
        </Link>
      </div>
    </main>
  );
}
