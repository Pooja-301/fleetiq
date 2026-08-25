import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const toneStyles = {
  neutral: { icon: "bg-secondary text-muted-foreground", value: "text-foreground" },
  success: { icon: "bg-success/12 text-success", value: "text-foreground" },
  warning: { icon: "bg-warning/15 text-warning", value: "text-foreground" },
  danger: { icon: "bg-destructive/12 text-destructive", value: "text-foreground" }
};
function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  delta,
  deltaLabel,
  hint,
  invertDelta = false
}) {
  const styles = toneStyles[tone];
  const hasDelta = typeof delta === "number" && delta !== 0;
  const isPositive = hasDelta ? invertDelta ? delta < 0 : delta > 0 : false;
  return <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", styles.icon)}>
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn("tabular text-2xl font-semibold tracking-tight", styles.value)}>{value}</span>
        {hasDelta ? <span
    className={cn(
      "tabular flex items-center gap-0.5 text-xs font-medium",
      isPositive ? "text-success" : "text-destructive"
    )}
  >
            {delta > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {delta > 0 ? "+" : ""}
            {delta}
          </span> : null}
      </div>

      <p className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">{hint ?? deltaLabel}</p>
    </Card>;
}
export {
  StatCard
};
