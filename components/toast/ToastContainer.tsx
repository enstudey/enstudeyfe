"use client";

import React, { useEffect, useState } from "react";
import { ToastEventDetail, ToastType } from "@/lib/toast";

export default function ToastContainer() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastEventDetail>;
      const { message, type } = customEvent.detail;

      // Reset state để tạo cảm giác flash mượt mà nếu tin nhắn mới trùng tin nhắn cũ
      setVisible(false);
      
      setTimeout(() => {
        setToast({ message, type });
        setVisible(true);
      }, 50);

      // Xoá timeout cũ nếu có
      if (timer) clearTimeout(timer);

      // Tự động ẩn sau 5 giây
      timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    window.addEventListener("show-toast", handleShowToast);

    return () => {
      window.removeEventListener("show-toast", handleShowToast);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  // Cấu hình màu sắc & icon theo từng loại Toast
  const configs: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800/30",
      text: "text-emerald-800 dark:text-emerald-400",
      icon: "✓",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800/30",
      text: "text-red-800 dark:text-red-400",
      icon: "✕",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-955/20",
      border: "border-amber-200 dark:border-amber-800/30",
      text: "text-amber-800 dark:text-amber-400",
      icon: "⚠",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-955/20",
      border: "border-blue-200 dark:border-blue-800/30",
      text: "text-blue-800 dark:text-blue-400",
      icon: "ℹ",
    },
  };

  const config = configs[toast.type];

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] sm:w-[400px] transition-all duration-300 transform ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
      }`}
      role="alert"
    >
      <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${config.bg} ${config.border} backdrop-blur-sm`}>
        {/* Icon */}
        <div className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${config.text} border border-current mt-0.5`}>
          {config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold leading-relaxed ${config.text}`}>
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 text-xs font-bold opacity-60 hover:opacity-100 transition px-1 ${config.text}`}
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
