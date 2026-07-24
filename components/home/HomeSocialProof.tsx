import { ShieldCheck, BrainCircuit, RefreshCw, Zap } from "lucide-react";

export default function HomeSocialProof() {
  const trustAnchors = [
    {
      icon: ShieldCheck,
      value: "Đề chuẩn ETS 2026",
      label: "Cấu trúc 200 câu đếm giờ áp lực thật",
      color: "text-[#3349D8]",
      bgColor: "bg-[#EEF2FF]",
    },
    {
      icon: BrainCircuit,
      value: "100% Tiếng Việt",
      label: "AI phân tích chi tiết bẫy Part 1-7",
      color: "text-[#0E9F9A]",
      bgColor: "bg-[#EEFDF8]",
    },
    {
      icon: RefreshCw,
      value: "Thuật toán SM-2",
      label: "Tự động nhắc ôn câu sai đúng thời điểm",
      color: "text-[#D97706]",
      bgColor: "bg-[#FFFBEB]",
    },
    {
      icon: Zap,
      value: "15 Phút mỗi ngày",
      label: "Tiết kiệm 50% thời gian luyện đề dông dài",
      color: "text-[#1D8F6A]",
      bgColor: "bg-[#E6F4EA]",
    },
  ];

  return (
    <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E8F1]">
        {trustAnchors.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 ${
                index > 0 ? "pt-3 sm:pt-0 sm:pl-4" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0`}
              >
                <IconComponent className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#16213A] tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] font-medium text-[#5C667A] line-clamp-1">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
