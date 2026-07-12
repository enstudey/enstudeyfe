"use client";

import React, { useState, useEffect } from "react";

interface SpeechButtonProps {
  text: string;
  id?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  testId?: string;
}

export default function SpeechButton({
  text,
  id,
  className = "",
  size = "md",
  testId = "btn-speak"
}: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakCount, setSpeakCount] = useState(0);
  const [lastId, setLastId] = useState<string>("");

  const trackId = id || text;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền (ví dụ lật thẻ flashcard)

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    let newCount = speakCount + 1;
    if (lastId !== trackId) {
      newCount = 1;
      setLastId(trackId);
    }
    setSpeakCount(newCount);

    const utterance = new SpeechSynthesisUtterance(text);
    // Lần 1: rate = 1.0, Lần 2: rate = 0.65
    utterance.rate = newCount % 2 === 0 ? 0.65 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Dọn dẹp âm thanh khi component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sizeClasses = {
    sm: "p-1 rounded-lg",
    md: "p-2 rounded-xl",
    lg: "p-3 rounded-2xl"
  };

  const svgSizes = {
    sm: "12",
    md: "16",
    lg: "20"
  };

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={handleSpeak}
      className={`transition duration-200 cursor-pointer ${sizeClasses[size]} ${
        isSpeaking
          ? "bg-violet-100 text-violet-750 dark:bg-violet-950 dark:text-violet-300 animate-pulse"
          : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400"
      } ${className}`}
      title="Phát âm từ vựng (Bấm lần 2 để đọc chậm)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgSizes[size]}
        height={svgSizes[size]}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303zm-1.61-1.61A5.4 5.4 0 0 0 11.4 8a5.4 5.4 0 0 0-1.474-3.798l-.71.707A4.48 4.48 0 0 1 10.4 8c0 1.24-.5 2.365-1.314 3.178zm-3-3.79c-.002-.132-.008-.262-.018-.39L5.825 8.24c.005.113.01.228.01.343s-.005.23-.01.343l1.109-.594c.01-.128.016-.258.018-.39z" />
        <path d="M4 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .8.4L7.5 9.5h2a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5h-2L4.3 4.1A.5.5 0 0 0 4 4z" />
      </svg>
    </button>
  );
}
