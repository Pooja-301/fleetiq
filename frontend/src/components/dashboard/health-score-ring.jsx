import { cn } from "@/lib/utils";
import { healthTone } from "@/lib/fleet-data";
const toneColor = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive"
};
function HealthScoreRing({
  score,
  size = 132,
  strokeWidth = 10,
  label = "Fleet score",
  className
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(Math.max(score, 0), 100) / 100 * circumference;
  const tone = toneColor[healthTone(score)];
  return <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    className="-rotate-90"
    role="img"
    aria-label={`${label}: ${score} out of 100`}
  >
        <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    strokeWidth={strokeWidth}
    className="text-secondary"
    stroke="currentColor"
  />
        <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    fill="none"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeDasharray={circumference}
    strokeDashoffset={offset}
    className={tone}
    stroke="currentColor"
  />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-2xl font-semibold tracking-tight">{score}</span>
        <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">/ 100</span>
      </div>
    </div>;
}
export {
  HealthScoreRing
};
