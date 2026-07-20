import { getAllRoadmaps } from "@/lib/api/roadmap";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getAllRoadmaps();
  return NextResponse.json({ data });
}
