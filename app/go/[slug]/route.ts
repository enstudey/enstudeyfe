import { NextRequest, NextResponse } from "next/server";
import affiliateLinks from "@/data/affiliate-links.json";
import affiliateProducts from "@/data/affiliate-products.json";
import { generateStandardATLink } from "@/lib/affiliate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const targetSource = `/go/${slug}`;
  
  let destination = "";
  let campaignId = "tiki";

  const link = affiliateLinks.find((l) => l.source === targetSource);
  if (link) {
    destination = link.destination;
    campaignId = link.campaignId ?? "tiki";
  } else {
    // Tìm kiếm dự phòng trong danh sách sản phẩm affiliate-products.json
    const product = affiliateProducts.find((p) => p.slug === slug);
    if (product && product.rawProductUrl) {
      destination = product.rawProductUrl;
      campaignId = product.campaignId ?? product.platform ?? "tiki";
    }
  }

  if (destination) {
    try {
      // Sinh deep link động Accesstrade phía Server (có đầy đủ biến môi trường)
      const affiliateUrl = generateStandardATLink({
        rawProductUrl: destination,
        articleId: slug,
        campaignId: campaignId,
        contentTag: "product-card",
      });
      return NextResponse.redirect(affiliateUrl, 307);
    } catch {
      return NextResponse.redirect(destination, 307);
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}

