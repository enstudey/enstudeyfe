import { PerformanceAnalyticsData, PredictedScoreData, SkillScore } from "@/types/analytics";

export const EXAM_TYPES = {
  TOEIC: "TOEIC",
  IELTS: "IELTS",
} as const;

export type ExamType = (typeof EXAM_TYPES)[keyof typeof EXAM_TYPES];

export const MAX_SCORES: Record<ExamType, number> = {
  TOEIC: 990,
  IELTS: 9.0,
};

export const DEFAULT_TARGET_SCORES: Record<ExamType, number> = {
  TOEIC: 800,
  IELTS: 7.0,
};

export const WEAK_TOPIC_THRESHOLD_PERCENT = 50;

export const DEFAULT_SKILLS: SkillScore[] = [
  { name: "Listening", score: 70 },
  { name: "Reading", score: 65 },
  { name: "Grammar", score: 50 },
  { name: "Vocabulary", score: 75 },
  { name: "Writing", score: 55 },
];

export const DEFAULT_PREDICTED_DATA: Record<ExamType, PredictedScoreData> = {
  TOEIC: {
    predictedScore: 0,
    targetScore: DEFAULT_TARGET_SCORES.TOEIC,
    distanceToTarget: DEFAULT_TARGET_SCORES.TOEIC,
  },
  IELTS: {
    predictedScore: 0.0,
    targetScore: DEFAULT_TARGET_SCORES.IELTS,
    distanceToTarget: DEFAULT_TARGET_SCORES.IELTS,
  },
};

export const DEFAULT_PERFORMANCE_DATA: PerformanceAnalyticsData = {
  skills: DEFAULT_SKILLS,
  weakTopics: [],
  scoreHistory: [],
};
