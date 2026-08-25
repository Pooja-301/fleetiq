import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { priorityAlerts, relativeTime } from "@/lib/fleet-data";
const severityConfig = {
  critical: {
    icon: CircleAlert,
    badge: "danger",
    label: "Critical",
    accent: "bg-destructive",
    iconWrap: "bg-destructive/12 text-destructive"
  },
  warning: {
    icon: TriangleAlert,
    badge: "warning",
    label: "Warning",
    accent: "bg-warning",
    iconWrap: "bg-warning/15 text-warning"
  },
  info: {
    icon: Info,
    badge: "info",
    label: "Info",
    accent: "bg-primary",
    iconWrap: "bg-primary/12 text-primary"
  }
};
function AlertRow({ alert }) {
  const config = severityConfig[alert.severity];
  const Icon = alert.category === "overdue" ? CalendarClock : config.icon;
  return <div className="hover:bg-muted/40 relative flex gap-3 rounded-lg py-3 pr-2 pl-4 transition-colors">
      <span aria-hidden="true" className={cn("absolute top-3 bottom-3 left-0 w-0.5 rounded-full", config.accent)} />

      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", config.iconWrap)}>
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium">{alert.title}</p>
          <Badge variant={config.badge}>{config.label}</Badge>
          {alert.category === "overdue" ? <Badge variant="muted">Overdue</Badge> : null}
        </div>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{alert.description}</p>
        <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px]">
          <Link to={`/vehicles/${alert.vehicleId}`} className="text-primary font-medium hover:underline">
            {alert.vehicleId}
          </Link>
          <span aria-hidden="true">·</span>
          <span className="truncate">{alert.vehicleName}</span>
          <span aria-hidden="true">·</span>
          <span>{relativeTime(alert.raisedAt)}</span>
        </div>
      </div>

      <Button variant="ghost" size="icon-sm" asChild className="mt-0.5 shrink-0">
        <Link to={`/vehicles/${alert.vehicleId}`} aria-label={`Review ${alert.vehicleId}`}>
          <ArrowRight />
        </Link>
      </Button>
    </div>;
}
function PriorityAlerts() {
  const critical = priorityAlerts.filter((a) => a.severity === "critical");
  const others = priorityAlerts.filter((a) => a.severity !== "critical");
  return <Card>
      <CardHeader className="flex-row items-start gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Priority alerts</CardTitle>
          <CardDescription>Ranked by severity and predicted time to failure</CardDescription>
        </div>
        <Badge variant="danger" className="ml-auto shrink-0">
          {critical.length} critical
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        {critical.map((alert) => <AlertRow key={alert.id} alert={alert} />)}

        {others.length > 0 ? <>
            <p className="text-muted-foreground px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase">
              Lower severity
            </p>
            {others.map((alert) => <AlertRow key={alert.id} alert={alert} />)}
          </> : null}

        <Button variant="outline" size="sm" asChild className="mt-3 w-full">
          <Link to="/alerts">
            View all alerts
            <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>;
}
export {
  PriorityAlerts
};
