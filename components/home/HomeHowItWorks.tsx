import { FileText, Brain, RotateCcw } from "lucide-react";

export default function HomeHowItWorks() {
  const steps = [
    {
      num: "01",
      icon: FileText,
      title: "Thi chẩn đoán 10 câu",
      desc: "Làm bài Mini-Test 15 phút để AI đánh giá ngay mức điểm thực tế và dạng bài bạn hay làm sai.",
      badge: "15 phút mỗi ngày",
      color: "text-[#3349D8]",
      bgColor: "bg-[#EEF2FF]",
    },
    {
      num: "02",
      icon: Brain,
      title: "AI Phân tích & Giải thích",
      desc: "Xem lời giải chi tiết 100% tiếng Việt, nhận diện bẫy ngữ pháp và mẹo xử lý nhanh Part 1 - Part 7.",
      badge: "100% Tiếng Việt",
      color: "text-[#0E9F9A]",
      bgColor: "bg-[#EEFDF8]",
    },
    {
      num: "03",
      icon: RotateCcw,
      title: "Ôn lại câu sai tự động",
      desc: "Hệ thống tự động nhắc ôn lại các câu đã sai theo thuật toán Spaced Repetition trước khi bạn quên.",
      badge: "Thuật toán SM-2",
      color: "text-[#D97706]",
      bgColor: "bg-[#FFFBEB]",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-extrabold text-[#16213A] tracking-tight">
          Phương pháp 3 bước chinh phục TOEIC
        </h2>
        <p className="text-xs text-[#5C667A]">
          Luyện ít hơn nhưng hiệu quả cao hơn nhờ lộ trình dựa trên dữ liệu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.num}
              className="bg-[#FFFFFF] border border-[#E4E8F1] rounded-xl p-6 shadow-xs relative flex flex-col justify-between space-y-4 hover:border-[#3349D8]/30 transition duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-2xl font-black text-[#E4E8F1] tabular-nums">
                    {item.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#16213A] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#5C667A] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F1F4FA]">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F7F8FC] text-[#5C667A] border border-[#E4E8F1]">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
