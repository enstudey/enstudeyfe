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
          Điều khoản sử dụng dịch vụ – Nền tảng EnStudey
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed text-justify">
          <p>
            Chào mừng bạn đến với EnStudey (sau đây gọi tắt là &quot;chúng tôi&quot; hoặc &quot;nền tảng&quot;). Trước khi sử dụng các công cụ tính toán và hệ thống tra cứu trên website, xin vui lòng đọc kỹ các Điều khoản sử dụng dịch vụ dưới đây.
          </p>
          <p>
            Khi bạn truy cập, lướt web hoặc sử dụng bất kỳ tiện ích nào trên EnStudey, đồng nghĩa với việc bạn đã đọc, hiểu và tự nguyện chấp thuận tuân thủ các quy định và cam kết ràng buộc pháp lý của văn bản này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, xin vui lòng ngừng truy cập hệ thống.
          </p>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Các dịch vụ và Tiện ích cung cấp</h2>
            <p>
              Nền tảng EnStudey hoạt động theo mô hình tinh gọn, phân phối tài nguyên tĩnh miễn phí nhằm hỗ trợ học sinh và phụ huynh trong mùa tuyển sinh Đại học, bao gồm:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Hệ thống Blog & Kiến thức:</strong> Cập nhật các bài viết chia sẻ phương pháp ôn tập, mẹo phòng thi và kiến thức tiếng Anh học thuật.
              </li>
              <li>
                <strong>Công cụ Tính điểm xét tuyển:</strong> Tự động hóa phép tính tổng điểm tổ hợp môn và điểm ưu tiên đối tượng/khu vực dựa trên công thức quy chuẩn của quy chế tuyển sinh hiện hành.
              </li>
              <li>
                <strong>Tiện ích Tra cứu tuyển sinh:</strong> Gợi ý danh sách trường Đại học, ngành học dựa trên dữ liệu điểm chuẩn của các năm trước.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Tuyên bố miễn trừ trách nhiệm pháp lý</h2>
            <p>
              Ban quản trị EnStudey cam kết nỗ lực tối đa để tổng hợp dữ liệu điểm chuẩn và xây dựng công thức tính toán từ các nguồn thông tin chính thống. Tuy nhiên, người dùng bắt buộc phải lưu ý các giới hạn trách nhiệm dưới đây:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Tính chất tham khảo:</strong> Toàn bộ kết quả trả về từ công cụ Tính điểm và hệ thống gợi ý nguyện vọng trường Đại học trên EnStudey chỉ mang tính chất tham khảo, định hướng cá nhân và phục vụ mục đích giả lập chiến thuật.
              </li>
              <li>
                <strong>Không thay thế văn bản gốc:</strong> Dữ liệu hiển thị trên website không có giá trị thay thế cho các thông báo trúng tuyển chính thức, quyết định gọi nhập học hoặc văn bản pháp lý từ Bộ Giáo dục và Đào tạo, cũng như từ hội đồng tuyển sinh của các trường Đại học.
              </li>
              <li>
                <strong>Miễn trừ thiệt hại:</strong> EnStudey từ chối chịu bất kỳ trách nhiệm pháp lý nào đối với các thiệt hại, rủi ro hoặc khiếu nại phát sinh từ việc người dùng tự ý sử dụng kết quả gợi ý trên hệ thống để làm căn cứ nộp hồ sơ nguyện vọng thực tế. Người dùng có nghĩa vụ tự đối chiếu thông tin trên trang thông tin chính thức của các trường Đại học trước khi đưa ra quyết định cuối cùng.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. Quy định về Quảng cáo, Tiếp thị liên kết và An toàn hệ thống</h2>
            <p>
              Để duy trì hạ tầng kỹ thuật vận hành ổn định liên tục và bảo đảm nền tảng luôn mở cửa 100% miễn phí cho cộng đồng, EnStudey tích hợp các giải pháp từ các đối tác thương mại:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Giải pháp quảng cáo trực tuyến:</strong> Hệ thống có hiển thị các biểu ngữ quảng cáo tự động từ đối tác Google AdSense. Các vị trí quảng cáo này được tối ưu kỹ thuật nhằm bảo đảm không che khuất các nút hành động hoặc gây cản trở luồng trải nghiệm học tập của người dùng.
              </li>
              <li>
                <strong>Giới thiệu tiếp thị liên kết:</strong> Hệ thống có tích hợp các đường dẫn giới thiệu sản phẩm, văn phòng phẩm, cẩm nang tài liệu ôn thi dẫn sang sàn thương mại điện tử Shopee thông qua chương trình Shopee Affiliate. Các liên kết tiếp thị này đều được gắn nhãn nhận diện công khai (Gợi ý dành cho bạn/Được tài trợ) theo đúng quy định pháp luật hiện hành.
              </li>
              <li>
                <strong>Nghiêm cấm các hành vi gian lận hệ thống:</strong> Người dùng tuyệt đối không được sử dụng các công cụ tự động, mã độc, script, bot hoặc phần mềm bên thứ ba để click liên tục vào quảng cáo hoặc liên kết tiếp thị nhằm mục đích phá hoại tài khoản của nền tảng. Chúng tôi sử dụng các tầng bảo mật của Cloudflare WAF để tự động theo dõi danh tính IP; mọi hành vi bất thường sẽ bị hệ thống chặn truy cập (Block IP) vĩnh viễn mà không cần thông báo trước.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Quyền sở hữu trí tuệ và Quy định chống cào dữ liệu</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Quyền sở hữu:</strong> Toàn bộ giao diện giao diện, bài viết học thuật, cấu trúc mã nguồn tính điểm và cơ sở dữ liệu đóng gói tĩnh hiển thị trên tên miền <code>enstudey.com</code> đều thuộc quyền sở hữu trí tuệ hợp pháp của ban quản trị dự án.
              </li>
              <li>
                <strong>Quy định chia sẻ:</strong> Người dùng được quyền tự do chụp ảnh kết quả tra cứu, chia sẻ hyperlink đường dẫn bài viết cho mục đích học tập phi thương mại.
              </li>
              <li>
                <strong>Nghiêm cấm sao chép tự động:</strong> Tuyệt đối nghiêm cấm mọi hành vi sử dụng công cụ cào dữ liệu (Web Scraper), script tự động để bóc tách, trích xuất hàng loạt file dữ liệu điểm chuẩn tuyển sinh của EnStudey nhằm mục đích tái cấu trúc, xây dựng các hệ thống website đối thủ cạnh tranh thương mại.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">5. Cơ chế cập nhật điều khoản và Thông tin liên hệ</h2>
            <p>
              Chúng tôi có quyền sửa đổi, bổ sung các điều khoản dịch vụ này bất kỳ lúc nào để phù hợp với các tính năng công nghệ mới hoặc sự thay đổi của luật pháp trực tuyến. Mọi cập nhật sẽ có hiệu lực ngay khi được xuất bản trên đường dẫn này.
            </p>
            <p>
              Mọi ý kiến đóng góp kỹ thuật, phản hồi lỗi tính toán hoặc báo cáo vi phạm điều khoản, xin vui lòng liên hệ trực tiếp với người chịu trách nhiệm hệ thống:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Đại diện chịu trách nhiệm:</strong> Nguyễn Đức Tâm</li>
              <li><strong>Địa chỉ:</strong> Tổ 2, Phường Cầu Giấy, Thành phố Hà Nội, Việt Nam</li>
              <li><strong>Email phản hồi:</strong> contact@enstudey.com</li>
            </ul>
          </section>

          <p className="font-bold text-orange-600 dark:text-orange-500 text-center mt-6">
            EnStudey kính chúc toàn thể các bạn sĩ tử ôn tập hiệu quả, xây dựng chiến thuật nguyện vọng thông minh và đạt kết quả cao nhất trong kỳ thi Đại học sắp tới!
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
