"use client";

import React, { useState, useEffect } from "react";
import { generateStandardATLink } from "@/lib/affiliate";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

export default function StartSpeakingButton() {
  const [turns, setTurns] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Đọc số lượt nói trong ngày từ localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem("speaking_turns_data");
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        // Trì hoãn cập nhật state turns để tránh cảnh báo setState đồng bộ trong effect
        setTimeout(() => {
          setTurns(count);
        }, 0);
      } else {
        localStorage.setItem("speaking_turns_data", JSON.stringify({ date: today, count: 0 }));
        setTimeout(() => {
          setTurns(0);
        }, 0);
      }
    } else {
      localStorage.setItem("speaking_turns_data", JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const handleStart = () => {
    if (turns >= 5) {
      setShowPopup(true);
      return;
    }

    setIsConnecting(true);
    // Giả lập kết nối micro thành công sau 1.5s
    setTimeout(() => {
      setIsConnecting(false);
      const today = new Date().toDateString();
      const newCount = turns + 1;
      setTurns(newCount);
      localStorage.setItem("speaking_turns_data", JSON.stringify({ date: today, count: newCount }));
      
      alert(`Đã kết nối Micro thành công! Bắt đầu lượt nói thứ ${newCount}/5 của bạn.`);
    }, 1500);
  };

  // Tạo link affiliate tới gian hàng tai nghe/sách học tiếng Anh trên Tiki
  const tikiAffiliateUrl = generateStandardATLink({
    rawProductUrl: "https://tiki.vn/search?q=tai+nghe+hoc+tieng+anh",
    articleId: "luyen-noi-limits",
    campaignId: "tiki",
    contentTag: "luyen-noi-popup",
  });

  const handleTikiClick = () => {
    // Ghi nhận click qua GA4
    trackAffiliateClick({
      productId: "tiki-headphone-unlock",
      productName: "Gian hàng Tai nghe & Sách học Tiếng Anh Tiki Trading",
      sourcePage: "luyen-noi-limit-popup",
      subId: "enstudey_speaking_unlock",
    });

    // Mở khóa cộng thêm 5 lượt nói khi click ủng hộ
    const today = new Date().toDateString();
    localStorage.setItem("speaking_turns_data", JSON.stringify({ date: today, count: 0 }));
    setTurns(0);
    setShowPopup(false);
    
    alert("Cảm ơn bạn đã ủng hộ đối tác Tiki Trading! Hệ thống đã sạc đầy năng lượng cho bạn thêm 5 lượt nói miễn phí.");
  };

  return (
    <>
      <button
        onClick={handleStart}
        disabled={isConnecting}
        className="font-bold w-full py-3.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl shadow-md transition duration-200 cursor-pointer disabled:opacity-50"
      >
        {isConnecting ? "Đang kết nối Micro..." : `Kết nối Micro & Bắt đầu (${turns}/5 lượt)`}
      </button>

      {/* Popup Trạm sạc năng lượng khi hết lượt */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              ⚡
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
                Trạm Sạc Năng Lượng 🔋
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Bạn đã dùng hết 5 lượt luyện nói miễn phí của hôm nay! Vui lòng quay lại sau 60 phút, hoặc ghé thăm gian hàng đối tác để sạc đầy và nhận thêm lượt luyện tập ngay lập tức.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={tikiAffiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={handleTikiClick}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-colors text-sm text-center"
              >
                Ghé gian hàng Tai nghe & Sách Tiki Trading 🚀
              </a>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
