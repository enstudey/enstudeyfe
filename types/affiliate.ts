export type AffiliateCategory = "study" | "dorm" | "collection";

export interface AffiliateProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  category: AffiliateCategory;
  tags?: string[];
  ctaLabel?: string;
}
