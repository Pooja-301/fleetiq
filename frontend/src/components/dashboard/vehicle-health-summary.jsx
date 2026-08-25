import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { componentHealthSummary, vehicleTypeBreakdown } from "@/lib/fleet-data";
function scoreTone(score) {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
}
function VehicleHealthSummary() {
  return <Card className="h-full">
      <CardHeader>
        <CardTitle>Vehicle health summary</CardTitle>
        <CardDescription>Average subsystem scores and fleet composition</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3.5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">By subsystem</p>
          {componentHealthSummary.map((item) => <div key={item.component} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium">{item.component}</span>
                <span className="text-muted-foreground text-[11px]">
                  <span className="tabular text-foreground font-semibold">{item.avgScore}</span> avg ·{" "}
                  <span className="tabular">{item.atRisk}</span> at risk
                </span>
              </div>
              <div className="bg-secondary h-1.5 overflow-hidden rounded-full">
                <div
    className={cn("h-full rounded-full", scoreTone(item.avgScore))}
    style={{ width: `${item.avgScore}%` }}
  />
              </div>
            </div>)}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">By vehicle type</p>
          {vehicleTypeBreakdown.map((item) => <div key={item.type} className="flex items-center gap-3 py-0.5">
              <span className="flex-1 truncate text-xs font-medium">{item.type}</span>
              <span className="tabular text-muted-foreground text-[11px]">{item.count} units</span>
              <span
    className={cn(
      "tabular w-7 text-right text-xs font-semibold",
      item.avgHealth >= 80 ? "text-success" : item.avgHealth >= 60 ? "text-warning" : "text-destructive"
    )}
  >
                {item.avgHealth}
              </span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}
export {
  VehicleHealthSummary
};
