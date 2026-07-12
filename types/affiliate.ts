export type AffiliateCategory = "study" | "dorm" | "collection";
export type AffiliatePlatform = "shopee" | "lazada" | "tiki" | "amazon" | "elsaspeak" | "unica" | "gitiho" | "ila";

export interface AffiliateProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  category: AffiliateCategory;
  tags?: string[];
  ctaLabel?: string;
  platform?: AffiliatePlatform;
  rawProductUrl?: string;  // URL gốc sản phẩm trên sàn (chưa qua affiliate)
  campaignId?: string;     // ACCESSTRADE campaign ID key (trỏ vào CAMPAIGN_IDS)
}

export interface AffiliateLink {
  source: string;
  destination: string;
  platform?: AffiliatePlatform;
  campaignId?: string;
}

