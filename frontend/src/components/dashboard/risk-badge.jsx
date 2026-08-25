import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { riskMeta } from "@/lib/fleet-data";
const dotTone = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-destructive"
};
function RiskBadge({ level, className }) {
  const meta = riskMeta[level];
  return <Badge variant={meta.badge} className={cn("gap-1.5 py-1 pr-2 pl-1.5", className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotTone[level])} />
      {meta.label}
    </Badge>;
}
function HealthScoreBar({ score, className }) {
  const tone = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  return <div className={cn("flex items-center gap-2.5", className)}>
      <span className="tabular w-7 text-sm font-semibold">{score}</span>
      <div
    className="bg-secondary h-1.5 w-16 overflow-hidden rounded-full"
    role="meter"
    aria-valuenow={score}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Health score"
  >
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>;
}
export {
  HealthScoreBar,
  RiskBadge
};
