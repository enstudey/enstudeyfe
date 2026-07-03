import React from "react";

export default function AdBanner() {
  return (
    <div 
      className="w-full min-h-[250px] bg-slate-50 dark:bg-zinc-900 flex items-center justify-center my-6 rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-800"
      data-testid="ad-banner"
    >
      <span className="text-xs text-slate-400 dark:text-zinc-500">Quảng cáo nè! 🚀</span>
    </div>
  );
}

