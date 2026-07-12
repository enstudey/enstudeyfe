const PUBLISHER_ID = process.env.ACCESSTRADE_PUBLISHER_ID ?? "PLACEHOLDER_PUBLISHER_ID";

export const CAMPAIGN_IDS: Record<string, string> = {
  shopee: process.env.ACCESSTRADE_CAMPAIGN_SHOPEE ?? "PLACEHOLDER_SHOPEE_ID",
  lazada: process.env.ACCESSTRADE_CAMPAIGN_LAZADA ?? "PLACEHOLDER_LAZADA_ID",
  tiki:   process.env.ACCESSTRADE_CAMPAIGN_TIKI   ?? "PLACEHOLDER_TIKI_ID",
  elsaspeak: process.env.ACCESSTRADE_CAMPAIGN_ELSASPEAK ?? "PLACEHOLDER_ELSASPEAK_ID",
  unica:     process.env.ACCESSTRADE_CAMPAIGN_UNICA     ?? "PLACEHOLDER_UNICA_ID",
  gitiho:    process.env.ACCESSTRADE_CAMPAIGN_GITIHO    ?? "PLACEHOLDER_GITIHO_ID",
  ila:       process.env.ACCESSTRADE_CAMPAIGN_ILA       ?? "PLACEHOLDER_ILA_ID",
} as const;

interface AffiliateConfig {
  rawProductUrl: string;
  articleId: string;
  campaignId: string;
  contentTag?: string;
  saleSeason?: string;
  sub4?: string;
  sub5?: string;
}

/**
 * Tạo link tiếp thị liên kết ACCESSTRADE deep link từ URL gốc.
 * Pattern học từ gocdadep/lib/affiliate.ts và chuẩn hóa theo link mẫu.
 */
export function generateStandardATLink({
  rawProductUrl,
  articleId,
  campaignId,
  contentTag,
  saleSeason = "july-2026",
  sub4 = "oneatweb",
  sub5,
}: AffiliateConfig): string {
  if (!rawProductUrl) return "";
  const cId = CAMPAIGN_IDS[campaignId];
  if (!cId || cId.startsWith("PLACEHOLDER")) return rawProductUrl;

  // Mã hóa Base64 an toàn cho cả Client (Browser) và Server (Node)
  const base64Url =
    typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(rawProductUrl)))
      : Buffer.from(rawProductUrl).toString("base64");

  const encodedUrlEnc = encodeURIComponent(base64Url);
  const utmSource     = encodeURIComponent("enstudey.com");
  const utmMedium     = encodeURIComponent("affiliate");
  const utmCampaign   = encodeURIComponent(saleSeason);

  let url = `https://fast.accesstrade.com.vn/deep_link/v5/${PUBLISHER_ID}/${cId}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

  if (contentTag) {
    url += `&utm_content=${encodeURIComponent(contentTag)}`;
  }

  // Luôn đảm bảo sub4 ghi nhận nguồn chính xác
  url += `&sub4=${encodeURIComponent(sub4)}`;

  // Sử dụng sub5 để lưu vết slug bài viết/sản phẩm động (nếu có)
  const trackingSub5 = sub5 || articleId;
  if (trackingSub5) {
    url += `&sub5=${encodeURIComponent(trackingSub5)}`;
  }

  url += `&url_enc=${encodedUrlEnc}`;
  return url;
}
