"use client";

import React, { useState } from "react";
import { useDonateUX } from "@/hooks/useDonateUX";
import { DonateModal } from "./index";

export default function DonateBarMinimal() {
  const { shouldShow, handleDonateAction, handleCloseAction } = useDonateUX();
  const [isOpen, setIsOpen] = useState(false);

  if (!shouldShow) return null;

  const handleDonateClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="w-full bg-orange-50/40 dark:bg-zinc-900/30 border border-orange-500/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300"
        data-testid="donate-bar-minimal"
      >
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Dự án này được vận hành 0đ bởi 1 lập trình viên duy nhất ☕
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Gửi tặng tụi mình một ly cà phê để cùng giữ cho công cụ này luôn mở và miễn phí vĩnh viễn cho các thế hệ sĩ tử tiếp theo bạn nhé!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCloseAction}
            className="px-4 py-2 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Đóng lại
          </button>
          <button
            onClick={handleDonateClick}
            data-testid="btn-donate-minimal"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Góp 1 ly cà phê duy trì máy chủ
          </button>
        </div>
      </div>

      <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
