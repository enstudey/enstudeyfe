import React from "react";

interface Props {
  areaPriority: "KV3" | "KV2" | "KV2-NT" | "KV1";
  setAreaPriority: (val: "KV3" | "KV2" | "KV2-NT" | "KV1") => void;
  objectPriority: "none" | "UT1" | "UT2";
  setObjectPriority: (val: "none" | "UT1" | "UT2") => void;
}

export default function PrioritySelector({
  areaPriority,
  setAreaPriority,
  objectPriority,
  setObjectPriority
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
        3. Chọn khu vực & Đối tượng ưu tiên
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
            Khu vực
          </label>
          <select
            value={areaPriority}
            onChange={e => setAreaPriority(e.target.value as "KV3" | "KV2" | "KV2-NT" | "KV1")}
            data-testid="select-area"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-semibold"
          >
            <option value="KV3">Khu vực 3 (0.0 điểm)</option>
            <option value="KV2">Khu vực 2 (0.25 điểm)</option>
            <option value="KV2-NT">Khu vực 2 Nông thôn (0.5 điểm)</option>
            <option value="KV1">Khu vực 1 (0.75 điểm)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
            Đối tượng ưu tiên
          </label>
          <select
            value={objectPriority}
            onChange={e => setObjectPriority(e.target.value as "none" | "UT1" | "UT2")}
            data-testid="select-object"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-semibold"
          >
            <option value="none">Không ưu tiên (0.0 điểm)</option>
            <option value="UT1">Nhóm ưu tiên 1: ĐT 01 - 04 (2.0 điểm)</option>
            <option value="UT2">Nhóm ưu tiên 2: ĐT 05 - 07 (1.0 điểm)</option>
          </select>
        </div>
      </div>
      <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
        * Điểm ưu tiên tự động giảm dần tuyến tính nếu tổng điểm 3 môn từ 22.5 điểm trở lên, khống chế trần tổng điểm cộng tối đa 3.0 điểm.
      </div>
    </div>
  );
}
