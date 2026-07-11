import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - EnStudey",
  description: "Chính sách bảo mật thông tin và dữ liệu người dùng tại EnStudey.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 bg-white text-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-955">Chính sách bảo mật</h1>
      <section className="prose leading-relaxed text-slate-700 space-y-6">
        <p>
          EnStudey tôn trọng quyền riêng tư của bạn. Mọi thông tin cá nhân và dữ liệu giọng nói 
          (khi sử dụng tính năng Speaking) đều được xử lý cục bộ trên trình duyệt của bạn (Web Speech API), 
          và chỉ những bản ghi kết quả tối giản mới được gửi về máy chủ của chúng tôi.
        </p>
        <p>
          Chúng tôi sử dụng Google Analytics và các cookies cần thiết để cải thiện chất lượng dịch vụ 
          và hiển thị quảng cáo cá nhân hóa thông qua Google AdSense.
        </p>
      </section>
      <div className="mt-8">
        <Link href="/" className="text-violet-600 hover:underline inline-flex items-center gap-1 font-medium">
          &larr; Quay lại Trang chủ
        </Link>
      </div>
    </main>
  );
}
