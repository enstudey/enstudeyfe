import { apiFetch } from "./client";

export interface MistakeBankItem {
  id: number;
  questionId: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  status: "UNSEEN" | "REVIEWED" | "MASTERED";
  mistakeCount: number;
  correctStreak: number;
  lastFailedAt: string;
}

export interface PracticeQuestion {
  id: number;
  questionText: string;
  options: string[];
}

export interface PracticeStartData {
  practiceSessionId: string;
  questions: PracticeQuestion[];
}

export interface PracticeSubmitResponse {
  score: number;
  total: number;
  results: {
    questionId: number;
    isCorrect: boolean;
    newStatus: string;
    correctStreak: number;
  }[];
}

export function fetchMistakes(
  token: string,
  query: { page: number; size: number; status?: string; category?: string }
) {
  const params = new URLSearchParams({
    page: query.page.toString(),
    size: query.size.toString()
  });
  if (query.status && query.status !== "ALL") params.append("status", query.status);
  if (query.category && query.category !== "ALL") params.append("category", query.category);

  return apiFetch<{ data: MistakeBankItem[]; meta: { page: number; size: number; total: number } }>(
    `/api/v1/mistake-bank?${params.toString()}`,
    { method: "GET", token }
  );
}

export function startPractice(token: string) {
  return apiFetch<{ data: PracticeStartData }>(
    "/api/v1/mistake-bank/practice/start",
    { method: "POST", token }
  );
}

export function submitPractice(
  token: string,
  practiceSessionId: string,
  answers: { questionId: number; selectedIndex: number }[]
) {
  return apiFetch<{ data: PracticeSubmitResponse }>(
    "/api/v1/mistake-bank/practice/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify({ practiceSessionId, answers })
    }
  );
}

export function deleteMistake(token: string, id: number) {
  return apiFetch<{ data: string }>(
    `/api/v1/mistake-bank/${id}`,
    { method: "DELETE", token }
  );
}
