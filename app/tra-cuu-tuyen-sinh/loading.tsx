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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-9 w-3/4 md:w-1/2 bg-slate-200 rounded-lg" />
            <div className="h-4 w-5/6 md:w-2/3 bg-slate-200 rounded" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 bg-slate-200 rounded-full" />
            ))}
          </div>
        </div>

        {/* User Scores Notice Bar Skeleton */}
        <div className="h-12 w-full bg-slate-200/50 border border-slate-200 rounded-2xl" />

        {/* Native Ad Slot Skeleton (CLS Protection) */}
        <div className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Liên kết tài trợ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Skeleton */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            ))}
            <div className="space-y-2">
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
              <div className="h-2 w-full bg-slate-200 rounded" />
            </div>
          </div>

          {/* Right Results Table Skeleton */}
          <div className="lg:col-span-9 overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[400px]">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between">
              <div className="h-4 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>

            {/* Table Rows Skeleton */}
            <div className="p-6 space-y-6 divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4 pt-4 first:pt-0">
                  <div className="h-5 bg-slate-200 rounded w-1/12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-2/12" />
                  <div className="h-5 bg-slate-200 rounded w-1/12" />
                </div>
              ))}
            </div>

            {/* Disclaimer Footer Skeleton */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200">
              <div className="h-3 w-full bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
