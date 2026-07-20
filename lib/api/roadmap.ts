import { apiFetch } from "./client";
import type { RoadmapData, RoadmapItem, SelectRoadmapRequest } from "@/types/roadmap";

interface EnvelopeResponse<T> {
  data: T;
  meta?: {
    page: number;
    size: number;
    total: number;
  };
}

export async function getCurrentRoadmap(token?: string): Promise<RoadmapData | null> {
  try {
    const res = await apiFetch<EnvelopeResponse<RoadmapData | null>>("/api/v1/roadmaps/current", { token });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch current roadmap:", error);
    return null;
  }
}

export async function selectRoadmap(request: SelectRoadmapRequest, token?: string): Promise<RoadmapData | null> {
  try {
    const res = await apiFetch<EnvelopeResponse<RoadmapData>>("/api/v1/roadmaps/select", {
      method: "POST",
      body: JSON.stringify(request),
      token
    });
    return res.data;
  } catch (error) {
    console.error("Failed to select roadmap:", error);
    return null;
  }
}

export async function getAllRoadmaps(): Promise<RoadmapItem[]> {
  try {
    const res = await apiFetch<EnvelopeResponse<RoadmapItem[]>>("/api/v1/roadmaps", {});
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch all roadmaps:", error);
    return [];
  }
}
