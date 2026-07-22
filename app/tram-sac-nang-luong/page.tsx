import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import donationsData from "@/data/donations.json";

export const metadata: Metadata = {
  title: "Trạm Sạc Năng Lượng EnStudey",
  description: "Bảng vinh danh các nhà tài trợ thầm lặng đã đồng hành cùng EnStudey duy trì nền tảng giáo dục mở miễn phí vĩnh viễn.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TramSacNangLuongPage() {
  const { donors, bank_name, account_name, account_no, qr_template_url } = donationsData;

  return (
    <main className="flex-grow pt-12 pb-0 w-full space-y-10">

      {/* 1. Phần đầu trang */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
            Tiếp sức cộng đồng 🥤
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            Trạm Sạc Năng Lượng EnStudey
          </h1>
        </div>

        <div className="prose max-w-none text-sm text-slate-600 leading-relaxed space-y-4 text-justify">
          <p>
            Chào các bạn sĩ tử và bạn học thân mến, EnStudey được khởi tạo với một mục tiêu đơn giản: <strong>tạo dựng một không gian học tập bình đẳng, nơi bất kỳ ai cũng có quyền truy cập miễn phí các công cụ và tài liệu luyện đề chất lượng cao</strong> mà không bị cản trở bởi rào cản tài chính hay bắt buộc phải trả phí duy trì hệ thống.
          </p>
          <p>
            Dự án này được lên ý tưởng, thiết kế và phát triển độc lập bởi một lập trình viên cá nhân. Chúng mình lựa chọn không chèn quảng cáo tràn lan gây ảnh hưởng đến trải nghiệm, không thu phí thành viên và hoàn toàn không ép buộc đăng nhập để tra cứu. Tuy nhiên, chi phí duy trì hạ tầng máy chủ hằng năm để phục vụ hàng chục ngàn lượt truy cập mỗi mùa thi là một thách thức không hề nhỏ.
          </p>
          <p>
            Trang <strong>&quot;Trạm sạc năng lượng&quot;</strong> này ra đời để ghi nhận những sự đóng góp quý báu từ các bạn học sinh và phụ huynh. Một ly cà phê nhỏ 10.000đ hay 20.000đ không chỉ giúp chúng mình duy trì hệ thống hàng tháng, mà còn là nguồn động viên tinh thần to lớn để tụi mình biết rằng sản phẩm này đang mang lại giá trị thực tế cho cộng đồng.
          </p>
          <p>
            Sự đồng hành của các bạn là minh chứng rõ ràng cho thấy tinh thần học tập tự nguyện và sẻ chia luôn tồn tại. Chúng mình trân trọng mọi sự tiếp sức, dù là nhỏ bé, để cùng nhau nâng bước cho các thế hệ học sinh tiếp theo tự tin chinh phục giảng đường Đại học.
          </p>
        </div>
      </div>

      {/* 2. Phần giữa trang */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Cột trái: Bảng vinh danh nhà tài trợ */}
        <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs space-y-6 h-full">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Góc Tri Ân Những Người Bạn Đồng Hành 🔋✨
            </h2>
            <p className="text-xs text-slate-500">Danh sách những người bạn đã đồng lòng tiếp sức cho EnStudey duy trì hệ thống:</p>
          </div>

          {/* Infinite Scroll Container */}
          <div className="relative h-[320px] overflow-hidden border-y border-slate-100 dark:border-zinc-800">
            <div className="animate-scroll-vertical space-y-3 py-4">
              {/* Nhân đôi danh sách để tạo loop nối đuôi mượt mà */}
              {Array.from({ length: Math.ceil((donors.length * 2) / 2) }).map((_, rowIndex) => {
                const duplicatedList = [...donors, ...donors];
                const first = duplicatedList[rowIndex * 2];
                const second = duplicatedList[rowIndex * 2 + 1];
                return (
                  <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {first && (
                      <div className="bg-slate-50/50 border border-slate-200/50 px-4 py-3.5 rounded-2xl flex items-center justify-between hover:border-indigo-500/20 transition duration-200">
                        <span className="font-bold text-slate-800 text-xs truncate">
                          {first.name}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md shrink-0">
                          {first.amount}
                        </span>
                      </div>
                    )}
                    {second && (
                      <div className="bg-slate-50/50 border border-slate-200/50 px-4 py-3.5 rounded-2xl flex items-center justify-between hover:border-indigo-500/20 transition duration-200">
                        <span className="font-bold text-slate-800 text-xs truncate">
                          {second.name}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md shrink-0">
                          {second.amount}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột phải: Mã QR ngân hàng */}
        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs space-y-6 flex flex-col items-center">
          <div className="text-center space-y-1 w-full">
            <h3 className="text-base font-bold text-slate-900">
              Tiếp sức tại đây ☕🚀
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed px-2">
              Quét mã dưới đây để mời EnStudey một ly cà phê muối nhé!
            </p>
          </div>

          {/* QR Code Container */}
          <a
            href="/qr-donate.webp"
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="mx-auto w-44 h-44 border-4 border-indigo-500/10 rounded-2xl overflow-hidden shadow-md bg-slate-50 flex items-center justify-center cursor-zoom-in block"
            title="Bấm để phóng to / mở ảnh QR trong tab mới"
          >
            <Image
              src={qr_template_url}
              alt="Mã QR chuyển khoản ủng hộ VietQR"
              width={160}
              height={160}
              priority
              className="object-contain"
            />
          </a>

          {/* Thông tin chuyển khoản */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 w-full">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Ngân hàng</span>
              <span className="font-bold text-slate-800">{bank_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chủ tài khoản</span>
              <span className="font-bold text-slate-800">{account_name}</span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-slate-500">Số tài khoản</span>
              <span className="font-bold text-indigo-600">{account_no}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Phần cuối trang */}
      <div className="text-[11px] text-slate-500 leading-relaxed text-center italic bg-card border border-border p-6 rounded-3xl">
        * Toàn bộ số tiền ủng hộ tại Trạm sạc năng lượng được cam kết sử dụng 100% vào chi phí duy trì máy chủ hằng tháng và nâng cấp hạ tầng phòng luyện đề miễn phí cho cộng đồng.
      </div>

    </main>
  );
}
