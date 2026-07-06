export type AffiliateCategory = "study" | "dorm";

export interface AffiliateProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  category: AffiliateCategory;
}
