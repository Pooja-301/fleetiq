import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  Droplets,
  Fuel,
  Gauge,
  MapPin,
  TriangleAlert,
  User,
  Zap
} from "lucide-react";
import { HealthScoreRing } from "@/components/dashboard/health-score-ring";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { AppShell } from "@/components/layout/app-shell";
import { AiExplanation } from "@/components/vehicle/ai-explanation";
import { ConditionCard } from "@/components/vehicle/condition-card";
import { MaintenanceHistory } from "@/components/vehicle/maintenance-history";
import { RecommendedAction } from "@/components/vehicle/recommended-action";
import { WhatIfSimulator } from "@/components/vehicle/what-if-simulator";
import { StrategyComparison } from "@/components/vehicle/strategy-comparison";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDate, formatKm, getVehicle, relativeTime } from "@/lib/fleet-data";
import { fetchVehicleRisk, fetchVehicle } from "@/lib/api";

function VehicleDetailPage() {
  const { id } = useParams();
  const mockFallback = id ? getVehicle(id) : undefined;
  const [vehicleData, setVehicleData] = useState(mockFallback || null);
  const [liveRisk, setLiveRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetchVehicle(id)
      .then((data) => {
        if (data) setVehicleData(data);
      })
      .catch(() => {
        if (mockFallback) setVehicleData(mockFallback);
      })
      .finally(() => setLoading(false));

    fetchVehicleRisk(id)
      .then(setLiveRisk)
      .catch(() => setLiveRisk(null));
  }, [id]);

  const vehicle = vehicleData;

  // Merge live risk into vehicle
  const enriched = vehicle && liveRisk
    ? {
        ...vehicle,
        riskLevel:       liveRisk.riskLevel,
        riskProbability: liveRisk.riskProbability,
        explanation:     liveRisk.explanation,
        recommendation:  liveRisk.recommendation,
      }
    : vehicle;
  if (!vehicle) {
    return <AppShell title="Vehicle not found">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <TriangleAlert className="text-muted-foreground size-8" />
            <p className="text-sm font-medium">No vehicle matches this ID</p>
            <p className="text-muted-foreground text-xs">
              The vehicle may have been retired or the link is incorrect.
            </p>
            <Button variant="outline" size="sm" asChild className="mt-2">
              <Link to="/vehicles">
                <ArrowLeft />
                Back to vehicles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>;
  }
  const riskPct = Math.round((enriched ?? vehicle).riskProbability * 100);
  const overdue = vehicle.nextMaintenanceIn.toLowerCase().startsWith("overdue");
  const facts = [
    { icon: MapPin, label: "Depot", value: vehicle.depot },
    { icon: User, label: "Driver", value: vehicle.driver },
    { icon: Gauge, label: "Avg daily", value: `${vehicle.avgDailyKm} km` },
    { icon: Fuel, label: "Efficiency", value: `${vehicle.fuelEfficiency} km/l` },
    { icon: Droplets, label: "Utilisation", value: `${vehicle.utilisation}%` },
    { icon: CalendarClock, label: "In service since", value: formatDate(vehicle.inServiceSince) }
  ];
  return <AppShell title={vehicle.name} description={`${vehicle.id} · ${vehicle.plate} · ${vehicle.type}`}>

      {
    /* Back link + title block */
  }
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/vehicles">
            <ArrowLeft />
            All vehicles
          </Link>
        </Button>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge level={(enriched ?? vehicle).riskLevel} />
          {overdue ? <Badge variant="danger">
              <CalendarClock />
              {vehicle.nextMaintenanceIn}
            </Badge> : <Badge variant="muted">
              <CalendarClock />
              {vehicle.nextMaintenanceIn}
            </Badge>}
        </div>
      </div>

      {
    /* Hero: score + risk + key figures */
  }
      <Card>
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <HealthScoreRing score={vehicle.healthScore} size={116} strokeWidth={9} label="Vehicle health" />
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Vehicle health score
              </span>
              <span className="text-sm font-medium">
                {vehicle.healthScore >= 80 ? "Healthy" : vehicle.healthScore >= 60 ? "Monitor closely" : "Needs intervention"}
              </span>
              <p className="text-muted-foreground max-w-[22ch] text-[11px] leading-relaxed">
                Composite of engine, brakes, tyres and battery signals
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden h-24 lg:block" />
          <Separator className="lg:hidden" />

          {
    /* Risk probability */
  }
          <div className="flex flex-col gap-2 lg:w-56">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Risk probability
              </span>
              <span
    className={cn(
      "tabular text-lg font-semibold",
      riskPct >= 70 ? "text-destructive" : riskPct >= 40 ? "text-warning" : "text-success"
    )}
  >
                {riskPct}%
              </span>
            </div>
            <div
    className="bg-secondary h-2 overflow-hidden rounded-full"
    role="meter"
    aria-valuenow={riskPct}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Failure risk probability"
  >
              <div
    className={cn(
      "h-full rounded-full",
      riskPct >= 70 ? "bg-destructive" : riskPct >= 40 ? "bg-warning" : "bg-success"
    )}
    style={{ width: `${riskPct}%` }}
  />
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Chance of an unplanned failure in the next 30 days
            </p>
          </div>

          <Separator orientation="vertical" className="hidden h-24 lg:block" />
          <Separator className="lg:hidden" />

          {
    /* Mileage + service dates */
  }
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Mileage
              </span>
              <span className="tabular text-sm font-semibold">{formatKm(vehicle.mileage)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Last service
              </span>
              <span className="tabular text-sm font-semibold">{formatDate(vehicle.lastService)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Next maintenance
              </span>
              <span className="tabular text-sm font-semibold">{formatDate(vehicle.nextMaintenance)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {
    /* Component conditions */
  }
      <section aria-labelledby="condition-heading" className="flex flex-col gap-4">
        <h2 id="condition-heading" className="text-sm font-semibold tracking-tight">
          Component condition
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vehicle.components.map((condition) => <ConditionCard key={condition.key} condition={condition} />)}
        </div>
      </section>

      {
    /* AI explanation + recommended action */
  }
      <section aria-labelledby="ai-heading" className="flex flex-col gap-4">
        <h2 id="ai-heading" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          Predictive assessment
          {liveRisk && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
              <Zap className="size-2.5" />
              LIVE
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AiExplanation vehicle={enriched ?? vehicle} />
          <RecommendedAction vehicle={enriched ?? vehicle} />
        </div>

        {/* What-If Scenario Sandbox */}
        <WhatIfSimulator vehicle={enriched ?? vehicle} />

        {/* 3-Way Strategy Comparison Decision Engine */}
        <StrategyComparison vehicle={enriched ?? vehicle} />
      </section>

      {
    /* History + alerts + specs */
  }
      <section aria-labelledby="records-heading" className="flex flex-col gap-4">
        <h2 id="records-heading" className="text-sm font-semibold tracking-tight">
          Records
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MaintenanceHistory history={vehicle.history} />
          </div>

          <div className="flex flex-col gap-4">
            {
    /* Recent alerts */
  }
            <Card>
              <CardHeader>
                <div className="flex items-start gap-2.5">
                  <span className="bg-secondary text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <BellRing className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <CardTitle>Recent alerts</CardTitle>
                    <CardDescription>{vehicle.alerts.length} open on this vehicle</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {vehicle.alerts.length > 0 ? <ul className="flex flex-col gap-3">
                    {vehicle.alerts.map((alert) => {
    const meta = severityMeta[alert.severity];
    return <li key={alert.id} className="bg-secondary/40 flex flex-col gap-1.5 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <span
      aria-hidden="true"
      className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", meta.dot)}
    />
                            <span className="min-w-0 flex-1 text-xs font-medium">{alert.title}</span>
                            <Badge variant={meta.variant} className="shrink-0">
                              {meta.label}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground pl-3.5 text-[11px] leading-relaxed">
                            {alert.description}
                          </p>
                          <span className="text-muted-foreground pl-3.5 text-[10px]">
                            {relativeTime(alert.raisedAt)}
                          </span>
                        </li>;
  })}
                  </ul> : <p className="text-muted-foreground py-4 text-center text-xs">No open alerts on this vehicle.</p>}
              </CardContent>
            </Card>

            {
    /* Vehicle facts */
  }
            <Card>
              <CardHeader>
                <CardTitle>Vehicle details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-3">
                  {facts.map((fact) => <div key={fact.label} className="flex items-center gap-2.5">
                      <fact.icon className="text-muted-foreground size-4 shrink-0" />
                      <dt className="text-muted-foreground flex-1 text-xs">{fact.label}</dt>
                      <dd className="text-xs font-medium">{fact.value}</dd>
                    </div>)}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>;
}
export {
  VehicleDetailPage as default
};
