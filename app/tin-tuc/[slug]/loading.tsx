import React from "react";

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto py-12 w-full flex-grow space-y-6 animate-pulse">
      {/* Breadcrumb link */}
      <div>
        <div className="h-4 w-36 bg-slate-200 rounded" />
      </div>

      <article className="space-y-6">
        {/* Category Hashtag */}
        <div className="h-4 w-16 bg-slate-200 rounded" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-9 w-full bg-slate-200 rounded-lg" />
          <div className="h-9 w-2/3 bg-slate-200 rounded-lg" />
        </div>

        {/* Date */}
        <div className="h-3.5 w-24 bg-slate-200 rounded" />

        {/* Cover image placeholder */}
        <div className="w-full h-56 md:h-72 bg-slate-200 rounded-2xl" />

        {/* Table of Contents Placeholder */}
        <div className="p-5 border border-slate-200 rounded-xl space-y-3">
          <div className="h-5 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-36 bg-slate-200 rounded" />
        </div>

        {/* Under-title Ad Placeholder (CLS Protection) */}
        <div className="ad-container ad-under-title w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl mb-6">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
        </div>

        {/* Content Lines */}
        <div className="space-y-4 pt-4">
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-4/5 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
        </div>
      </article>

      {/* End-of-article Ad Placeholder (CLS Protection) */}
      <div className="ad-container ad-end w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl mt-8">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
      </div>

      {/* Related Articles Placeholder */}
      <div className="space-y-4 pt-8 border-t border-slate-200">
        <div className="h-6 w-36 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white h-52 flex flex-col justify-between">
              <div className="h-28 w-full bg-slate-200 animate-pulse" />
              <div className="p-4 flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
