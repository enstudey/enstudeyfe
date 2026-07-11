import React from "react";

export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 bg-white text-slate-900 min-h-screen animate-pulse">
      {/* Title */}
      <div className="h-9 w-64 bg-slate-200 rounded-lg mb-6" />

      {/* Categories Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-slate-200 rounded-full" />
        ))}
      </div>

      {/* Grid Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-slate-150 bg-slate-50/50 rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-6 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
