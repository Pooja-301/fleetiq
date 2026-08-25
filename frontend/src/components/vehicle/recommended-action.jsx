import { CalendarPlus, Clock, IndianRupee, Target, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/fleet-data";
const priorityMeta = {
  immediate: { label: "Immediate", variant: "danger" },
  high: { label: "High priority", variant: "warning" },
  planned: { label: "Planned", variant: "muted" }
};
function RecommendedAction({ vehicle }) {
  const { recommendation } = vehicle;
  const priority = priorityMeta[recommendation.priority];
  return <Card>
      <CardHeader>
        <div className="flex items-start gap-2.5">
          <span className="bg-secondary text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Target className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle>Recommended action</CardTitle>
            <CardDescription>{recommendation.window}</CardDescription>
          </div>
          <Badge variant={priority.variant} className="shrink-0">
            {priority.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="bg-secondary/50 flex flex-col gap-2 rounded-lg p-4">
          <span className="text-sm font-semibold">{recommendation.action}</span>
          <p className="text-muted-foreground text-xs leading-relaxed">{recommendation.rationale}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5">
            <IndianRupee className="text-muted-foreground size-4 shrink-0" />
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Est. cost
              </span>
              <span className="tabular truncate text-sm font-medium">
                {formatCurrency(recommendation.estimatedCost)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="text-muted-foreground size-4 shrink-0" />
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Downtime
              </span>
              <span className="truncate text-sm font-medium">{recommendation.estimatedDowntime}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested steps
          </span>
          <ol className="flex flex-col gap-2">
            {recommendation.steps.map((step, i) => <li key={step} className="flex gap-2.5">
                <span className="bg-secondary text-muted-foreground tabular flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-xs leading-relaxed">{step}</span>
              </li>)}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button size="sm">
            <CalendarPlus />
            Schedule maintenance
          </Button>
          <Button size="sm" variant="outline">
            <Wrench />
            Assign workshop
          </Button>
        </div>
      </CardContent>
    </Card>;
}
export {
  RecommendedAction
};
