import { useState, useEffect } from "react";
import { AlertTriangle, Gauge, ShieldCheck, Truck, Zap } from "lucide-react";
import { HealthScoreRing } from "@/components/dashboard/health-score-ring";
import { HealthTrendChart } from "@/components/dashboard/health-trend-chart";
import { PriorityAlerts } from "@/components/dashboard/priority-alerts";
import { RiskDistribution } from "@/components/dashboard/risk-distribution";
import { StatCard } from "@/components/dashboard/stat-card";
import { VehicleHealthSummary } from "@/components/dashboard/vehicle-health-summary";
import { VehicleTable } from "@/components/dashboard/vehicle-table";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { fleetSummary as mockSummary } from "@/lib/fleet-data";
import { fetchAllRiskScores } from "@/lib/api";

function DashboardPage() {
  const [summary, setSummary] = useState(mockSummary);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchAllRiskScores()
      .then((res) => {
        if (res && res.summary) {
          setSummary((prev) => ({
            ...prev,
            totalVehicles: res.summary.total ?? prev.totalVehicles,
            healthyVehicles: res.summary.low ?? prev.healthyVehicles,
            mediumRisk: res.summary.medium ?? prev.mediumRisk,
            highRisk: res.summary.high ?? prev.highRisk,
            fleetHealthScore: Math.round(100 - (res.summary.avgRisk || 22)),
            previousHealthScore: prev.previousHealthScore || 75.1,
            activeToday: Math.round((res.summary.total || 2500) * 0.86),
            inWorkshop: res.summary.high || 12,
            deltas: prev.deltas || { total: 6, healthy: 9, medium: -3, high: -2 },
          }));
          setIsLive(true);
        }
      })
      .catch(() => {});
  }, []);

  const deltas = summary?.deltas || { total: 6, healthy: 9, medium: -3, high: -2 };
  const currentScore = summary?.fleetHealthScore || 78.4;
  const prevScore = summary?.previousHealthScore || 75.1;
  const scoreDelta = +(currentScore - prevScore).toFixed(1);
  return <AppShell
    title="Fleet Overview"
    description={
      <span className="flex items-center gap-2">
        <span>Predictive health and maintenance posture across all depots</span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
            <Zap className="size-2.5" />
            LIVE BACKEND
          </span>
        )}
      </span>
    }
  >
      {
    /* KPI row */
  }
      <section aria-labelledby="kpi-heading" className="flex flex-col gap-4">
        <h2 id="kpi-heading" className="sr-only">
          Fleet key metrics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Vehicles"
            value={String(summary.totalVehicles)}
            icon={Truck}
            delta={deltas.total}
            hint={`${summary.activeToday} active today · ${summary.inWorkshop} in workshop`}
          />
          <StatCard
            label="Healthy Vehicles"
            value={String(summary.healthyVehicles)}
            icon={ShieldCheck}
            tone="success"
            delta={deltas.healthy}
            hint={`${Math.round((summary.healthyVehicles / (summary.totalVehicles || 1)) * 100)}% of fleet at score 80+`}
          />
          <StatCard
            label="Medium Risk"
            value={String(summary.mediumRisk)}
            icon={Gauge}
            tone="warning"
            delta={deltas.medium}
            invertDelta
            hint="Monitor — service window within 30 days"
          />
          <StatCard
            label="High Risk"
            value={String(summary.highRisk)}
            icon={AlertTriangle}
            tone="danger"
            delta={deltas.high}
            invertDelta
            hint="Requires intervention this week"
          />

          <Card className="flex flex-row items-center gap-4 p-5 sm:col-span-2 xl:col-span-1">
            <HealthScoreRing score={Math.round(summary.fleetHealthScore)} size={92} strokeWidth={8} />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium">Fleet Health Score</span>
              <span className="tabular text-success text-sm font-semibold">
                +{scoreDelta} vs last month
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Weighted across engine, brakes, tyres and battery signals
              </p>
            </div>
          </Card>
        </div>
      </section>

      {
    /* Fleet health */
  }
      <section aria-labelledby="health-heading" className="flex flex-col gap-4">
        <h2 id="health-heading" className="text-sm font-semibold tracking-tight">
          Fleet health
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HealthTrendChart />
          </div>
          <RiskDistribution />
        </div>

        <VehicleHealthSummary />
      </section>

      {
    /* Priority alerts */
  }
      <section aria-labelledby="alerts-heading" className="flex flex-col gap-4">
        <h2 id="alerts-heading" className="text-sm font-semibold tracking-tight">
          Priority alerts
        </h2>
        <PriorityAlerts />
      </section>

      {
    /* Vehicles */
  }
      <section aria-labelledby="vehicles-heading" className="flex flex-col gap-4">
        <h2 id="vehicles-heading" className="text-sm font-semibold tracking-tight">
          Vehicles needing attention
        </h2>
        <VehicleTable compact />
      </section>
    </AppShell>;
}
export {
  DashboardPage as default
};
