"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      id="btn-go-back"
      className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm rounded-xl transition-all btn-interactive cursor-pointer shadow-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Quay lại trang trước</span>
    </button>
  );
}
