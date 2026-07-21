"use client";

import { RoadmapMilestone } from "@/types/roadmap";
import { MilestoneCard } from "./MilestoneCard";
import AdSenseSlot from "@/components/ads/AdSenseSlot";

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
        <div key={milestone.milestoneId || `milestone-${index}`} className="relative">
          <MilestoneCard milestone={milestone} />

          {/* Interleaved AdSense (Fixed height for Zero CLS) */}
          {index === 0 && (
            <AdSenseSlot slotId="roadmap-timeline-slot-id" minHeight="90px" className="mt-8" />
          )}
        </div>
      ))}
    </div>
  );
}
