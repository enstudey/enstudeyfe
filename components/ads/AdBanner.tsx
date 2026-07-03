import React from "react";

export default function AdBanner() {
  return (
    <div 
      className="w-full min-h-[250px] bg-gray-50 flex items-center justify-center my-6 rounded-lg overflow-hidden border border-gray-100"
      data-testid="ad-banner"
    >
      <span className="text-xs text-gray-400">Quảng cáo</span>
    </div>
  );
}
