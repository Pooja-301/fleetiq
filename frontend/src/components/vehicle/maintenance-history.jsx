import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatKm } from "@/lib/fleet-data";
const statusMeta = {
  completed: { label: "Completed", variant: "success", dot: "bg-success" },
  scheduled: { label: "Scheduled", variant: "muted", dot: "bg-primary" },
  overdue: { label: "Overdue", variant: "danger", dot: "bg-destructive" }
};
function MaintenanceHistory({ history }) {
  const totalSpend = history.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.cost, 0);
  return <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <CardTitle>Maintenance history</CardTitle>
            <CardDescription>{history.length} records · lifetime spend {formatCurrency(totalSpend)}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ol className="relative flex flex-col gap-5">
          {history.map((record, i) => {
    const meta = statusMeta[record.status];
    const isLast = i === history.length - 1;
    return <li key={record.id} className="relative flex gap-3.5 pl-1">
                {
      /* timeline rail */
    }
                {!isLast ? <span aria-hidden="true" className="bg-border absolute top-4 left-[7px] h-full w-px" /> : null}

                <span
      aria-hidden="true"
      className={cn("ring-card relative mt-1.5 size-2 shrink-0 rounded-full ring-4", meta.dot)}
    />

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{record.type}</span>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>

                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px]">
                    <span className="tabular">{formatDate(record.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{record.workshop}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular">{formatKm(record.odometer)}</span>
                    {record.cost > 0 ? <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular text-foreground font-medium">{formatCurrency(record.cost)}</span>
                      </> : null}
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">{record.notes}</p>
                </div>
              </li>;
  })}
        </ol>
      </CardContent>
    </Card>;
}
export {
  MaintenanceHistory
};
