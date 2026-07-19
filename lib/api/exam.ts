import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";
import { Exam, ExamDetail, ExamStartResponse, ExamResumeResponse, ExamSubmitResponse } from "@/types/exam";

export function getExams(page: number = 0, size: number = 10, token?: string) {
  return apiFetch<EnvelopeResponse<Exam[]>>(
    `/api/v1/exams?page=${page}&size=${size}`,
    {
      method: "GET",
      token
    }
  );
}

export function getExamDetail(id: string, token?: string) {
  return apiFetch<EnvelopeResponse<ExamDetail>>(
    `/api/v1/exams/${id}`,
    {
      method: "GET",
      token
    }
  );
}

export function startExam(id: string, token?: string) {
  return apiFetch<EnvelopeResponse<ExamStartResponse>>(
    `/api/v1/exams/${id}/start`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ mode: "FULL_LENGTH" })
    }
  );
}

export function saveExamAnswer(
  sessionId: string,
  questionId: number,
  selectedIndex: number,
  token?: string
) {
  return apiFetch<EnvelopeResponse<{ saved: boolean }>>(
    `/api/v1/exams/sessions/${sessionId}/answers`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ questionId, selectedIndex })
    }
  );
}

export function resumeExam(sessionId: string, token?: string) {
  return apiFetch<EnvelopeResponse<ExamResumeResponse>>(
    `/api/v1/exams/sessions/${sessionId}/resume`,
    {
      method: "GET",
      token
    }
  );
}

export function submitExam(sessionId: string, token?: string) {
  return apiFetch<EnvelopeResponse<ExamSubmitResponse>>(
    `/api/v1/exams/sessions/${sessionId}/submit`,
    {
      method: "POST",
      token
    }
  );
}
