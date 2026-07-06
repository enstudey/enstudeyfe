import React from "react";
import { GraduationCap, BookOpen, HelpCircle, Lightbulb, PenTool } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "lucide:graduation-cap": GraduationCap,
  "lucide:book-open": BookOpen,
  "lucide:lightbulb": Lightbulb,
  "lucide:pen-tool": PenTool,
};

interface CategoryIconProps {
  icon: string;
  iconType: "EMOJI" | "SVG";
  className?: string;
  size?: number;
}

export default function CategoryIcon({ icon, iconType, className = "", size = 16 }: CategoryIconProps) {
  // Chống Layout Shift bằng cách giữ khung có kích thước cố định
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  if (iconType === "EMOJI") {
    return (
      <span 
        className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={style}
        role="img"
        aria-label="Category Emoji"
      >
        {icon}
      </span>
    );
  }

  if (iconType === "SVG") {
    const IconComponent = iconMap[icon] || HelpCircle;
    return (
      <span 
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={style}
      >
        <IconComponent className="w-full h-full text-current" />
      </span>
    );
  }

  return null;
}
