import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  certType: "none" | "ielts" | "toeic";
  setCertType: (val: "none" | "ielts" | "toeic") => void;
  certScore: string;
  setCertScore: (val: string) => void;
  conversionTarget: "standard" | "neu" | "ftu" | "hust" | "hcmut";
  setConversionTarget: (val: "standard" | "neu" | "ftu" | "hust" | "hcmut") => void;
}

export default function CertificateConverter({
  certType,
  setCertType,
  certScore,
  setCertScore,
  conversionTarget,
  setConversionTarget
}: Props) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-violet-600 pl-3">
        2. Quy đổi chứng chỉ tiếng Anh
      </h3>
      
      <div className="space-y-4">
        {/* Nút bấm Card chọn loại chứng chỉ */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Loại chứng chỉ ngoại ngữ
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "none", name: "Không có" },
              { id: "ielts", name: "IELTS Academic" },
              { id: "toeic", name: "TOEIC (Nghe & Đọc)" }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCertType(item.id as "none" | "ielts" | "toeic");
                  setCertScore("");
                }}
                className={`px-4 py-3 rounded-xl border text-center font-bold text-xs transition duration-150 cursor-pointer ${
                  certType === item.id
                    ? "border-violet-600 bg-violet-50 text-violet-750 shadow-sm"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Các dropdown thông tin quy đổi */}
        {certType !== "none" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                Đề án quy đổi của trường
              </label>
              <Select value={conversionTarget} onValueChange={(val) => setConversionTarget(val as "standard" | "neu" | "ftu" | "hust" | "hcmut")}>
                <SelectTrigger
                  data-testid="select-conversion-target"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-left"
                >
                  <SelectValue placeholder="Chọn đề án quy đổi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Quy chuẩn chung của Bộ GD&ĐT</SelectItem>
                  <SelectItem value="neu">Đại học Kinh tế Quốc dân (NEU)</SelectItem>
                  <SelectItem value="ftu">Trường Đại học Ngoại thương (FTU)</SelectItem>
                  <SelectItem value="hust">Đại học Bách khoa Hà Nội (HUST)</SelectItem>
                  <SelectItem value="hcmut">Đại học Bách khoa TPHCM (HCMUT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                Điểm số chứng chỉ đạt được
              </label>
              <Input
                type="number"
                step={certType === "ielts" ? "0.5" : "5"}
                placeholder={certType === "ielts" ? "6.5" : "850"}
                value={certScore}
                onChange={e => setCertScore(e.target.value)}
                data-testid="input-cert-score"
                className="font-bold text-sm h-10"
              />
            </div>
          </div>
        )}
      </div>

      {certType !== "none" && (
        <div className="text-[11px] text-slate-500 font-medium">
          * Hệ thống tự động áp dụng công thức quy đổi tối ưu cho bạn dựa trên đề án riêng của trường đã chọn.
        </div>
      )}
    </div>
  );
}
