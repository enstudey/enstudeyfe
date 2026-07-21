"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDonateUX } from "@/hooks/useDonateUX";
import { DonateModal } from "./index";

export default function DonateBarMinimal() {
  const { shouldShow, handleCloseAction } = useDonateUX();
  const [isOpen, setIsOpen] = useState(false);

  if (!shouldShow) return null;

  const handleDonateClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="w-full bg-blue-50/40 border border-blue-500/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300"
        data-testid="donate-bar-minimal"
      >
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            Dự án này được vận hành 0đ bởi một lập trình viên ☕
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gửi tặng tụi mình một ly cà phê để cùng giữ cho công cụ này luôn mở và miễn phí vĩnh viễn cho các thế hệ sĩ tử tiếp theo bạn nhé!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleCloseAction}
            variant="outline"
            className="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Đóng lại
          </Button>
          <Button
            onClick={handleDonateClick}
            data-testid="btn-donate-minimal"
            className="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Góp 1 ly cà phê duy trì máy chủ
          </Button>
        </div>
      </div>

      <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
