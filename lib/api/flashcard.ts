import { apiFetch } from "./client";

export interface FlashcardProgressItem {
  wordId: string;
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string;
  lastReviewedAt: string | null;
}

export interface EvaluateFlashcardResponse {
  wordId: string;
  nextReviewDate: string;
  intervalDays: number;
  easinessFactor: number;
}

export function fetchFlashcardProgress(token: string) {
  return apiFetch<{ data: FlashcardProgressItem[] }>(
    "/api/v1/flashcards/progress",
    { method: "GET", token }
  );
}

export function evaluateFlashcard(token: string, wordId: string, qualityScore: number) {
  return apiFetch<{ data: EvaluateFlashcardResponse }>(
    "/api/v1/flashcards/evaluate",
    {
      method: "POST",
      token,
      body: JSON.stringify({ wordId, qualityScore })
    }
  );
}
