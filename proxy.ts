import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các pattern cần block theo Business Rules (Chuyển sang chữ thường để kiểm tra)
const BLOCKED_CONTAINS = [".env", ".aws", ".git", "wp-admin", "wp-includes", ".github", "/s3/", "/backup/"];
const BLOCKED_ENDS_WITH = [".sql", ".bak", ".cgi", "nuxt.config.js", "next.config.js"];
const BLOCKED_STARTS_WITH = ["/data/", "/config/"];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  // 1. Kiểm tra startsWith
  if (BLOCKED_STARTS_WITH.some((pattern) => pathname.startsWith(pattern))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 2. Kiểm tra endsWith
  if (BLOCKED_ENDS_WITH.some((pattern) => pathname.endsWith(pattern))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 3. Kiểm tra contains
  if (BLOCKED_CONTAINS.some((pattern) => pathname.includes(pattern))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Chỉ áp dụng proxy cho các request động, bỏ qua các static assets phổ biến
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|ads.txt).*)",
  ],
};
