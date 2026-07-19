import { apiFetch } from "./client";

export interface QuizProgressPayload {
  userId: string;
  testType: string;
  score: number;
  totalQuestions: number;
  rawResults: string;
}

export function submitQuizProgress(token: string, payload: QuizProgressPayload) {
  return apiFetch<{ data: unknown }>(
    "/api/v1/quizzes/progress",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }
  );
}
