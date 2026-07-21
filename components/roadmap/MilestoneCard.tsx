"use client";

import Link from "next/link";
import { RoadmapMilestone } from "@/types/roadmap";

interface MilestoneCardProps {
  milestone: RoadmapMilestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const isLocked = milestone.status === "LOCKED";
  const isCompleted = milestone.status === "COMPLETED";

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          Đã Hoàn Thành
        </span>
      );
    }
    if (isLocked) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          Chưa Mở Khóa
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse">
        Đang Học
      </span>
    );
  };

  return (
    <div
      className={`rounded-card border transition-all p-6 ${isCompleted
          ? "bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/40"
          : isLocked
            ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-70"
            : "bg-white border-blue-100 dark:bg-zinc-900 dark:border-blue-950 shadow-md ring-2 ring-primary/10"
        }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Chặng {milestone.order}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
            {milestone.title}
          </h2>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        {milestone.description}
      </p>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Danh sách nhiệm vụ:
        </h3>
        {milestone.tasks.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">Chưa có nhiệm vụ chi tiết.</p>
        ) : (
          milestone.tasks.map((task) => (
            <div
              key={task.taskId}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-sm transition-colors ${task.isCompleted
                  ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                  : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700/50"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${task.isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                >
                  {task.isCompleted ? "✓" : "•"}
                </div>
                <span
                  className={
                    task.isCompleted
                      ? "line-through text-zinc-500 dark:text-zinc-400"
                      : "font-medium text-zinc-800 dark:text-zinc-200"
                  }
                >
                  {task.description}
                </span>
              </div>

              {!isLocked && (
                <Link
                  href={task.targetUrl || "#"}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-btn transition-colors whitespace-nowrap ${task.isCompleted
                      ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
                      : "bg-primary text-white hover:bg-blue-600"
                    }`}
                >
                  {task.isCompleted ? "Ôn Lại" : "Làm Ngay"}
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
