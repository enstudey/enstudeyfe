export type RoadmapStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export type TargetAudience = 'MAT_GOC' | 'SINH_VIEN' | 'NGUOI_DI_LAM' | 'HOC_SINH';

export type TaskType = 'FLASHCARD' | 'DAILY_QUIZ' | 'PRACTICE' | 'SPEAKING' | 'MISTAKE_BANK';

export interface RoadmapTask {
  taskId: string;
  taskType: TaskType;
  description: string;
  targetUrl: string;
  isCompleted: boolean;
}

export interface RoadmapMilestone {
  milestoneId: string;
  title: string;
  description: string;
  order: number;
  status: RoadmapStatus;
  tasks: RoadmapTask[];
}

export interface RoadmapData {
  roadmapId: string;
  title: string;
  targetAudience: TargetAudience;
  description: string;
  progressPercentage: number;
  milestones: RoadmapMilestone[];
}

export interface RoadmapItem {
  roadmapId: string;
  title: string;
  targetAudience: TargetAudience;
  description: string;
}

export interface SelectRoadmapRequest {
  roadmapId: string;
}
