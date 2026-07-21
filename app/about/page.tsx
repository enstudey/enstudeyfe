import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Giới thiệu về EnStudey - Nền tảng học tập & hướng nghiệp",
  description: "EnStudey cung cấp các công cụ hỗ trợ tính điểm xét tuyển tốt nghiệp THPT và cẩm nang tự học tiếng Anh hiệu quả.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <main className="py-12 w-full space-y-6 flex-grow">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        Về chúng mình – EnStudey: Nền tảng hỗ trợ học tập cá nhân hóa
      </h1>
      <p className="text-xs text-slate-600 font-semibold">Cập nhật lần cuối: Ngày 05 tháng 07 năm 2026</p>

      <div className="prose max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          Hello bạn nha! Chào mừng bạn đã &quot;hạ cánh&quot; tại <strong>EnStudey</strong>! 🚀
        </p>
        <p>
          Giữa vô vàn những trang web giáo dục ngoài kia, EnStudey được ra đời với một mục tiêu cực kỳ đơn giản: Trở thành một người bạn đồng hành thực chiến, giúp bạn gỡ rối mớ kiến thức tiếng Anh và đánh bay áp lực mỗi khi mùa thi đại học đến.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Ở phiên bản hiện tại, EnStudey mang đến cho bạn những công cụ nào?</h2>
          <p>Chúng mình tập trung phát triển 3 tiện ích cốt lõi, hoạt động trơn tru và hoàn toàn miễn phí:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              📚 <strong>Góc Kiến thức & Blog:</strong> Nơi tụi mình tổng hợp, chắt lọc những cấu trúc ngữ pháp &quot;ăn điểm&quot;, từ vựng thông dụng và các mẹo làm bài thi hiệu quả. Tất cả được trình bày ngắn gọn, dễ hiểu để bạn đọc phát là nhớ ngay.
            </li>
            <li>
              🧮 <strong>Công cụ Tính điểm Tốt nghiệp/Đại học:</strong> Chẳng cần phải bấm máy tính thủ công đau đầu nữa! Bạn chỉ cần nhập điểm các môn và khu vực ưu tiên, công cụ của tụi mình sẽ tự động tính toán và trả về kết quả điểm xét tuyển chính xác một cách nhanh chóng.
            </li>
            <li>
              🎯 <strong>Tra cứu Tuyển sinh Thông minh:</strong> Nhập điểm của bạn vào và để hệ thống lo phần còn lại. EnStudey sẽ lọc ra các trường Đại học, ngành học và tổ hợp phù hợp, đồng thời gợi ý luôn cho bạn 3 vùng ranh giới: Vùng an toàn (Xanh), Vùng cọ xát (Vàng) và Vùng rủi ro (Đỏ) dựa trên dữ liệu điểm chuẩn các năm trước.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Cam kết của chúng mình</h2>
          <p>
            EnStudey được xây dựng bởi những người trẻ, dành cho những người trẻ. Vì vậy, chúng mình cam kết duy trì nền tảng này <strong>100% miễn phí</strong>. Để làm được điều đó và có chi phí duy trì hệ thống máy chủ, trang web sẽ có hiển thị một số quảng cáo từ đối tác Google AdSense. Tụi mình hứa sẽ luôn sắp xếp các vị trí quảng cáo thật tinh tế để không làm phiền trải nghiệm học tập và tra cứu của bạn nghen!
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-slate-200 space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Kết nối với EnStudey</h2>
          <p>
            Nếu bạn có bất kỳ thắc mắc nào, thấy hệ thống tính sai điểm, hoặc chỉ đơn giản là muốn góp ý để web hoàn thiện hơn, đừng ngại &quot;ới&quot; chúng mình qua các kênh dưới đây nha:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chịu trách nhiệm nội dung:</strong> Nguyễn Đức Tâm</li>
            <li><strong>Địa chỉ:</strong> Tổ 2, Phường Cầu Giấy, TP. Hà Nội, Việt Nam</li>
            <li><strong>Email hỗ trợ:</strong> contact@enstudey.com</li>
          </ul>
        </section>

        {/* Khung link điều hướng Trạm sạc */}
        <div className="bg-blue-50 border border-blue-500/10 rounded-2xl p-5 text-center mt-6">
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            Để EnStudey có thể duy trì hoạt động lâu dài hoàn toàn miễn phí cho các thế hệ học sinh tiếp theo, bạn có thể ủng hộ tụi mình một ly cà phê muối nha.
          </p>
          <Button asChild size="sm" className="font-bold rounded-xl cursor-pointer">
            <Link
              href="/tram-sac-nang-luong"
              rel="sponsored nofollow"
            >
              Ghé thăm Trạm sạc năng lượng EnStudey 🥤✨
            </Link>
          </Button>
        </div>

        <p className="font-bold text-blue-600 mt-6">
          Cứ tự nhiên học tập và tra cứu nhé. Chúc bạn một mùa thi rực rỡ và đỗ ngay nguyện vọng 1! ✨
        </p>
      </div>
    </main>
  );
}
