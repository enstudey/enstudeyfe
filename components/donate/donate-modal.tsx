"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const accountNo = "70026112004";

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Lỗi khi sao chép số tài khoản:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4"
      data-testid="donate-modal"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          data-testid="btn-close-modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-bold p-1 cursor-pointer transition-colors"
          aria-label="Đóng hộp thoại"
        >
          ✕
        </button>

        {/* Nội dung */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Tiếp sức cho EnStudey ☕🚀
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            Nếu công cụ này vừa giúp bạn tiết kiệm thời gian hoặc gỡ rối mùa thi, bạn có thể &quot;tiếp sức&quot; cho mình một ly trà sữa nha!
          </p>

          {/* QR Code Container */}
          <a
            href="/qr-donate.webp"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto w-48 h-48 border-4 border-blue-500/10 rounded-2xl overflow-hidden shadow-md bg-slate-50 flex items-center justify-center cursor-zoom-in block"
            title="Bấm để phóng to / mở ảnh QR trong tab mới"
          >
            <Image
              src="/qr-donate.webp"
              alt="Mã QR chuyển khoản ủng hộ VietQR"
              width={176}
              height={176}
              priority
              className="object-contain"
            />
          </a>

          {/* Link vinh danh */}
          <div className="pt-1">
            <Link
              href="/tram-sac-nang-luong"
              onClick={onClose}
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              🌟 Xem danh sách các Nhà tài trợ thầm lặng tại đây
            </Link>
          </div>

          {/* Bank Info Container */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Ngân hàng</span>
              <span className="font-bold text-slate-800">MBBank</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Chủ tài khoản</span>
              <span className="font-bold text-slate-800">NGUYEN DUC TAM</span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-slate-600">Số tài khoản</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-blue-600">{accountNo}</span>
                <Button
                  onClick={handleCopy}
                  data-testid="btn-copy-account"
                  variant="secondary"
                  className="px-2.5 py-1 text-blue-750 bg-blue-100 hover:bg-blue-200 transition font-bold rounded-lg text-[10px] cursor-pointer"
                >
                  {copied ? "Đã chép ✓" : "Sao chép 📋"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
