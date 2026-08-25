import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
  Flame,
  Gauge,
  CalendarClock,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchVehicles } from "@/lib/api";
import { vehicles as mockVehicles, relativeTime } from "@/lib/fleet-data";

export default function AlertsPage() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [filterSeverity, setFilterSeverity] = useState("all"); // all | critical | warning | info
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchVehicles()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setVehicles(data);
      })
      .catch(() => {});
  }, []);

  // Aggregate all alerts across all fleet vehicles
  const allAlerts = vehicles
    .flatMap((v) =>
      (v.alerts || []).map((a) => ({
        ...a,
        vehicleId: v.id,
        vehicleName: v.name,
        depot: v.depot,
        riskLevel: v.riskLevel,
      }))
    )
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
      return new Date(b.raisedAt) - new Date(a.raisedAt);
    });

  const filteredAlerts = allAlerts.filter((a) => {
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts((prev) => [...prev, alertId]);
    setToastMessage(`Alert ${alertId} acknowledged and assigned to depot engineer.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const criticalCount = allAlerts.filter((a) => a.severity === "critical").length;
  const warningCount = allAlerts.filter((a) => a.severity === "warning").length;
  const infoCount = allAlerts.filter((a) => a.severity === "info").length;

  const severityIcon = (severity) => {
    if (severity === "critical") return <Flame className="size-4 text-destructive" />;
    if (severity === "warning") return <AlertTriangle className="size-4 text-warning" />;
    return <Info className="size-4 text-primary" />;
  };

  return (
    <AppShell
      title="Alerts & Telemetry Exceptions"
      description="Real-time sensor threshold violations, overdue maintenance escalations, and subsystem anomalies"
    >
      {toastMessage && (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span>{toastMessage}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setToastMessage(null)} className="h-6 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* KPI Severity Counters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          onClick={() => setFilterSeverity(filterSeverity === "critical" ? "all" : "critical")}
          className={`cursor-pointer transition border-l-4 border-l-destructive ${
            filterSeverity === "critical" ? "ring-2 ring-destructive" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Critical Alerts</CardTitle>
            <Flame className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Immediate intervention required</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterSeverity(filterSeverity === "warning" ? "all" : "warning")}
          className={`cursor-pointer transition border-l-4 border-l-warning ${
            filterSeverity === "warning" ? "ring-2 ring-warning" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Warnings</CardTitle>
            <AlertTriangle className="size-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{warningCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Developing component wear</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterSeverity(filterSeverity === "info" ? "all" : "info")}
          className={`cursor-pointer transition border-l-4 border-l-primary ${
            filterSeverity === "info" ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Advisories & Info</CardTitle>
            <Info className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{infoCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Routine telemetry notices</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant={filterSeverity === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity("all")}
            className="text-xs"
          >
            All Alerts ({allAlerts.length})
          </Button>
          <Button
            variant={filterSeverity === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity("critical")}
            className="text-xs text-destructive hover:text-destructive"
          >
            Critical Only ({criticalCount})
          </Button>
          <Button
            variant={filterSeverity === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity("warning")}
            className="text-xs text-warning hover:text-warning"
          >
            Warnings Only ({warningCount})
          </Button>
        </div>

        <span className="text-xs text-muted-foreground">
          Showing {filteredAlerts.length} of {allAlerts.length} total events
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isAck = acknowledgedAlerts.includes(alert.id);
          const badgeVariant =
            alert.severity === "critical" ? "danger" : alert.severity === "warning" ? "warning" : "muted";

          return (
            <Card
              key={alert.id}
              className={`transition ${
                alert.severity === "critical"
                  ? "border-destructive/40 bg-destructive/5"
                  : alert.severity === "warning"
                  ? "border-warning/30 bg-warning/5"
                  : ""
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="size-9 rounded-lg bg-background border flex items-center justify-center shrink-0 mt-0.5">
                      {severityIcon(alert.severity)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{alert.title}</span>
                        <Badge variant={badgeVariant} className="uppercase text-[10px]">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{alert.category}</span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span>
                          Vehicle: <strong className="text-foreground">{alert.vehicleId}</strong> ({alert.vehicleName})
                        </span>
                        <span>·</span>
                        <span>Depot: <strong>{alert.depot}</strong></span>
                        <span>·</span>
                        <span>Raised: <strong>{relativeTime(alert.raisedAt)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button variant="outline" size="sm" asChild className="text-xs">
                      <Link to={`/vehicles/${alert.vehicleId}`}>
                        Telemetry <ArrowRight className="size-3 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      disabled={isAck}
                      onClick={() => handleAcknowledge(alert.id)}
                      className={`text-xs ${isAck ? "bg-muted text-muted-foreground" : ""}`}
                    >
                      {isAck ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-green-500 mr-1" />
                          Acknowledged
                        </>
                      ) : (
                        "Acknowledge"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
