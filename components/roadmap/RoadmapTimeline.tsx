"use client";

import { RoadmapMilestone } from "@/types/roadmap";
import { MilestoneCard } from "./MilestoneCard";

interface RoadmapTimelineProps {
  milestones: RoadmapMilestone[];
}

export function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">Chưa có chặng học tập nào được định cấu hình.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {milestones.map((milestone, index) => (
        <div key={milestone.milestoneId} className="relative">
          <MilestoneCard milestone={milestone} />

          {/* Interleaved AdSense Placeholder (Fixed height for Zero CLS) */}
          {index === 0 && (
            <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl min-h-[90px] flex items-center justify-center text-center">
              <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
                Quảng cáo — Được tài trợ
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
