import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const token = request.cookies.get("token")?.value;

  if (token && token !== "mock-demo-token-12345") {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      // Best effort logout signal to backend
    }
  }

  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}
