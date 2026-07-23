import { NextRequest, NextResponse } from "next/server";
import { logoutApi } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const token = request.cookies.get("token")?.value;

  if (token && token !== "mock-demo-token-12345") {
    try {
      await logoutApi(token);
    } catch {
      // Best-effort logout signal to backend
    }
  }

  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}
