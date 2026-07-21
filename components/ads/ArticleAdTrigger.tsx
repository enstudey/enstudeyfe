"use client";

import { useEffect } from "react";
import { FEATURE_FLAGS } from "@/lib/config/features";

interface ArticleAdTriggerProps {
  triggerKey: string;
}

interface WindowWithAdSense extends Window {
  adsbygoogle?: Record<string, unknown>[];
}

export default function ArticleAdTrigger({ triggerKey }: ArticleAdTriggerProps) {
  useEffect(() => {
    if (FEATURE_FLAGS.ENABLE_ADSENSE) {
      try {
        const globalWindow = window as unknown as WindowWithAdSense;
        const insElements = document.querySelectorAll(".article-content .adsbygoogle");
        insElements.forEach((ins) => {
          // Chỉ push nếu phần tử chưa được xử lý (không có thuộc tính data-adsbygoogle-status)
          if (!ins.hasAttribute("data-adsbygoogle-status")) {
            globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
            globalWindow.adsbygoogle.push({});
          }
        });
      } catch (e) {
        console.error("Article inline ad push error:", e);
      }
    }
  }, [triggerKey]);

  return null;
}
