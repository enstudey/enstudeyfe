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
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
        2. Quy đổi chứng chỉ tiếng Anh
      </h3>
      
      <div className="space-y-4">
        {/* Nút bấm Card chọn loại chứng chỉ */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
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
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-955/20 text-orange-600 dark:text-orange-500 shadow-sm"
                    : "border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400"
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
              <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
                Đề án quy đổi của trường
              </label>
              <select
                value={conversionTarget}
                onChange={e => setConversionTarget(e.target.value as "standard" | "neu" | "ftu" | "hust" | "hcmut")}
                data-testid="select-conversion-target"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-semibold"
              >
                <option value="standard">Quy chuẩn chung của Bộ GD&ĐT</option>
                <option value="neu">Đại học Kinh tế Quốc dân (NEU)</option>
                <option value="ftu">Trường Đại học Ngoại thương (FTU)</option>
                <option value="hust">Đại học Bách khoa Hà Nội (HUST)</option>
                <option value="hcmut">Đại học Bách khoa TPHCM (HCMUT)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
                Điểm số chứng chỉ đạt được
              </label>
              <input
                type="number"
                step={certType === "ielts" ? "0.5" : "5"}
                placeholder={certType === "ielts" ? "6.5" : "850"}
                value={certScore}
                onChange={e => setCertScore(e.target.value)}
                data-testid="input-cert-score"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {certType !== "none" && (
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
          * Hệ thống tự động áp dụng công thức quy đổi tối ưu cho bạn dựa trên đề án riêng của trường đã chọn.
        </div>
      )}
    </div>
  );
}
