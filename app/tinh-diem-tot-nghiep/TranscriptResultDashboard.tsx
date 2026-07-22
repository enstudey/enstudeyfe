"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  computedScores: Record<string, number> | null;
  highestGroup: { name: string; score: number } | null;
  selectedGroup: string;
  setSelectedGroup: (val: string) => void;
}

export default function TranscriptResultDashboard({
  computedScores,
  highestGroup,
  selectedGroup,
  setSelectedGroup
}: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "A" | "B" | "C" | "D" | "X_TH">("all");

  if (!computedScores || !highestGroup) return null;

  // Bản đồ phân loại khối học bạ tương ứng
  const GROUP_MAPPING: Record<string, string[]> = {
    A: ["A00", "A01", "A02", "A0T", "A0C", "A10", "A09", "A08", "A11"],
    B: ["B00", "B08", "B03", "B01", "B02", "B04", "B0C"],
    C: ["C00", "C01", "C02", "C03", "C04", "C14", "C16", "C17", "C19", "C20", "C05", "C06", "C08"],
    D: ["D01", "D07", "D08", "D09", "D10", "D11", "D14", "D15", "D02", "D03", "D04", "D05", "D06", "DD2", "D66", "D84", "D0C", "DK"],
    X_TH: ["TH1", "TH3", "TH5", "TH6", "X02", "X03", "X10", "X01", "X21", "X25", "X70", "X74"]
  };

  const getVisibleScores = () => {
    let list = Object.entries(computedScores);
    if (activeTab !== "all") {
      const allowed = GROUP_MAPPING[activeTab] || [];
      list = list.filter(([grp]) => allowed.includes(grp));
    }
    // Sắp xếp điểm giảm dần
    return list.sort((a, b) => b[1] - a[1]);
  };

  const visibleScores = getVisibleScores();

  return (
    <div id="result-area" className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900 p-6 rounded-2xl text-white">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tổ hợp học bạ tối ưu của bạn
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
            type="button"
            onClick={() => setActiveTab(tab.id as "all" | "A" | "B" | "C" | "D" | "X_TH")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase block">
          Chọn tổ hợp để đối sánh điều kiện tuyển sinh chi tiết:
        </span>
        {visibleScores.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {visibleScores.map(([grp, val]) => (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedGroup(grp)}
                className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-1 transition duration-150 cursor-pointer text-center w-full ${selectedGroup === grp
                  ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                  }`}
              >
                <span className="font-bold text-xs text-slate-500">{grp}</span>
                <span className="font-extrabold text-lg text-indigo-600">
                  {val.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 font-semibold">
            Không có tổ hợp nào thuộc nhóm này có đủ điểm học bạ thành phần.
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400 italic text-center">
        * Kết quả tính điểm chỉ mang tính chất tham khảo và định hướng cá nhân. Vui lòng đối chiếu với đề án tuyển sinh chính thức của các trường Đại học.
      </div>

      <div className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl my-6">
        <span className="text-[10px] uppercase tracking-wider text-slate-650 select-none font-semibold">
          Liên kết tài trợ
        </span>
      </div>

    </div>
  );
}
