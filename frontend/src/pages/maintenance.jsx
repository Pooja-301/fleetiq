import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  CalendarClock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter,
  PlusCircle,
  Building2,
  Banknote,
  Truck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { fetchVehicles } from "@/lib/api";
import { vehicles as mockVehicles, formatDate, formatCurrency } from "@/lib/fleet-data";

export default function MaintenancePage() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [activeTab, setActiveTab] = useState("urgent"); // urgent | scheduled | completed
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [successBanner, setSuccessBanner] = useState(null);

  useEffect(() => {
    fetchVehicles()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setVehicles(data);
      })
      .catch(() => {});
  }, []);

  // Filter lists
  const urgentVehicles = vehicles.filter(
    (v) => v.riskLevel === "high" || v.nextMaintenanceIn.toLowerCase().includes("overdue")
  );

  const upcomingVehicles = vehicles.filter(
    (v) => v.riskLevel === "medium" || (v.nextMaintenanceIn.toLowerCase().includes("in ") && !v.nextMaintenanceIn.toLowerCase().includes("overdue"))
  );

  const completedHistory = vehicles.flatMap((v) =>
    (v.history || []).map((h) => ({ ...h, vehicleId: v.id, vehicleName: v.name, vehiclePlate: v.plate }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Quick Action: Book Bay
  const handleAssignBay = (vehicleId) => {
    setScheduledJobs((prev) => [...prev, vehicleId]);
    setSuccessBanner(`Workshop bay reserved for ${vehicleId} at regional hub!`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const totalUrgentCost = urgentVehicles.reduce(
    (sum, v) => sum + (v.recommendation?.estimatedCost || 50000),
    0
  );

  return (
    <AppShell
      title="Maintenance Operations"
      description="Service bay allocation, urgent work orders, and maintenance execution planning"
    >
      {successBanner && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{successBanner}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSuccessBanner(null)} className="h-6 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Urgent Work Orders
            </CardTitle>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{urgentVehicles.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">High risk or overdue intervals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Scheduled Bay Visits
            </CardTitle>
            <CalendarClock className="size-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{upcomingVehicles.length + scheduledJobs.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Booked across 8 regional hubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Estimated Urgent Cost
            </CardTitle>
            <Banknote className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalUrgentCost)}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Preventative vs emergency savings: ~38%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Fleet Bays
            </CardTitle>
            <Building2 className="size-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 / 20</div>
            <p className="text-[11px] text-muted-foreground mt-1">70% workshop bay utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-3">
        <Button
          variant={activeTab === "urgent" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("urgent")}
          className="gap-2"
        >
          <AlertTriangle className="size-3.5" />
          Urgent & Overdue ({urgentVehicles.length})
        </Button>
        <Button
          variant={activeTab === "scheduled" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("scheduled")}
          className="gap-2"
        >
          <Clock className="size-3.5" />
          Scheduled Queue ({upcomingVehicles.length})
        </Button>
        <Button
          variant={activeTab === "completed" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("completed")}
          className="gap-2"
        >
          <CheckCircle2 className="size-3.5" />
          Completed Service Log ({completedHistory.length})
        </Button>
      </div>

      {/* Tab Content: Urgent Work Orders */}
      {activeTab === "urgent" && (
        <div className="grid grid-cols-1 gap-4">
          {urgentVehicles.map((vehicle) => {
            const isBooked = scheduledJobs.includes(vehicle.id);
            const overdue = vehicle.nextMaintenanceIn.toLowerCase().includes("overdue");
            return (
              <Card key={vehicle.id} className="overflow-hidden border-l-4 border-l-destructive">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base">{vehicle.id}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-medium text-foreground">{vehicle.name}</span>
                        <RiskBadge level={vehicle.riskLevel} />
                        {overdue && <Badge variant="danger">{vehicle.nextMaintenanceIn}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Depot: <strong>{vehicle.depot}</strong> · Driver: {vehicle.driver} · Odometer: {vehicle.mileage.toLocaleString("en-IN")} km
                      </p>
                      <div className="pt-2">
                        <p className="text-xs text-foreground font-medium flex items-center gap-1.5">
                          <Wrench className="size-3.5 text-warning" />
                          Recommended Intervention:
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {vehicle.recommendation?.action || "Inspect thermal and braking subsystems."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground uppercase">Estimated Budget</span>
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(vehicle.recommendation?.estimatedCost || 65000)}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          Downtime: {vehicle.recommendation?.estimatedDowntime || "2-3 days"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild className="text-xs">
                          <Link to={`/vehicles/${vehicle.id}`}>
                            Details <ArrowRight className="size-3 ml-1" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          disabled={isBooked}
                          onClick={() => handleAssignBay(vehicle.id)}
                          className={`text-xs gap-1.5 ${isBooked ? "bg-muted text-muted-foreground" : ""}`}
                        >
                          {isBooked ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-green-500" />
                              Bay Reserved
                            </>
                          ) : (
                            <>
                              <Building2 className="size-3.5" />
                              Assign Workshop Bay
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab Content: Scheduled Queue */}
      {activeTab === "scheduled" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">{vehicle.id}</CardTitle>
                    <CardDescription className="text-xs">{vehicle.name}</CardDescription>
                  </div>
                  <RiskBadge level={vehicle.riskLevel} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between border-b pb-1.5 text-muted-foreground">
                  <span>Scheduled Window:</span>
                  <span className="font-medium text-foreground">{vehicle.nextMaintenanceIn}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 text-muted-foreground">
                  <span>Assigned Depot:</span>
                  <span className="font-medium text-foreground">{vehicle.depot}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 text-muted-foreground">
                  <span>Planned Budget:</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(vehicle.recommendation?.estimatedCost || 24000)}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full text-xs mt-2">
                  <Link to={`/vehicles/${vehicle.id}`}>View Telemetry</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Content: Completed History */}
      {activeTab === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Historical Maintenance Log</CardTitle>
            <CardDescription className="text-xs">Verified service receipts and parts replacement records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {completedHistory.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{item.vehicleId}</span>
                      <span className="text-muted-foreground">({item.vehicleName})</span>
                      <Badge variant="muted" className="text-[10px]">{item.type}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{item.notes}</p>
                    <span className="text-[10px] text-muted-foreground">{item.workshop}</span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-semibold text-foreground">{formatCurrency(item.cost)}</span>
                    <p className="text-[10px] text-muted-foreground">{formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
