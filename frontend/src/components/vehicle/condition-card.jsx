import { BatteryCharging, CircleDot, Disc3, Cog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const icons = {
  engine: Cog,
  brakes: Disc3,
  tyres: CircleDot,
  battery: BatteryCharging
};
const statusMeta = {
  good: { label: "Good", text: "text-success", bar: "bg-success", chip: "bg-success/12 text-success" },
  monitor: { label: "Monitor", text: "text-primary", bar: "bg-primary", chip: "bg-primary/12 text-primary" },
  attention: { label: "Attention", text: "text-warning", bar: "bg-warning", chip: "bg-warning/15 text-warning" },
  critical: {
    label: "Critical",
    text: "text-destructive",
    bar: "bg-destructive",
    chip: "bg-destructive/12 text-destructive"
  }
};
function ConditionCard({ condition }) {
  const Icon = icons[condition.key];
  const meta = statusMeta[condition.status];
  return <Card className="gap-0 p-4">
      <div className="flex items-center gap-2.5">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", meta.chip)}>
          <Icon className="size-4" />
        </span>
        <span className="flex-1 text-sm font-medium">{condition.label}</span>
        <span className={cn("text-[10px] font-semibold tracking-wide uppercase", meta.text)}>{meta.label}</span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="tabular text-xl font-semibold tracking-tight">{condition.score}</span>
        <span className="text-muted-foreground text-xs">/ 100</span>
      </div>

      <div
    className="bg-secondary mt-2 h-1.5 overflow-hidden rounded-full"
    role="meter"
    aria-valuenow={condition.score}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`${condition.label} condition score`}
  >
        <div className={cn("h-full rounded-full", meta.bar)} style={{ width: `${condition.score}%` }} />
      </div>

      <p className="text-muted-foreground mt-2.5 text-[11px] leading-relaxed">{condition.detail}</p>
    </Card>;
}
export {
  ConditionCard
};
