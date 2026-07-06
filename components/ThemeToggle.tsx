"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch bằng cách kiểm tra trạng thái mounted của Client
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);


  if (!mounted) {
    // Trả về nút placeholder có cùng kích thước để tránh CLS (Layout Shift)
    return (
      <div className="w-[38px] h-[38px] rounded-xl bg-card border border-card-border animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-card border border-card-border hover:bg-background transition-colors text-lg cursor-pointer flex items-center justify-center w-[38px] h-[38px]"
      aria-label="Toggle theme"
      data-testid="btn-theme-toggle"
    >
      {resolvedTheme === "light" ? (
        <Moon className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
      ) : (
        <Sun className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
      )}
    </button>
  );
}

