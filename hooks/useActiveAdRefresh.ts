"use client";

import { useEffect, useState, useRef } from "react";

export function useActiveAdRefresh(adSlotId: string, intervalMs: number = 45000) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRefreshes, setTotalRefreshes] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveRef = useRef<number>(0);
  const refreshCountRef = useRef<number>(0);

  useEffect(() => {
    // 1. Khởi tạo mốc hoạt động ban đầu ở mount
    lastActiveRef.current = Date.now();

    // 2. Kiểm tra session storage để theo dõi tổng số lần refresh trong phiên học
    const sessionKey = `ad_refresh_count_${adSlotId}`;
    const storedCount = sessionStorage.getItem(sessionKey);
    if (storedCount) {
      const parsed = parseInt(storedCount, 10);
      refreshCountRef.current = parsed;
      setTimeout(() => {
        setTotalRefreshes(parsed);
      }, 0);
    }

    const handleActivity = () => {
      lastActiveRef.current = Date.now();
    };

    // Đăng ký các sự kiện theo dõi tương tác người dùng
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const checkRefresh = () => {
      const now = Date.now();
      const inactiveTime = now - lastActiveRef.current;

      // Chỉ refresh khi người dùng không tương tác quá 45 giây, tab đang visible và chưa quá giới hạn 4 lần/phiên
      if (
        inactiveTime >= intervalMs &&
        document.visibilityState === "visible" &&
        refreshCountRef.current < 4
      ) {
        refreshCountRef.current += 1;
        sessionStorage.setItem(sessionKey, refreshCountRef.current.toString());
        setTotalRefreshes(refreshCountRef.current);
        setRefreshTrigger((prev) => prev + 1);
        lastActiveRef.current = Date.now(); // reset timer sau khi refresh

        // Gọi GPT AdSense Refresh nếu được tích hợp
        interface GPTWindow {
          googletag?: {
            cmd: Array<() => void>;
            pubads: () => {
              refresh: () => void;
            };
          };
        }
        const anyWindow = window as unknown as GPTWindow;
        if (anyWindow.googletag && anyWindow.googletag.pubads) {
          anyWindow.googletag.cmd.push(() => {
            anyWindow.googletag.pubads().refresh();
          });
        }
      }
    };

    timerRef.current = setInterval(checkRefresh, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [adSlotId, intervalMs]);

  return { refreshTrigger, totalRefreshes };
}
