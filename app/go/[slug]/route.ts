import { NextRequest, NextResponse } from "next/server";
import affiliateLinks from "@/data/affiliate-links.json";
import { generateStandardATLink } from "@/lib/affiliate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const targetSource = `/go/${slug}`;
  const link = affiliateLinks.find((l) => l.source === targetSource);

  if (link) {
    try {
      // Sinh deep link động Accesstrade phía Server (có đầy đủ biến môi trường)
      const affiliateUrl = generateStandardATLink({
        rawProductUrl: link.destination,
        articleId: slug,
        campaignId: link.campaignId ?? "tiki",
        contentTag: "product-card",
      });
      return NextResponse.redirect(affiliateUrl, 307);
    } catch {
      return NextResponse.redirect(link.destination, 307);
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}

