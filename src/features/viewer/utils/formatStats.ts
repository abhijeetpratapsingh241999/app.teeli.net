export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export interface PerformanceGrade {
  emoji: string;
  label: string;
  color: string;
  description: string;
}

export function getPerformanceGrade(triangles: number): PerformanceGrade {
  if (triangles < 100000) {
    return {
      emoji: "🟢",
      label: "Excellent",
      color: "text-green-400",
      description: "Mobile Ready",
    };
  }
  if (triangles < 500000) {
    return {
      emoji: "🟡",
      label: "Good",
      color: "text-yellow-400",
      description: "Desktop Optimized",
    };
  }
  if (triangles < 1000000) {
    return {
      emoji: "🟠",
      label: "Moderate",
      color: "text-orange-400",
      description: "High-End Desktop",
    };
  }
  return {
    emoji: "🔴",
    label: "Heavy",
    color: "text-red-400",
    description: "Desktop Only",
  };
}
