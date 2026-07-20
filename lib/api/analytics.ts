import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";
import { PerformanceAnalyticsData, PredictedScoreData } from "@/types/analytics";

export function getPerformanceAnalytics(examType: string = "TOEIC", token?: string) {
  return apiFetch<EnvelopeResponse<PerformanceAnalyticsData>>(
    `/api/v1/analytics/performance?examType=${encodeURIComponent(examType)}`,
    {
      method: "GET",
      token,
      credentials: "include",
      cache: "no-store",
    }
  );
}

export function getPredictedScore(examType: string = "TOEIC", token?: string) {
  return apiFetch<EnvelopeResponse<PredictedScoreData>>(
    `/api/v1/analytics/predicted-score?examType=${encodeURIComponent(examType)}`,
    {
      method: "GET",
      token,
      credentials: "include",
      cache: "no-store",
    }
  );
}
