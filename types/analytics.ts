export interface SkillScore {
  name: string;
  score: number;
}

export interface WeakTopic {
  part: string;
  correctRate: number;
}

export interface ScoreHistoryItem {
  date: string;
  score: number;
  title: string;
}

export interface PerformanceAnalyticsData {
  skills: SkillScore[];
  weakTopics: WeakTopic[];
  scoreHistory: ScoreHistoryItem[];
}

export interface PredictedScoreData {
  predictedScore: number;
  targetScore: number;
  distanceToTarget: number;
}
