import { apiFetch } from "./client";

export interface PracticeQuestion {
  id: number;
  questionText: string;
  options: string[];
  audioUrl: string | null;
  imageUrl: string | null;
  correctIndex?: number;
  explanation?: string;
}


export interface PracticeSubmitRequest {
  part: string;
  examType: string;
  answers: {
    questionId: number;
    selectedIndex: number;
  }[];
}

export interface PracticeSubmitResponse {
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

export interface EnvelopeResponse<T> {
  data: T;
  meta?: {
    page: number;
    size: number;
    total: number;
  };
}

export function getPracticeQuestions(
  examType: string,
  part: string,
  difficulty: string,
  limit: number,
  token?: string
) {
  const query = new URLSearchParams({
    examType,
    part,
    difficulty,
    limit: limit.toString()
  });

  return apiFetch<EnvelopeResponse<PracticeQuestion[]>>(
    `/api/v1/practice/questions?${query.toString()}`,
    {
      method: "GET",
      token
    }
  );
}

export function submitPractice(
  payload: PracticeSubmitRequest,
  token?: string
) {
  return apiFetch<EnvelopeResponse<PracticeSubmitResponse>>(
    "/api/v1/practice/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }
  );
}
