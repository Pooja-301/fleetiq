import { AlertTriangle, Gauge, ShieldCheck, Truck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { VehicleTable } from "@/components/dashboard/vehicle-table";
import { AppShell } from "@/components/layout/app-shell";
import { fleetSummary } from "@/lib/fleet-data";
function VehiclesPage() {
  return <AppShell title="Vehicles" description="Full fleet register with predicted health and risk scoring">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
    label="Total Vehicles"
    value={String(fleetSummary.totalVehicles)}
    icon={Truck}
    hint={`${fleetSummary.activeToday} active today`}
  />
        <StatCard
    label="Healthy"
    value={String(fleetSummary.healthyVehicles)}
    icon={ShieldCheck}
    tone="success"
    hint="Health score 80 and above"
  />
        <StatCard
    label="Medium Risk"
    value={String(fleetSummary.mediumRisk)}
    icon={Gauge}
    tone="warning"
    hint="Health score 60 to 79"
  />
        <StatCard
    label="High Risk"
    value={String(fleetSummary.highRisk)}
    icon={AlertTriangle}
    tone="danger"
    hint="Health score below 60"
  />
      </div>

      <VehicleTable />
    </AppShell>;
}
export {
  VehiclesPage as default
};
