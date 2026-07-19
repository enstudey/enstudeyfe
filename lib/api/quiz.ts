import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";

export interface QuizProgressPayload {
  userId: string;
  testType: string;
  score: number;
  totalQuestions: number;
  rawResults: string;
}

export interface DailyQuizStatus {
  completedToday: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface DailyQuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  imageUrl: string | null;
  audioUrl: string | null;
}

export interface DailyQuizSubmitRequest {
  sessionId: string;
  answers: {
    questionId: number;
    selectedIndex: number;
  }[];
}

export interface DailyQuizSubmitResponse {
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: {
    questionId: number;
    userAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
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

export function getDailyQuizStatus(token?: string) {
  return apiFetch<EnvelopeResponse<DailyQuizStatus>>(
    "/api/v1/quizzes/daily/status",
    {
      method: "GET",
      token
    }
  );
}

export function getDailyQuizQuestions(examType: string, token?: string) {
  return apiFetch<EnvelopeResponse<{ sessionId: string; questions: DailyQuizQuestion[] }>>(
    `/api/v1/quizzes/daily?examType=${examType}`,
    {
      method: "GET",
      token
    }
  );
}

export function submitDailyQuiz(payload: DailyQuizSubmitRequest, token?: string) {
  return apiFetch<EnvelopeResponse<DailyQuizSubmitResponse>>(
    "/api/v1/quizzes/daily/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }
  );
}
