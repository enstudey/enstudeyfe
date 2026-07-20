"use client";

import React, { useState } from "react";
import { SkillScore } from "@/types/analytics";
import { DEFAULT_SKILLS } from "@/lib/analytics-constants";

interface RadarChartProps {
  skills: SkillScore[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ skills }) => {
  const [hoveredSkill, setHoveredSkill] = useState<SkillScore | null>(null);

  const size = 320;
  const center = size / 2;
  const radius = center - 50;

  const chartSkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;
  const totalAxes = chartSkills.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const polygonPoints = chartSkills
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, skill.score);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid Level Polygons */}
          {levels.map((level, lvlIdx) => {
            const levelPoints = chartSkills
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level * 100);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={lvlIdx}
                points={levelPoints}
                className="fill-none stroke-slate-200 dark:stroke-slate-800 stroke-[1]"
                strokeDasharray={lvlIdx < 3 ? "3 3" : undefined}
              />
            );
          })}

          {/* Axes Lines */}
          {chartSkills.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800 stroke-[1]"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#radarGradient)"
            className="stroke-violet-500 stroke-[2.5] transition-all duration-500 ease-out"
          />

          {/* Data Dots & Axis Labels */}
          {chartSkills.map((skill, i) => {
            const { x, y } = getCoordinates(i, skill.score);
            const labelCoords = getCoordinates(i, 118);

            return (
              <g key={i}>
                {/* Data Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-violet-600 stroke-white dark:stroke-slate-900 stroke-[2] cursor-pointer hover:r-7 transition-all"
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />

                {/* Axis Label Text */}
                <text
                  x={labelCoords.x}
                  y={labelCoords.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300"
                >
                  {skill.name} ({skill.score}%)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredSkill && (
          <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 animate-in fade-in">
            <span className="font-bold">{hoveredSkill.name}:</span> {hoveredSkill.score}% Tỷ lệ làm đúng
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {chartSkills.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-xs font-medium text-violet-700 dark:text-violet-300"
          >
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span>{s.name}:</span>
            <span className="font-bold">{s.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
