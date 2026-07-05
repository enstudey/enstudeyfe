import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Điều khoản dịch vụ</h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Cập nhật lần cuối: Ngày 04 tháng 07 năm 2026</p>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Chấp thuận điều khoản</h2>
            <p>
              Chào mừng bạn đến với EnStudey. Bằng cách truy cập và sử dụng trang web này, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi các điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng mình.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Quyền sở hữu trí tuệ</h2>
            <p>
              Tất cả các nội dung học thuật, bài viết cẩm nang ôn thi, câu hỏi trắc nghiệm, hình ảnh, mã nguồn và giao diện người dùng trên EnStudey đều thuộc sở hữu độc quyền của EnStudey và được bảo vệ bởi luật sở hữu trí tuệ của Việt Nam. Người dùng không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản từ chúng mình.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. Hành vi bị nghiêm cấm</h2>
            <p>Khi sử dụng EnStudey, bạn đồng ý không:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sử dụng các công cụ tự động (bot, crawler, scraper) để thu thập dữ liệu đề thi hoặc bài viết học tập từ hệ thống.</li>
              <li>Gây cản trở hoặc làm gián đoạn hoạt động của trang web hoặc các máy chủ kết nối với trang web.</li>
              <li>Sử dụng ngôn từ xúc phạm, thiếu văn hóa hoặc vi phạm thuần phong mỹ tục trong các khu vực tương tác (nếu có).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Tuyên bố miễn trừ trách nhiệm</h2>
            <p>
              Toàn bộ kết quả tính toán tổ hợp môn thi THPT và gợi ý danh sách trường tuyển sinh tại các trang công cụ chỉ mang tính chất tham khảo học thuật. Quyết định lựa chọn và nộp nguyện vọng cuối cùng hoàn toàn thuộc về thí sinh. EnStudey không chịu bất kỳ trách nhiệm pháp lý nào đối với kết quả tuyển sinh thực tế của thí sinh.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
