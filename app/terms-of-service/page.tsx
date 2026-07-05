import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ - EnStudey",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Điều khoản sử dụng dịch vụ – EnStudey
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed">
          <p>
            Chào bạn nha! Cảm ơn bạn đã ghé thăm EnStudey – góc nhỏ giúp bạn cập nhật tin tức tuyển sinh và tính điểm đại học một cách tiện lợi và tối ưu.
          </p>
          <p>
            Để chúng mình có thể đồng hành cùng nhau lâu dài và giữ cho website luôn hoạt động ổn định, 100% miễn phí, bạn vui lòng dành vài phút đọc kỹ những &quot;luật chơi&quot; nho nhỏ dưới đây nghen. Khi bạn sử dụng các tiện ích trên EnStudey, đồng nghĩa với việc bạn đã vui vẻ đồng ý với các điều khoản này rồi đó!
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Các tiện ích tụi mình cung cấp</h2>
            <p>Hiện tại ở phiên bản này, EnStudey hoàn toàn miễn phí và cung cấp cho bạn 3 công cụ chính:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Góc Blog/Tin tức:</strong> Cập nhật các bài viết về phương pháp học tập, xu hướng xét tuyển và kiến thức tiếng Anh.</li>
              <li><strong>Công cụ Tính điểm tốt nghiệp/Đại học:</strong> Giúp bạn tự động cộng điểm các tổ hợp môn và điểm ưu tiên nhanh chóng.</li>
              <li><strong>Tra cứu tuyển sinh:</strong> Lọc và gợi ý các trường Đại học, ngành học và tổ hợp xét tuyển dựa trên cơ sở dữ liệu điểm chuẩn của các năm trước.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Giới hạn trách nhiệm (Miễn trừ trách nhiệm pháp lý)</h2>
            <p>Chúng mình luôn nỗ lực hết sức để cập nhật công thức tính điểm và dữ liệu điểm chuẩn từ các nguồn uy tín. Tuy nhiên, bạn lưu ý kĩ giúp chúng mình nha:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tất cả kết quả từ công cụ Tính điểm và Tra cứu trường Đại học chỉ mang tính chất <strong>tham khảo và định hướng cá nhân</strong>.</li>
              <li>Dữ liệu này <strong>không thay thế</strong> cho các thông báo trúng tuyển hay văn bản chính thức từ Bộ Giáo dục và Đào tạo hoặc từ các trường Đại học.</li>
              <li>EnStudey sẽ không chịu trách nhiệm pháp lý cho bất kỳ quyết định nộp hồ sơ nguyện vọng nào của bạn dựa trên kết quả gợi ý từ công cụ của tụi mình. Hãy luôn kiểm tra lại thông tin trên trang chủ của trường mà bạn muốn nộp hồ sơ nhé!</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. Điều khoản về Quảng cáo và Duy trì hệ thống</h2>
            <p>Để EnStudey có thể duy trì server hoạt động 24/7 và nâng cấp thêm nhiều công cụ xịn xò hơn cho bạn sử dụng hoàn toàn miễn phí, chúng mình có đặt các vị trí quảng cáo từ đối tác Google AdSense.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chúng mình cam kết các vị trí quảng cáo luôn được thiết kế gọn gàng, không che khuất bảng tính điểm hay nội dung bạn đang đọc.</li>
              <li><strong>Nghiêm cấm hành vi gian lận:</strong> Mong bạn KHÔNG sử dụng bất kỳ phần mềm, công cụ tự động (bot) nào để bấm (click) liên tục vào quảng cáo trên EnStudey nhằm mục đích phá hoại. Nếu hệ thống phát hiện IP có hành vi bất thường, tụi mình buộc lòng phải chặn truy cập của bạn để bảo vệ hệ thống.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Quyền sở hữu trí tuệ</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mọi nội dung bài viết, thuật toán tính điểm và giao diện hiển thị trên EnStudey đều thuộc bản quyền của hệ thống.</li>
              <li>Bạn có thể thoải mái chia sẻ link bài viết hoặc ảnh chụp kết quả tính điểm của bạn cho bạn bè, nhưng vui lòng không dùng các phần mềm tự động để &quot;cào&quot; (scrape) dữ liệu điểm chuẩn của tụi mình về làm web khác nha.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">5. Cập nhật điều khoản</h2>
            <p>
              Tụi mình có thể sẽ cập nhật hoặc thay đổi các điều khoản này khi website có thêm tính năng mới. Mọi sự thay đổi sẽ được thông báo ngay trên trang này. Bạn nhớ thỉnh thoảng ghé xem lại nha!
            </p>
          </section>

          <p className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            Nếu bạn có bất kỳ góp ý nào để công cụ tính điểm xịn hơn, đừng ngại gửi email cho chúng mình qua: <strong>contact@enstudey.com</strong>
          </p>
          <p className="font-bold text-orange-600 dark:text-orange-500">
            Chúc bạn sẽ tính toán chiến thuật thật tốt và đậu ngay vào ngôi trường Đại học mơ ước nghen! 🚀
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
