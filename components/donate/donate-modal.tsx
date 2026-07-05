"use client";

import React, { useState } from "react";
import Image from "next/image";

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
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          data-testid="btn-close-modal"
          className="absolute top-4 right-4 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 font-bold p-1 cursor-pointer transition-colors"
          aria-label="Đóng hộp thoại"
        >
          ✕
        </button>

        {/* Nội dung */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tiếp sức cho EnStudey ☕🚀
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-2">
            Nếu công cụ này vừa giúp bạn tiết kiệm thời gian hoặc gỡ rối mùa thi, bạn có thể &quot;tiếp sức&quot; cho mình một ly trà sữa nha!
          </p>

          {/* QR Code Container */}
          <div className="relative mx-auto w-48 h-48 border-4 border-orange-500/10 rounded-2xl overflow-hidden shadow-md bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
            <Image
              src="/qr-donate.png"
              alt="Mã QR chuyển khoản ủng hộ VietQR"
              fill
              sizes="(max-width: 192px) 100vw, 192px"
              priority
              className="object-cover"
            />
          </div>

          {/* Bank Info Container */}
          <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-850/80 text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-zinc-500">Ngân hàng</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">MBBank</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-zinc-500">Chủ tài khoản</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">NGUYEN DUC TAM</span>
            </div>
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100 dark:border-zinc-850/60">
              <span className="text-slate-400 dark:text-zinc-500">Số tài khoản</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-orange-600 dark:text-orange-500">{accountNo}</span>
                <button
                  onClick={handleCopy}
                  data-testid="btn-copy-account"
                  className="px-2.5 py-1 bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 font-bold rounded-lg text-[10px] cursor-pointer transition-colors"
                >
                  {copied ? "Đã chép ✓" : "Sao chép 📋"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
