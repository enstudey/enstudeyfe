import React from "react";

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen animate-pulse">
      {/* Back Link */}
      <div className="mb-6">
        <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded" />
      </div>

      <article className="space-y-6">
        {/* Category Label */}
        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-9 w-full bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-9 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        </div>

        {/* Content lines */}
        <div className="space-y-4 pt-4">
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded" />
        </div>
      </article>

      {/* Ad slot placeholder (CLS Protection) */}
      <div className="mt-10 min-h-[250px] w-full bg-slate-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 dark:border-zinc-800">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
      </div>
    </main>
  );
}
