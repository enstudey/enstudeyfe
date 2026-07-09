import React, { useState } from "react";
import Link from "next/link";
import { DonateModal, useDonateStatus } from "@/components/donate";
import AffiliateBox from "@/components/affiliate/AffiliateBox";

interface Props {
  computedScores: Record<string, number> | null;
  highestGroup: { name: string; score: number } | null;
  appliedEquivNote: string | null;
  activeTab: "all" | "A" | "B" | "C" | "D" | "X_TH";
  setActiveTab: (val: "all" | "A" | "B" | "C" | "D" | "X_TH") => void;
  visibleScores: [string, number][];
}

export default function ResultDashboard({
  computedScores,
  highestGroup,
  appliedEquivNote,
  activeTab,
  setActiveTab,
  visibleScores
}: Props) {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const { isAvailable } = useDonateStatus();

  if (!computedScores || !highestGroup) return null;

  return (
    <div id="result-area" className="space-y-6 pt-4 border-t border-slate-100 dark:border-zinc-700 animate-fade-in">

      {appliedEquivNote && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-2.5 rounded-xl font-medium">
          {appliedEquivNote}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900 dark:bg-zinc-950 p-6 rounded-2xl text-white">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tổ hợp tối ưu của bạn
          </p>
          <h3 className="text-3xl font-extrabold mt-1">
            {highestGroup.name}: {highestGroup.score.toFixed(2)} Điểm
          </h3>
        </div>
        <Link
          href="/tra-cuu-tuyen-sinh"
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
        >
          Tra cứu trường &rarr;
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-zinc-700 pb-3 text-xs font-bold">
        {[
          { id: "all", name: "Tất cả tổ hợp" },
          { id: "A", name: "Khối A" },
          { id: "B", name: "Khối B" },
          { id: "C", name: "Khối C" },
          { id: "D", name: "Khối D" },
          { id: "X_TH", name: "Khối X & TH" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | "A" | "B" | "C" | "D" | "X_TH")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id
                ? "bg-orange-600 text-white"
                : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-850"
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {visibleScores.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {visibleScores.map(([grp, val]) => (
            <div
              key={grp}
              className="p-4 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-1"
            >
              <span className="font-bold text-xs text-slate-500 dark:text-zinc-400">{grp}</span>
              <span className="font-extrabold text-lg text-orange-600 dark:text-orange-500">
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-400 dark:text-zinc-500 font-semibold">
          Không có tổ hợp nào thuộc nhóm này có đủ điểm thi thành phần.
        </div>
      )}

      {/* Button Donate Tiếp Sức cho Admin */}
      {isAvailable && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsDonateOpen(true)}
            className="px-5 py-2.5 bg-orange-600/10 hover:bg-orange-600/20 text-orange-700 dark:text-orange-400 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
          >
            ☕ Tiếp sức cho Admin
          </button>
        </div>
      )}

      <div className="text-[11px] text-slate-400 dark:text-zinc-500 italic text-center">
        * Kết quả tính điểm chỉ mang tính chất tham khảo và định hướng cá nhân. Vui lòng đối chiếu với đề án tuyển sinh chính thức của các trường Đại học.
      </div>

      <AffiliateBox />

      <div className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-700 flex items-center justify-center rounded-xl my-6">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">
          Liên kết tài trợ
        </span>
      </div>

      {/* Modal Donate */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
