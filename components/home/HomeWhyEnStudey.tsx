import { Target, BrainCircuit, RefreshCw, Zap } from "lucide-react";

export default function HomeWhyEnStudey() {
  const reasons = [
    {
      icon: Target,
      title: "Đề thi thử chuẩn ETS 2026",
      desc: "Bộ câu hỏi sát thực tế 100%, cấu trúc bài thi 200 câu với giao diện phòng thi chuẩn đếm ngược.",
      iconColor: "text-[#3349D8]",
      bgColor: "bg-[#EEF2FF]",
    },
    {
      icon: BrainCircuit,
      title: "AI Phân tích điểm yếu",
      desc: "Chỉ ra chính xác dạng bài, chủ đề từ vựng hay bẫy bám đuổi khiến bạn mất điểm ở Part 3-4 & Part 7.",
      iconColor: "text-[#0E9F9A]",
      bgColor: "bg-[#EEFDF8]",
    },
    {
      icon: RefreshCw,
      title: "Tự động lưu & ôn câu sai",
      desc: "Ứng dụng thuật toán Spaced Repetition nhắc nhở ôn lại câu sai đúng thời điểm vàng ghi nhớ dài hạn.",
      iconColor: "text-[#D97706]",
      bgColor: "bg-[#FFFBEB]",
    },
    {
      icon: Zap,
      title: "Tối ưu 50% thời gian học",
      desc: "Thay vì mất 2 tiếng thi thử dài mệt mỏi, hãy duy trì thói quen 10 câu Mini-Test 15 phút mỗi ngày.",
      iconColor: "text-[#1D8F6A]",
      bgColor: "bg-[#E6F4EA]",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-extrabold text-[#16213A] tracking-tight">
          Tại sao học viên lựa chọn EnStudey?
        </h2>
        <p className="text-xs text-[#5C667A]">
          Phương pháp học thông minh lấy kết quả làm trung tâm
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reasons.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#3349D8]/30 transition duration-150"
            >
              <div className="space-y-3">
                <div
                  className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}
                >
                  <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-[#16213A] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5C667A] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
