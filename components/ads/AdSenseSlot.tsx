"use client";

import { useEffect } from "react";
import { FEATURE_FLAGS } from "@/lib/config/features";

interface AdSenseSlotProps {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  minHeight: string; // Bắt buộc để tránh Cumulative Layout Shift (CLS)
}

interface WindowWithAdSense extends Window {
  adsbygoogle?: Record<string, unknown>[];
}

export default function AdSenseSlot({
  slotId,
  format = "auto",
  className = "",
  minHeight,
}: AdSenseSlotProps) {
  useEffect(() => {
    if (FEATURE_FLAGS.ENABLE_ADSENSE) {
      try {
        const globalWindow = window as unknown as WindowWithAdSense;
        globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
        globalWindow.adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense slot push error:", e);
      }
    }
  }, []);

  if (!FEATURE_FLAGS.ENABLE_ADSENSE) {
    return null;
  }

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXX";

  return (
    <div
      className={`ad-slot-container w-full overflow-hidden flex items-center justify-center bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200/50 dark:border-zinc-800/40 rounded-2xl relative ${className}`}
      style={{ minHeight }}
      data-testid="adsense-slot"
    >
      <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider text-slate-400 font-semibold select-none z-0">
        Liên kết tài trợ
      </span>
      <ins
        className="adsbygoogle w-full h-full z-10"
        style={{ display: "block" }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
