import { useState, useEffect } from "react";
import { AlertTriangle, Gauge, ShieldCheck, Truck, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { VehicleTable } from "@/components/dashboard/vehicle-table";
import { AppShell } from "@/components/layout/app-shell";
import { fleetSummary as mockSummary } from "@/lib/fleet-data";
import { fetchAllRiskScores } from "@/lib/api";

function VehiclesPage() {
  const [summary, setSummary] = useState(mockSummary);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchAllRiskScores()
      .then((res) => {
        if (res && res.summary) {
          setSummary((prev) => ({
            ...prev,
            totalVehicles: res.summary.total,
            healthyVehicles: res.summary.low,
            mediumRisk: res.summary.medium,
            highRisk: res.summary.high,
          }));
          setIsLive(true);
        }
      })
      .catch(() => {});
  }, []);

  return <AppShell
    title="Vehicles"
    description={
      <span className="flex items-center gap-2">
        <span>Full fleet register with predicted health and risk scoring</span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
            <Zap className="size-2.5" />
            LIVE BACKEND
          </span>
        )}
      </span>
    }
  >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Vehicles"
          value={String(summary.totalVehicles)}
          icon={Truck}
          hint={`${summary.activeToday || summary.totalVehicles} active in fleet`}
        />
        <StatCard
          label="Healthy"
          value={String(summary.healthyVehicles)}
          icon={ShieldCheck}
          tone="success"
          hint="Low risk / healthy baseline"
        />
        <StatCard
          label="Medium Risk"
          value={String(summary.mediumRisk)}
          icon={Gauge}
          tone="warning"
          hint="Developing component wear"
        />
        <StatCard
          label="High Risk"
          value={String(summary.highRisk)}
          icon={AlertTriangle}
          tone="danger"
          hint="Immediate intervention required"
        />
      </div>

      <VehicleTable />
    </AppShell>;
}
export {
  VehiclesPage as default
};
