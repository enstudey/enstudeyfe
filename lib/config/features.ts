/**
 * Feature Flags — Kiểm soát tập trung tính năng bật/tắt.
 * Thay đổi file này + redeploy để kích hoạt/hủy bất kỳ tính năng nào.
 * Safe-by-default: mặc định tắt AdSense đến khi được Google duyệt.
 */
export const FEATURE_FLAGS = {
  /** Bật true khi Google AdSense đã được duyệt */
  ENABLE_ADSENSE: true, // enstudey đã có AdSense → giữ true
  /** Bật true nếu muốn hiển thị affiliate content */
  ENABLE_AFFILIATE: false,
} as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
