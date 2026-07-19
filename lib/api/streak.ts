import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";

export interface LeaderboardItem {
  rank: number;
  nickname: string;
  avatarColor: string | null;
  currentStreak: number;
  isCurrentUser: boolean;
}

export interface CurrentUserRank {
  rank: number;
  nickname: string;
  avatarColor: string | null;
  currentStreak: number;
  isCurrentUser: boolean;
  surroundingUsers: LeaderboardItem[];
}

export interface LeaderboardResponse {
  topUsers: LeaderboardItem[];
  currentUserRank: CurrentUserRank | null;
}

export interface StreakActivityResponse {
  currentStreak: number;
  lastActivityDate: string;
  xpEarned: number;
}

export function recordStreakActivity(token: string, activityType: string, activityId: string) {
  return apiFetch<EnvelopeResponse<StreakActivityResponse>>(
    "/api/v1/streaks/activity",
    {
      method: "POST",
      token,
      body: JSON.stringify({ activityType, activityId })
    }
  );
}

export function getStreakLeaderboard(token?: string, limit = 20) {
  return apiFetch<EnvelopeResponse<LeaderboardResponse>>(
    `/api/v1/leaderboard/streaks?limit=${limit}`,
    {
      method: "GET",
      token
    }
  );
}

export function toggleAnonymous(token: string, isAnonymous: boolean) {
  return apiFetch<EnvelopeResponse<{ id: string; isAnonymous: boolean; avatarColor: string | null }>>(
    "/api/v1/users/me/anonymous",
    {
      method: "PUT",
      token,
      body: JSON.stringify({ isAnonymous })
    }
  );
}
