import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-violet-600 pl-3">
        3. Chọn khu vực & Đối tượng ưu tiên tuyển sinh
      </h3>
      <div className="grid grid-cols-1 md:flex md:gap-5">
        <div className="space-y-1 w-full md:flex-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Phân loại Khu vực ưu tiên tuyển sinh
          </label>
          <Select value={areaPriority} onValueChange={(val) => setAreaPriority(val as "KV3" | "KV2" | "KV2-NT" | "KV1")}>
            <SelectTrigger
              data-testid="select-area"
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-left"
            >
              <SelectValue placeholder="Chọn khu vực">
                {areaPriority === "KV3" && "Khu vực 3 (Không cộng điểm ưu tiên - 0.0 điểm)"}
                {areaPriority === "KV2" && "Khu vực 2 (Cộng thêm 0.25 điểm ưu tiên)"}
                {areaPriority === "KV2-NT" && "Khu vực 2 Nông thôn (Cộng thêm 0.5 điểm ưu tiên)"}
                {areaPriority === "KV1" && "Khu vực 1 (Cộng thêm 0.75 điểm ưu tiên)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KV3">Khu vực 3 (Không cộng điểm ưu tiên - 0.0 điểm)</SelectItem>
              <SelectItem value="KV2">Khu vực 2 (Cộng thêm 0.25 điểm ưu tiên)</SelectItem>
              <SelectItem value="KV2-NT">Khu vực 2 Nông thôn (Cộng thêm 0.5 điểm ưu tiên)</SelectItem>
              <SelectItem value="KV1">Khu vực 1 (Cộng thêm 0.75 điểm ưu tiên)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1 w-full md:flex-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Nhóm Đối tượng được ưu tiên tuyển sinh
          </label>
          <Select value={objectPriority} onValueChange={(val) => setObjectPriority(val as "none" | "UT1" | "UT2")}>
            <SelectTrigger
              data-testid="select-object"
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-left"
            >
              <SelectValue placeholder="Chọn đối tượng">
                {objectPriority === "none" && "Không thuộc diện đối tượng ưu tiên (0.0 điểm)"}
                {objectPriority === "UT1" && "Nhóm ưu tiên 1: Gồm các đối tượng từ 01 đến 04 (Cộng 2.0 điểm)"}
                {objectPriority === "UT2" && "Nhóm ưu tiên 2: Gồm các đối tượng từ 05 đến 07 (Cộng 1.0 điểm)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không thuộc diện đối tượng ưu tiên (0.0 điểm)</SelectItem>
              <SelectItem value="UT1">Nhóm ưu tiên 1: Gồm các đối tượng từ 01 đến 04 (Cộng 2.0 điểm)</SelectItem>
              <SelectItem value="UT2">Nhóm ưu tiên 2: Gồm các đối tượng từ 05 đến 07 (Cộng 1.0 điểm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-[11px] text-slate-500 font-medium">
        * Điểm ưu tiên tự động giảm dần tuyến tính nếu tổng điểm 3 môn đạt từ 22.5 điểm trở lên, khống chế trần tổng điểm cộng tối đa 3.0 điểm.
      </div>
    </div>
  );
}
