"use client";

import { useState, useEffect } from "react";

export function useDonateUX() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isDonated = localStorage.getItem("isDonated") === "true";
      const hideUntil = localStorage.getItem("hideDonateUntil");
      const now = Date.now();

      if (isDonated) {
        setShouldShow(false);
        return;
      }

      if (hideUntil && now < parseInt(hideUntil, 10)) {
        setShouldShow(false);
        return;
      }

      setShouldShow(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDonateAction = () => {
    localStorage.setItem("isDonated", "true");
    setShouldShow(false);
    // Dispatch custom event to sync with other instances
    window.dispatchEvent(new Event("donate-state-changed"));
  };

  const handleCloseAction = () => {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("hideDonateUntil", (Date.now() + sevenDaysMs).toString());
    setShouldShow(false);
    window.dispatchEvent(new Event("donate-state-changed"));
  };

  // Sync state between tabs/components
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const syncState = () => {
      timer = setTimeout(() => {
        const isDonated = localStorage.getItem("isDonated") === "true";
        const hideUntil = localStorage.getItem("hideDonateUntil");
        const now = Date.now();

        if (isDonated) {
          setShouldShow(false);
          return;
        }

        if (hideUntil && now < parseInt(hideUntil, 10)) {
          setShouldShow(false);
          return;
        }

        setShouldShow(true);
      }, 0);
    };

    window.addEventListener("donate-state-changed", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("donate-state-changed", syncState);
      window.removeEventListener("storage", syncState);
      clearTimeout(timer);
    };
  }, []);

  return { shouldShow, handleDonateAction, handleCloseAction };
}
