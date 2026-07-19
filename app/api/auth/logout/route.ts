import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}
