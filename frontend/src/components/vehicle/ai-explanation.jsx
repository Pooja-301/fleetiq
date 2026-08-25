import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/fleet-data";
function AiExplanation({ vehicle }) {
  const { explanation } = vehicle;
  return <Card>
      <CardHeader>
        <div className="flex items-start gap-2.5">
          <span className="bg-primary/12 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle>AI explanation</CardTitle>
            <CardDescription>Why this vehicle scored {vehicle.healthScore}</CardDescription>
          </div>
          <Badge variant="muted" className="shrink-0">
            {Math.round(explanation.confidence * 100)}% confidence
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed">{explanation.summary}</p>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Contributing factors
          </span>

          <ul className="flex flex-col gap-3">
            {explanation.drivers.map((driver) => {
    const bad = driver.direction === "increases";
    return <li key={driver.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center",
        bad ? "text-destructive" : "text-success"
      )}
    >
                      {bad ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">{driver.label}</span>
                    <span className="tabular text-muted-foreground text-xs">
                      {Math.round(driver.weight * 100)}%
                    </span>
                  </div>

                  <div className="bg-secondary ml-6 h-1.5 overflow-hidden rounded-full">
                    <div
      className={cn("h-full rounded-full", bad ? "bg-destructive" : "bg-success")}
      style={{ width: `${Math.round(driver.weight * 100)}%` }}
    />
                  </div>
                </li>;
  })}
          </ul>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-[11px]">
          <span>Model {explanation.modelVersion}</span>
          <span aria-hidden="true">·</span>
          <span>Evaluated {formatDate(explanation.evaluatedAt)}</span>
        </div>
      </CardContent>
    </Card>;
}
export {
  AiExplanation
};
