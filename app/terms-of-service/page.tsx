import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ - EnStudey",
  description: "Bản thỏa thuận sử dụng dịch vụ tra cứu điểm chuẩn, tính điểm xét tuyển tốt nghiệp và tham khảo tin tức hướng nghiệp tại EnStudey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="w-full py-12 flex-grow space-y-6">
      <div className="max-w-[1200px] mx-auto bg-white border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm space-y-6 text-justify">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Điều khoản dịch vụ EnStudey
        </h1>
        <p className="text-xs text-slate-500 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

        <div className="prose max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Chào mừng bạn đến với <strong>EnStudey</strong> tại địa chỉ <a href="https://enstudey.com" className="underline font-semibold text-blue-600">enstudey.com</a>. Bằng việc truy cập, tham khảo tin tức hoặc sử dụng bất kỳ tiện ích tính toán nào trên trang web của chúng tôi, bạn đồng ý tuân thủ toàn bộ các điều khoản và quy định sử dụng dịch vụ dưới đây.
          </p>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Các dịch vụ và Tiện ích cung cấp</h2>
            <p>
              EnStudey là một dự án cá nhân phi lợi nhuận hoạt động trong lĩnh vực hỗ trợ học tập và định hướng tuyển sinh cho học sinh Việt Nam. Chúng tôi cung cấp các tài nguyên học tập (Blog kiến thức), thuật toán tự động tính điểm xét tốt nghiệp THPT theo quy chế Bộ GD&ĐT, và bộ lọc gợi ý nguyện vọng dựa trên dữ liệu điểm chuẩn Đại học qua các năm.
            </p>
            <p>
              Tất cả các dịch vụ tính toán và tra cứu hiện tại đều được cung cấp hoàn toàn <strong>miễn phí</strong>, không bắt buộc đăng nhập để đảm bảo quyền tiếp cận bình đẳng cho mọi sĩ tử.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Tuyên bố miễn trừ trách nhiệm pháp lý</h2>
            <p>
              Mặc dù đội ngũ phát triển EnStudey luôn nỗ lực cập nhật dữ liệu điểm chuẩn chính xác nhất từ đề án tuyển sinh chính thức của các trường Đại học và kiểm duyệt kỹ lưỡng các công thức tính điểm tốt nghiệp, chúng tôi <strong>không đảm bảo tuyệt đối 100% tính chính xác, không sai lệch</strong> của các kết quả trả về do sai số làm tròn hoặc thay đổi bất ngờ trong quy chế của từng trường.
            </p>
            <p>
              Mọi gợi ý phân vùng nguyện vọng (An toàn, Cọ xát, Rủi ro) đều chỉ mang tính chất <strong>tham khảo và định hướng sơ bộ</strong>. Người dùng (Thí sinh và Phụ huynh) hoàn toàn tự chịu trách nhiệm về quyết định đăng ký nguyện vọng chính thức của mình trên hệ thống của Bộ Giáo dục và Đào tạo. EnStudey từ chối mọi trách nhiệm pháp lý đối với bất kỳ khiếu nại nào liên quan đến kết quả xét tuyển thực tế của người dùng.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Quy định về Quảng cáo, Tiếp thị liên kết và An toàn hệ thống</h2>
            <p>
              Để duy trì chi phí vận hành máy chủ lưu trữ dữ liệu lớn, EnStudey tích hợp dịch vụ quảng cáo tự động Google AdSense và các liên kết tiếp thị Tiki Affiliate (gợi ý sách ôn tập, dụng cụ học tập). Chúng tôi cam kết các quảng cáo này không chứa mã độc, không thu thập thông tin nhận dạng cá nhân nhạy cảm của bạn và được phân bổ hợp lý để giữ nguyên tính thẩm mỹ của giao diện.
            </p>
            <p>
              Bằng việc sử dụng trang web, bạn đồng ý với việc hiển thị các nội dung tài trợ và liên kết tiếp thị này.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Quyền sở hữu trí tuệ và Quy định chống cào dữ liệu</h2>
            <p>
              Toàn bộ bài viết hướng dẫn học tập, thiết kế giao diện, cấu trúc mã nguồn của công cụ tính điểm và cơ sở dữ liệu tra cứu nguyện vọng được chuẩn hóa trên hệ thống thuộc sở hữu độc quyền của EnStudey hoặc các tác giả liên kết.
            </p>
            <p>
              Chúng moi nghiêm cấm mọi hành vi sử dụng công cụ tự động (bots, crawlers, scrapers) để cào dữ liệu hàng loạt từ website mà không có sự đồng ý bằng văn bản của người đại diện dự án. Hành vi phá hoại, tấn công từ chối dịch vụ (DDoS) hoặc can thiệp vào mã nguồn chạy client-side của hệ thống sẽ bị xử lý theo Luật An ninh mạng Việt Nam.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Cơ chế cập nhật điều khoản và Thông tin liên hệ</h2>
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

          <p className="font-bold text-blue-600 text-center mt-6">
            EnStudey kính chúc toàn thể các bạn sĩ tử ôn tập hiệu quả, xây dựng chiến thuật nguyện vọng thông minh và đạt kết quả cao trong kỳ thi Đại học sắp tới!
          </p>
        </div>
      </div>
    </main>
  );
}
