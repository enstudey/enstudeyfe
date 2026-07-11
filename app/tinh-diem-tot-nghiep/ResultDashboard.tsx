import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div id="result-area" className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">

      {appliedEquivNote && (
        <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-2.5 rounded-xl font-medium">
          {appliedEquivNote}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900 p-6 rounded-2xl text-white">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tổ hợp tối ưu của bạn
          </p>
          <h3 className="text-3xl font-extrabold mt-1">
            {highestGroup.name}: {highestGroup.score.toFixed(2)} Điểm
          </h3>
        </div>
        <Button asChild size="sm" className="font-bold uppercase tracking-wider rounded-xl transition duration-200">
          <Link href="/tra-cuu-tuyen-sinh">
            Tra cứu trường &rarr;
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 text-xs font-bold">
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
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-1"
            >
              <span className="font-bold text-xs text-slate-500">{grp}</span>
              <span className="font-extrabold text-lg text-violet-600">
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-400 font-semibold">
          Không có tổ hợp nào thuộc nhóm này có đủ điểm thi thành phần.
        </div>
      )}

      {/* Button Donate Tiếp Sức cho Admin */}
      {isAvailable && (
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsDonateOpen(true)}
            variant="secondary"
            className="px-5 py-5 rounded-xl font-bold uppercase tracking-wider text-violet-700 bg-violet-100 hover:bg-violet-200 transition"
          >
            ☕ Tiếp sỹ cho Admin
          </Button>
        </div>
      )}

      <div className="text-[11px] text-slate-400 italic text-center">
        * Kết quả tính điểm chỉ mang tính chất tham khảo và định hướng cá nhân. Vui lòng đối chiếu với đề án tuyển sinh chính thức của các trường Đại học.
      </div>

      <AffiliateBox />

      <div className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl my-6">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">
          Liên kết tài trợ
        </span>
      </div>

      {/* Modal Donate */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
