"use client";

import React, { useState } from "react";
import { useDonateUX } from "@/hooks/useDonateUX";
import { DonateModal } from "./index";

export default function DonateCardDetailed() {
  const { shouldShow, handleCloseAction } = useDonateUX();
  const [isOpen, setIsOpen] = useState(false);

  if (!shouldShow) return null;

  const handleDonateClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 relative shadow-sm transition duration-300 hover:shadow-md"
        data-testid="donate-card-detailed"
      >
        {/* Nút đóng X ở góc trên bên phải */}
        <button
          onClick={handleCloseAction}
          className="absolute top-4 right-4 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 w-6 h-6 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center text-sm transition cursor-pointer"
          title="Đóng thông điệp"
          aria-label="Đóng"
        >
          &times;
        </button>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pr-6">
              Bạn vừa hoàn thành một bước tiến nhỏ hôm nay! 🚀
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify">
              Chào bạn, <strong>EnStudey</strong> được xây dựng và vận hành độc lập bởi <strong>một cá nhân</strong>. Tụi mình lựa chọn không thu phí và không bắt đăng nhập để bất kỳ sĩ tử nào cũng có thể học tập bình đẳng.
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify">
              Hệ thống sống sót được hoàn toàn nhờ sự đồng lòng của những người học tử tế. Gửi tặng tụi mình một ly cà phê nhỏ chính là cách bạn <strong>trực tiếp giữ cho nền tảng này luôn mở và miễn phí vĩnh viễn cho hàng ngàn bạn học sinh khác</strong>.
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify">
              Cảm ơn bạn đã trở thành một &quot;nhà tài trợ&quot; thầm lặng của cộng đồng! ✨
            </p>
          </div>

          <button
            onClick={handleDonateClick}
            data-testid="btn-donate-detailed"
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 text-center block cursor-pointer"
          >
            Mời EnStudey một ly cà phê
          </button>
        </div>
      </div>

      <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
