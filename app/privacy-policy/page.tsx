import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - EnStudey",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full py-12 flex-grow space-y-6">
      <div className="max-w-[1200px] mx-auto bg-white border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm space-y-6 text-justify">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Chính sách bảo mật thông tin – Nền tảng EnStudey
        </h1>
        <p className="text-xs text-slate-600 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

        <div className="prose max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Chào mừng bạn đến với EnStudey (sau đây gọi tắt là &quot;chúng tôi&quot; hoặc &quot;nền tảng&quot;). Chúng tôi cam kết bảo vệ quyền riêng tư và an toàn dữ liệu trực tuyến của toàn bộ khách truy cập, đặc biệt là các bạn học sinh và phụ huynh khi sử dụng các công cụ học tập và tra cứu trên hệ thống.
          </p>
          <p>
            Vì EnStudey hoạt động theo mô hình tinh gọn, ở phiên bản hiện tại, hệ thống hoàn toàn không yêu cầu người dùng phải đăng ký tài khoản, cung cấp họ tên, số điện thoại hay địa chỉ email. Bạn có thể sử dụng toàn bộ tính năng một cách ẩn danh và an toàn.
          </p>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Phạm vi thu thập và Cơ chế xử lý dữ liệu</h2>
            <p>
              Nền tảng EnStudey vận hành các tính năng cốt lõi bao gồm: Đọc bài viết học thuật, Công cụ tính điểm xét tuyển tốt nghiệp/học bạ và Tiện ích tra cứu tuyển sinh Đại học. Cơ chế xử lý dữ liệu được quy định minh bạch như sau:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Dữ liệu điểm số và nguyện vọng:</strong> Khi người dùng nhập thông tin điểm thi hoặc tổ hợp môn vào hệ thống tính toán, toàn bộ thuật toán xử lý dữ liệu đều được thực thi trực tiếp cục bộ trên trình duyệt máy khách (Client-side xử lý tại thiết bị của bạn). Chúng tôi cam kết không lưu trữ, không thu thập và không truyền tải các dữ liệu điểm số này về máy chủ (Server) của EnStudey.
              </li>
              <li>
                <strong>Dữ liệu cookie hệ thống:</strong> Để tối ưu hóa tốc độ tải trang cho các phiên truy cập kế tiếp và phục vụ mục đích phân tích kỹ thuật, hệ thống sử dụng các tệp văn bản nhỏ lưu tạm thời ẩn danh trên thiết bị của bạn (gọi là Cookie). Các dữ liệu này hoàn toàn ẩn danh và không thể dùng để định danh danh tính thực tế của người dùng.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Cam kết bảo mật và Chia sẻ thông tin từ bên thứ ba</h2>
            <p>
              Do tính chất vận hành ẩn danh, chúng tôi cam kết bảo vệ tuyệt đối không gian trải nghiệm của người dùng:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Không thực hiện các hành vi thu thập thông tin ngầm dưới mọi hình thức.</li>
              <li>Tuyệt đối không mua bán, trao đổi hoặc thương mại hóa dữ liệu hành vi ẩn danh của người dùng cho bất kỳ tổ chức cá nhân nào khác.</li>
              <li>Mọi thông tin phản hồi, góp ý của người dùng gửi về hòm thư hỗ trợ sẽ được giữ bảo mật và chỉ sử dụng nội bộ để nâng cấp chất lượng hệ thống.</li>
            </ul>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Điều khoản về Quảng cáo của bên thứ ba và Tiếp thị liên kết</h2>
            <p>
              Để duy trì hệ thống máy chủ vận hành liên tục 24/7 và cung cấp dịch vụ hoàn toàn miễn phí cho cộng đồng học sinh, EnStudey tích hợp các giải pháp thương mại hóa từ đối tác chính thức:
            </p>

            <div className="space-y-2 mt-2">
              <h3 className="text-sm font-bold text-slate-900">Đối tác Quảng cáo Google AdSense</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Các nhà cung cấp bên thứ ba, bao gồm cả Google, sử dụng cookie để phân phát quảng cáo dựa trên các lượt truy cập trước đó của người dùng vào website EnStudey hoặc các trang web khác trên mạng Internet.
                </li>
                <li>
                  Việc Google sử dụng cookie quảng cáo cho phép Google và các đối tác phân phát quảng cáo đến người dùng dựa trên thông tin truy cập một cách phù hợp và tối ưu trải nghiệm trực quan.
                </li>
                <li>
                  Người dùng có thể chủ động tắt tính năng quảng cáo cá nhân hóa bằng cách truy cập vào trang <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cài đặt quảng cáo của Google</a>.
                </li>
              </ul>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-bold text-slate-900">Đối tác Tiếp thị liên kết Shopee Affiliate</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Hệ thống có chứa các liên kết giới thiệu sản phẩm giáo dục, cẩm nang luyện đề, văn phòng phẩm và hành trang sinh viên dẫn sang sàn thương mại điện tử Shopee Việt Nam.
                </li>
                <li>
                  Khi người dùng click vào các liên kết này, Shopee sẽ sử dụng cookie theo dõi ẩn danh để ghi nhận nguồn giới thiệu theo quy định của chương trình Tiếp thị liên kết. Hoạt động này hoàn toàn không làm phát sinh thêm bất kỳ chi phí mua sắm nào cho người dùng cuối.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Quyền của chủ thể dữ liệu và Thông tin liên hệ</h2>
            <p>
              Theo quy định tại Nghị định số 13/2023/NĐ-CP của Chính phủ về bảo vệ dữ liệu cá nhân, người dùng (chủ thể dữ liệu) có đầy đủ các quyền hợp pháp đối với dữ liệu của mình trên nền tảng EnStudey, bao gồm:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Quyền truy cập và tự kiểm tra:</strong> Người dùng có quyền tự kiểm tra và quản lý thông tin phiên truy cập ẩn danh lưu trữ trên Cookie thiết bị của mình.
              </li>
              <li>
                <strong>Quyền phản đối hoặc hạn chế xử lý dữ liệu:</strong> Người dùng có toàn quyền chủ động kiểm soát hoặc từ chối cookie quảng cáo bằng cách cấu hình chặn cookie trực tiếp trên cài đặt của các trình duyệt (Chrome, Safari, Edge, v.v.) hoặc sử dụng trang tùy chỉnh của Google.
              </li>
              <li>
                <strong>Quyền yêu cầu xóa dữ liệu:</strong> Do EnStudey cam kết không lưu trữ dữ liệu điểm số hoặc nguyện vọng của người dùng trên máy chủ, người dùng có thể thực thi quyền tự xóa toàn bộ dữ liệu tương tác của mình bất kỳ lúc nào bằng cách thao tác xóa lịch sử duyệt web và tệp cookie trên thiết bị cá nhân.
              </li>
              <li>
                <strong>Quyền phản ánh và khiếu nại:</strong> Người dùng có quyền gửi yêu cầu hỗ trợ hoặc phản ánh về quy trình xử lý dữ liệu của nền tảng đến đại diện ban quản trị.
              </li>
            </ul>
            <p className="pt-2">
              Mọi thắc mắc, phản ánh về chính sách bảo mật thông tin hoặc báo cáo quảng cáo không phù hợp, xin vui lòng liên hệ ban quản trị đại diện theo thông tin chính thức dưới đây:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Tên dự án:</strong> EnStudey - Nền tảng hỗ trợ học tập cá nhân hóa</li>
              <li><strong>Người chịu trách nhiệm nội dung:</strong> Nguyễn Đức Tâm</li>
              <li><strong>Địa chỉ cư trú thực tế:</strong> Tổ 2, Phường Cầu Giấy, Thành phố Hà Nội, Việt Nam</li>
              <li><strong>Email hỗ trợ kỹ thuật:</strong> contact@enstudey.com</li>
            </ul>
          </section>

          <p className="font-bold text-blue-600 mt-6 text-center">
            Chúng tôi trân trọng sự đồng hành của bạn. Chúc các bạn sĩ tử có một mùa thi rực rỡ và đạt kết quả tối ưu!
          </p>
        </div>
      </div>
    </main>
  );
}
