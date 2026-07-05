"use client";

import { useState, useEffect } from "react";
import donationsData from "@/data/donations.json";

export function useDonateStatus() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tạo đối tượng Image ảo để kiểm tra xem file ảnh QR có tồn tại trong thư mục public không
    const img = new window.Image();
    img.src = donationsData.qr_template_url;
    img.onload = () => {
      setIsAvailable(true);
      setLoading(false);
    };
    img.onerror = () => {
      setIsAvailable(false);
      setLoading(false);
    };
  }, []);

  return { isAvailable, loading, config: donationsData };
}
