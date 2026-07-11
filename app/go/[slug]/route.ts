import { NextRequest, NextResponse } from "next/server";
import affiliateLinks from "@/affiliate-links.json";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const targetSource = `/go/${slug}`;
  const link = affiliateLinks.find((l) => l.source === targetSource);

  if (link) {
    // Trả về redirect 307 (Temporary Redirect) để tránh client caching cứng
    return NextResponse.redirect(link.destination, 307);
  }

  return new NextResponse("Not Found", { status: 404 });
}
