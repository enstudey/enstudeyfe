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
}

/**
 * Tạo link tiếp thị liên kết ACCESSTRADE deep link từ URL gốc.
 * Pattern học từ gocdadep/lib/affiliate.ts.
 */
export function generateStandardATLink({
  rawProductUrl,
  articleId,
  campaignId,
  contentTag = "general",
  saleSeason = "2026",
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
  const dynamicSub    = encodeURIComponent(articleId);
  const utmSource     = encodeURIComponent("enstudey.com");
  const utmMedium     = encodeURIComponent("affiliate");
  const utmCampaign   = encodeURIComponent(saleSeason);
  const utmContent    = encodeURIComponent(contentTag);

  return `https://fast.accesstrade.com.vn/deep_link/v5/${PUBLISHER_ID}/${cId}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}&sub4=${dynamicSub}&url_enc=${encodedUrlEnc}`;
}
