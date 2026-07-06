import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - EnStudey",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Chính sách bảo mật thông tin – EnStudey
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

        <div className="prose dark:prose-invert space-y-6 text-sm text-slate-700 dark:text-zinc-350 leading-relaxed">
          <p>
            Chào bạn nha! Cảm ơn bạn đã lựa chọn <strong>EnStudey</strong> làm nơi cập nhật kiến thức và tra cứu thông tin mùa thi.
          </p>
          <p>
            Vì EnStudey ở phiên bản hiện tại hoạt động hoàn toàn miễn phí và không yêu cầu bạn phải tạo tài khoản đăng nhập, nên việc bảo mật thông tin của bạn cực kỳ đơn giản và an toàn. Tuy nhiên, để hệ thống chạy mượt mà và duy trì được nền tảng, tụi mình có áp dụng một vài chính sách nhỏ liên quan đến dữ liệu hệ thống. Bạn dành chút thời gian đọc cùng chúng mình nghen!
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Tụi mình &quot;thu thập&quot; những thông tin gì?</h2>
            <p>Thật ra là... hầu như không có gì mang tính cá nhân cả! ✨</p>
            <p>Ở phiên bản này, EnStudey chỉ có 3 tính năng: Đọc Blog, Tính điểm và Lọc trường Đại học.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Dữ liệu điểm số của bạn:</strong> Khi bạn nhập điểm thi vào công cụ tính điểm hay tra cứu, mọi phép toán đều được <strong>xử lý ngay lập tức trên trình duyệt điện thoại/máy tính của bạn</strong>. Tụi mình KHÔNG lưu trữ điểm số hay nguyện vọng của bạn về máy chủ (server) của EnStudey.
              </li>
              <li>
                <strong>Dữ liệu hệ thống (Cookies):</strong> Để trang web load nhanh hơn cho những lần truy cập sau và phục vụ cho việc hiển thị quảng cáo, hệ thống sẽ tự động lưu lại một tệp dữ liệu ẩn danh rất nhỏ gọi là Cookie trên trình duyệt của bạn.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Lời hứa bảo mật từ EnStudey</h2>
            <p>
              Vì tụi mình không yêu cầu bạn điền họ tên, số điện thoại hay email đăng nhập, nên bạn có thể hoàn toàn yên tâm &quot;lướt&quot; web một cách ẩn danh. Tụi mình cam kết:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Không có bất kỳ dữ liệu cá nhân nào của bạn bị thu thập lén lút.</li>
              <li>Tuyệt đối không có hành vi mua bán hay trao đổi thông tin người dùng cho bất kỳ bên thứ ba nào khác.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. LƯU Ý QUAN TRỌNG VỀ QUẢNG CÁO & TIẾP THỊ LIÊN KẾT (Shopee Affiliate) 🍪</h2>
            <p>
              Để EnStudey có kinh phí duy trì server 24/7 và luôn mở cửa miễn phí cho tất cả các bạn học sinh, trang web có sử dụng hệ thống quảng cáo từ đối tác <strong>Google AdSense</strong> và các liên kết giới thiệu sản phẩm tiếp thị liên kết từ đối tác <strong>Shopee Affiliate</strong>. Đây là các quy định chung bạn cần lưu ý nha:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Các nhà cung cấp bên thứ ba, bao gồm cả Google, sẽ sử dụng <strong>Cookie</strong> để phân phát các quảng cáo phù hợp dựa trên các lượt truy cập trước đó của bạn vào EnStudey hoặc các trang web khác trên Internet.
              </li>
              <li>
                Các liên kết giới thiệu sản phẩm (như sách học tiếng Anh, balo, đồ dùng học tập) hiển thị trên EnStudey sẽ chuyển hướng bạn đến trang mua sắm Shopee thông qua hệ thống Shopee Affiliate. Hoạt động này hoàn toàn không làm phát sinh thêm bất kỳ chi phí mua sắm nào cho bạn.
              </li>
              <li>
                Bạn hoàn toàn có quyền chủ động <strong>từ chối</strong> việc sử dụng Cookie cho quảng cáo được cá nhân hóa bằng cách truy cập vào trang <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-500 hover:underline">Cài đặt quảng cáo của Google</a>.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Kết nối với chúng mình</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về các chính sách này, hoặc vô tình thấy một quảng cáo nào đó chưa phù hợp, đừng ngại &quot;ới&quot; tụi mình ngay qua các thông tin dưới đây nha:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Nền tảng:</strong> EnStudey - Nền tảng hỗ trợ học tập cá nhân hóa</li>
              <li><strong>Chịu trách nhiệm nội dung:</strong> Nguyễn Đức Tâm</li>
              <li><strong>Địa chỉ:</strong> Tổ 2, Phường Cầu Giấy, TP. Hà Nội, Việt Nam</li>
              <li><strong>Email hỗ trợ:</strong> contact@enstudey.com</li>
            </ul>
          </section>

          <p className="font-bold text-orange-600 dark:text-orange-500 mt-6">
            Cứ tự nhiên tra cứu và ôn tập nha. Chúc bạn sẽ có một kỳ thi thật rực rỡ và trúng tuyển ngay nguyện vọng 1! 🚀
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
