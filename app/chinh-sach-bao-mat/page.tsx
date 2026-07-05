import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - EnStudey",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Chính sách bảo mật</h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Cập nhật lần cuối: Ngày 04 tháng 07 năm 2026</p>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Dữ liệu bộ nhớ trình duyệt (localStorage)</h2>
            <p>
              EnStudey sử dụng cơ chế lưu trữ nội bộ của trình duyệt (`localStorage`) để lưu trữ tạm thời các điểm số môn học do bạn nhập ở trang Tính điểm. Việc này giúp hệ thống tự động đối sánh điểm chuẩn và phân loại nguy cơ nguyện vọng ở trang Tra cứu trường đại học. Chúng mình cam kết không gửi, không lưu trữ và không xử lý các điểm số này trên bất kỳ máy chủ nào. Dữ liệu hoàn toàn nằm dưới quyền kiểm soát của bạn trên thiết bị cá nhân.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Thu thập thông tin phi định danh</h2>
            <p>
              Chúng mình có thể thu thập thông tin phi định danh về cách bạn tương tác với trang web, bao gồm loại trình duyệt, hệ điều hành và các trang bạn đã truy cập nhằm mục đích cải thiện hiệu năng hệ thống và nâng cao trải nghiệm người dùng.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. Chính sách Cookie quảng cáo (Google AdSense)</h2>
            <p>
              EnStudey sử dụng dịch vụ quảng cáo của bên thứ ba (như Google AdSense) để hiển thị banner quảng cáo. Google sử dụng cookie để phân phát quảng cáo dựa trên các lượt truy cập trước đó của bạn vào trang web này hoặc các trang web khác trên Internet. Cookie DART của Google cho phép hiển thị các quảng cáo phù hợp dựa trên hành vi duyệt web của bạn. Bạn có thể chọn từ chối sử dụng cookie DART bằng cách truy cập trang cài đặt quảng cáo của Google.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Cam kết bảo mật</h2>
            <p>
              Chúng mình cam kết bảo vệ dữ liệu cá nhân của người dùng tuân thủ Luật Bảo vệ dữ liệu cá nhân của Việt Nam. EnStudey không chia sẻ, mua bán hoặc tiết lộ thông tin người dùng cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý của bạn.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
