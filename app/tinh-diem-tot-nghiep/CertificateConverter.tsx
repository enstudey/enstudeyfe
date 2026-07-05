import React from "react";

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
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
        2. Quy đổi chứng chỉ tiếng Anh
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
            Chứng chỉ
          </label>
          <select
            value={certType}
            onChange={e => {
              setCertType(e.target.value as "none" | "ielts" | "toeic");
              setCertScore("");
            }}
            data-testid="select-cert-type"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-semibold"
          >
            <option value="none">Không có</option>
            <option value="ielts">IELTS</option>
            <option value="toeic">TOEIC</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
            Đề án của trường
          </label>
          <select
            value={conversionTarget}
            disabled={certType === "none"}
            onChange={e => setConversionTarget(e.target.value as "standard" | "neu" | "ftu" | "hust" | "hcmut")}
            data-testid="select-conversion-target"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 disabled:opacity-40 text-sm font-semibold"
          >
            <option value="standard">Quy chuẩn chung</option>
            <option value="neu">ĐH Kinh tế Quốc dân</option>
            <option value="ftu">ĐH Ngoại thương</option>
            <option value="hust">ĐH Bách khoa Hà Nội</option>
            <option value="hcmut">ĐH Bách khoa TPHCM</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
            Điểm số
          </label>
          <input
            type="number"
            step={certType === "ielts" ? "0.5" : "5"}
            placeholder={certType === "ielts" ? "6.5" : certType === "toeic" ? "850" : "N/A"}
            disabled={certType === "none"}
            value={certScore}
            onChange={e => setCertScore(e.target.value)}
            data-testid="input-cert-score"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 disabled:opacity-40 text-sm font-bold"
          />
        </div>
      </div>
      {certType !== "none" && (
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
          * Điểm quy đổi sẽ tự động áp dụng chính xác theo đề án riêng của từng trường đã chọn để tối ưu nhất cho bạn.
        </div>
      )}
    </div>
  );
}
