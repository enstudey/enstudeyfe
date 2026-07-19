import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";

export interface GrammarSwipeQuestion {
  id: number;
  questionText: string;
  isCorrect: boolean;
  errorWord: string | null;
  errorPosition: number | null;
  explanation: string;
}

export interface GrammarSwipeSubmitRequest {
  sessionId: string;
  answers: {
    questionId: number;
    userAnswer: "CORRECT" | "INCORRECT";
    selectedErrorWord?: string;
  }[];
}

export interface GrammarSwipeSubmitResponse {
  score: number;
  total: number;
  xpEarned: number;
  mistakesSavedCount: number;
}

export function getGrammarSwipeQuestions(token?: string) {
  return apiFetch<EnvelopeResponse<GrammarSwipeQuestion[]>>(
    "/api/v1/quizzes/grammar-swipe",
    {
      method: "GET",
      token
    }
  );
}

export function submitGrammarSwipe(
  payload: GrammarSwipeSubmitRequest,
  token?: string
) {
  return apiFetch<EnvelopeResponse<GrammarSwipeSubmitResponse>>(
    "/api/v1/quizzes/grammar-swipe/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }
  );
}
