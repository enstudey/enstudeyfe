import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  scores: {
    math: string;
    literature: string;
    english: string;
    otherLanguage: string;
    physics: string;
    chemistry: string;
    biology: string;
    history: string;
    geography: string;
    gdktpl: string;
    informatics: string;
    techIndustrial: string;
    techAgricultural: string;
  };
  errors: Record<string, string>;
  otherLanguageType: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian";
  setOtherLanguageType: (val: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian") => void;
  handleScoreChange: (subject: keyof Props["scores"], val: string) => void;
  handleScoreBlur?: (subject: keyof Props["scores"], val: string) => void;
}

export default function SubjectScoresInput({
  scores,
  errors,
  otherLanguageType,
  setOtherLanguageType,
  handleScoreChange,
  handleScoreBlur
}: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-violet-600 pl-3">
        1. Nhập điểm thi THPT quốc gia (Thang điểm 10)
      </h3>

      <div className="space-y-4">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
          Môn thi cơ bản
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { id: "math", name: "Toán (Bắt buộc)" },
            { id: "literature", name: "Ngữ văn (Bắt buộc)" },
            { id: "english", name: "Tiếng Anh" },
            { id: "physics", name: "Vật lý" },
            { id: "chemistry", name: "Hóa học" },
            { id: "biology", name: "Sinh học" },
            { id: "history", name: "Lịch sử" },
            { id: "geography", name: "Địa lý" },
            { id: "gdktpl", name: "GDKTPL" },
            { id: "informatics", name: "Tin học" }
          ].map(sub => (
            <div key={sub.id} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                {sub.name}
              </label>
              <Input
                type="text"
                placeholder="0.0"
                value={scores[sub.id as keyof typeof scores]}
                onChange={e => handleScoreChange(sub.id as keyof typeof scores, e.target.value)}
                onBlur={e => handleScoreBlur && handleScoreBlur(sub.id as keyof typeof scores, e.target.value)}
                id={`input-score-${sub.id}`}
                data-testid={`input-score-${sub.id}`}
                className={`font-bold text-base h-10 ${
                  errors[sub.id]
                    ? "border-red-500 focus-visible:border-red-500 text-red-500"
                    : "border-slate-200"
                }`}
              />
              {errors[sub.id] && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">{errors[sub.id]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
          Môn tự chọn mới & Ngoại ngữ phụ
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Công nghệ Công nghiệp
            </label>
            <Input
              type="text"
              placeholder="0.0"
              value={scores.techIndustrial}
              onChange={e => handleScoreChange("techIndustrial", e.target.value)}
              onBlur={e => handleScoreBlur && handleScoreBlur("techIndustrial", e.target.value)}
              id="input-score-techIndustrial"
              data-testid="input-score-techIndustrial"
              className={`font-bold text-base h-10 ${
                errors.techIndustrial
                  ? "border-red-500 focus-visible:border-red-500 text-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.techIndustrial && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.techIndustrial}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Công nghệ Nông nghiệp
            </label>
            <Input
              type="text"
              placeholder="0.0"
              value={scores.techAgricultural}
              onChange={e => handleScoreChange("techAgricultural", e.target.value)}
              onBlur={e => handleScoreBlur && handleScoreBlur("techAgricultural", e.target.value)}
              id="input-score-techAgricultural"
              data-testid="input-score-techAgricultural"
              className={`font-bold text-base h-10 ${
                errors.techAgricultural
                  ? "border-red-500 focus-visible:border-red-500 text-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.techAgricultural && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.techAgricultural}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Loại ngoại ngữ khác
            </label>
            <Select value={otherLanguageType} onValueChange={(val) => setOtherLanguageType(val as "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian")}>
              <SelectTrigger
                data-testid="select-other-lang-type"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left"
              >
                <SelectValue placeholder="Chọn ngoại ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Korean">Tiếng Hàn</SelectItem>
                <SelectItem value="Chinese">Tiếng Trung</SelectItem>
                <SelectItem value="Japanese">Tiếng Nhật</SelectItem>
                <SelectItem value="French">Tiếng Pháp</SelectItem>
                <SelectItem value="German">Tiếng Đức</SelectItem>
                <SelectItem value="Russian">Tiếng Nga</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Điểm ngoại ngữ khác
            </label>
            <Input
              type="text"
              placeholder="0.0"
              value={scores.otherLanguage}
              onChange={e => handleScoreChange("otherLanguage", e.target.value)}
              onBlur={e => handleScoreBlur && handleScoreBlur("otherLanguage", e.target.value)}
              id="input-score-otherLanguage"
              data-testid="input-score-otherLanguage"
              className={`font-bold text-base h-10 ${
                errors.otherLanguage
                  ? "border-red-500 focus-visible:border-red-500 text-red-500"
                  : "border-slate-200"
              }`}
            />
            {errors.otherLanguage && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.otherLanguage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
