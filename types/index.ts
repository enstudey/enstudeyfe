export interface Question {
  id: string;
  content: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface DailyStreak {
  count: number;
  activeToday: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  streakCount: number;
}
