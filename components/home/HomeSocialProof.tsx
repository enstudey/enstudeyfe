import { Users, FileCheck, Star, Award } from "lucide-react";

export default function HomeSocialProof() {
  const stats = [
    {
      icon: Users,
      value: "12,450+",
      label: "Học viên active ôn luyện",
      color: "text-[#3349D8]",
      bgColor: "bg-[#EEF2FF]",
    },
    {
      icon: FileCheck,
      value: "8,200+",
      label: "Lượt thi thử chuẩn ETS",
      color: "text-[#0E9F9A]",
      bgColor: "bg-[#EEFDF8]",
    },
    {
      icon: Star,
      value: "4.9 / 5★",
      label: "Đánh giá chất lượng đề & giải thích",
      color: "text-[#D97706]",
      bgColor: "bg-[#FFFBEB]",
    },
    {
      icon: Award,
      value: "98.2%",
      label: "Học viên bứt phá target mốc điểm",
      color: "text-[#1D8F6A]",
      bgColor: "bg-[#E6F4EA]",
    },
  ];

  return (
    <section className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-4 sm:p-6 shadow-xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E8F1]">
        {stats.map((item, index) => {
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
                <div className="text-lg sm:text-xl font-extrabold text-[#16213A] tracking-tight tabular-nums">
                  {item.value}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-[#5C667A] line-clamp-1">
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
