import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />
      
      {/* Main Content Skeleton */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8 animate-pulse">
        {/* Header Title Skeleton */}
        <div className="space-y-3">
          <div className="h-9 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>

        {/* Leaderboard Ad Placeholder (CLS Protection) */}
        <div className="ad-container ad-leaderboard w-full min-h-[90px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl py-2 mb-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
        </div>

        {/* Filter Categories Skeleton */}
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-slate-200 rounded-full"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Feed Grid Skeleton */}
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white h-[380px] flex flex-col justify-between"
                >
                  <div className="h-44 w-full bg-slate-200" />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="h-4 w-1/4 bg-slate-200 rounded-lg" />
                      <div className="h-6 w-3/4 bg-slate-200 rounded" />
                      <div className="h-4 w-full bg-slate-200 rounded" />
                      <div className="h-4 w-5/6 bg-slate-200 rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 w-16 bg-slate-200 rounded" />
                      <div className="h-4 w-16 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton (Affiliate Sidebar widget space) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-4">
              <div className="h-5 w-2/3 bg-slate-200 rounded" />
              <div className="h-32 w-full bg-slate-200 rounded-xl" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-8 w-full bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
