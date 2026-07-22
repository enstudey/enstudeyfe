export interface Exam {
  id: string;
  title: string;
  examType: "TOEIC" | "IELTS";
  durationSeconds: number;
  totalQuestions: number;
  status: string;
}

export interface ExamDetail {
  id: string;
  title: string;
  examType: "TOEIC" | "IELTS";
  durationSeconds: number;
  totalQuestions: number;
  description: string;
}

export interface ExamQuestion {
  id: number;
  questionText: string;
  options: string[];
  audioUrl: string | null;
  imageUrl: string | null;
  part: string;
  order: number;
  passage: string | null;
}

export interface ExamStartResponse {
  sessionExamId: string;
  examId: string;
  durationSeconds: number;
  startedAt: string;
  questions: ExamQuestion[];
}

export interface ExamResumeResponse {
  sessionExamId: string;
  examId: string;
  durationSeconds: number;
  elapsedSeconds: number;
  answers: Record<string, number>;
  questions: ExamQuestion[];
}

export interface QuestionResult {
  questionId: number;
  userAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  explanation: string;
  questionText: string;
  options: string[];
}

export interface ExamSubmitResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedDurationSeconds: number;
  results: QuestionResult[];
}

export interface TextHighlight {
  id: string;
  text: string;
  color: "yellow" | "cyan" | "green";
  questionId?: number;
}

