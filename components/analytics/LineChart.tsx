"use client";

import React, { useState } from "react";
import { ScoreHistoryItem } from "@/types/analytics";
import { MAX_SCORES, ExamType } from "@/lib/analytics-constants";

interface LineChartProps {
  scoreHistory: ScoreHistoryItem[];
  examType: ExamType;
}

export const LineChart: React.FC<LineChartProps> = ({
  scoreHistory,
  examType,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScoreHistoryItem | null>(null);

  const isIelts = examType === "IELTS";
  const maxScore = MAX_SCORES[examType];

  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <span className="text-3xl mb-2">📈</span>
        <p className="text-xs font-medium">Chưa có lịch sử làm bài thi thử để vẽ biểu đồ tiến bộ.</p>
      </div>
    );
  }

  const width = 500;
  const height = 220;
  const padding = 40;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const pointsCoords = scoreHistory.map((item, idx) => {
    const x =
      scoreHistory.length > 1
        ? padding + (idx / (scoreHistory.length - 1)) * chartWidth
        : width / 2;
    const y =
      height - padding - (Math.min(item.score, maxScore) / maxScore) * chartHeight;
    return { x, y, item };
  });

  const pointsString = pointsCoords.map((p) => `${p.x},${p.y}`).join(" ");

  // Gradient area path string
  const firstX = pointsCoords[0]?.x || padding;
  const lastX = pointsCoords[pointsCoords.length - 1]?.x || width - padding;
  const areaString = `${pointsString} L ${lastX},${height - padding} L ${firstX},${height - padding} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
          const y = height - padding - ratio * chartHeight;
          const labelScore = isIelts
            ? (ratio * 9.0).toFixed(1)
            : Math.round(ratio * 990);
          return (
            <g key={idx}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800 stroke-[1]"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-slate-400"
              >
                {labelScore}
              </text>
            </g>
          );
        })}

        {/* Area Fill Below Line */}
        {pointsCoords.length > 1 && (
          <path d={`M ${areaString}`} fill="url(#lineAreaGradient)" />
        )}

        {/* Score Polyline */}
        {pointsCoords.length > 1 ? (
          <polyline
            points={pointsString}
            className="fill-none stroke-indigo-600 dark:stroke-indigo-400 stroke-[3] stroke-linecap-round stroke-linejoin-round"
          />
        ) : (
          <circle
            cx={pointsCoords[0].x}
            cy={pointsCoords[0].y}
            r="6"
            className="fill-indigo-600 stroke-white"
          />
        )}

        {/* Interactive Data Dots & Date Labels */}
        {pointsCoords.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-[2] cursor-pointer hover:r-7 transition-all"
              onMouseEnter={() => setHoveredPoint(p.item)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* X Axis Date Label */}
            <text
              x={p.x}
              y={height - padding + 16}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-500 dark:fill-slate-400"
            >
              {p.item.date}
            </text>
          </g>
        ))}
      </svg>

      {/* Hover Tooltip Overlay */}
      {hoveredPoint && (
        <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-xs px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700 animate-in fade-in">
          <div className="font-bold text-indigo-300">{hoveredPoint.title}</div>
          <div className="text-slate-300">
            Ngày: {hoveredPoint.date} | Điểm: <span className="font-bold text-amber-400">{hoveredPoint.score}</span>
          </div>
        </div>
      )}
    </div>
  );
};
