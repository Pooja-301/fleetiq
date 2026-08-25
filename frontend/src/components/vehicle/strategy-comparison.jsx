import React, { useState } from "react";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Clock,
  Banknote,
  ArrowRight,
  Sparkles,
  Zap,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/fleet-data";

export function StrategyComparison({ vehicle }) {
  const [selectedStrategy, setSelectedStrategy] = useState("A"); // A | B | C
  const [executedBanner, setExecutedBanner] = useState(null);

  if (!vehicle) return null;

  const baseCost = vehicle.recommendation?.estimatedCost || 55000;
  const emergencyCost = Math.round(baseCost * 2.8);

  const strategies = [
    {
      id: "A",
      tag: "Recommended",
      title: "Strategy A: Proactive Workshop Bay Intervention",
      subtitle: "Immediate planned inspection & component overhaul",
      color: "border-green-500 bg-green-500/5",
      badgeVariant: "success",
      badgeText: "Optimal ROI",
      cost: formatCurrency(baseCost),
      downtime: "2–3 days (Planned)",
      failureRisk: "5% (Mitigated)",
      riskColor: "text-green-500",
      impactSummary: "Eliminates highway breakdown risk and prevents catastrophic engine/brake damage.",
      tradeoffs: [
        { label: "Cost", value: `${formatCurrency(baseCost)} planned budget`, positive: true },
        { label: "Schedule Impact", value: "2–3 days planned layover", positive: true },
        { label: "Asset Health", value: "Restored to 95% baseline", positive: true },
      ],
    },
    {
      id: "B",
      tag: "Operational Mitigation",
      title: "Strategy B: Route Derating & Payload Restriction",
      subtitle: "Cap assignments to short-haul (<150 km) until weekend service",
      color: "border-warning bg-warning/5",
      badgeVariant: "warning",
      badgeText: "Moderate Risk",
      cost: "₹0 Immediate",
      downtime: "0 Days (Deferred to weekend)",
      failureRisk: "38% (Contained)",
      riskColor: "text-warning",
      impactSummary: "Avoids immediate dispatch disruption by reducing mechanical thermal stress on short trips.",
      tradeoffs: [
        { label: "Cost", value: "₹0 today (Defers planned repair)", positive: true },
        { label: "Schedule Impact", value: "Capped to 150 km/day radius", positive: false },
        { label: "Asset Health", value: "Requires weekly telemetry logging", positive: false },
      ],
    },
    {
      id: "C",
      tag: "High Risk",
      title: "Strategy C: Unmitigated Run-to-Failure",
      subtitle: "Keep vehicle in active long-haul rotation without intervention",
      color: "border-destructive bg-destructive/5",
      badgeVariant: "danger",
      badgeText: "Severe Exposure",
      cost: `~${formatCurrency(emergencyCost)} (Expected)`,
      downtime: "7–10 days (Highway breakdown)",
      failureRisk: `${Math.max(75, Math.round(vehicle.riskProbability * 100))}% (Critical)`,
      riskColor: "text-destructive",
      impactSummary: "High probability of on-road catastrophic breakdown resulting in towing and shipment penalties.",
      tradeoffs: [
        { label: "Cost", value: `3.0x emergency repair penalty`, positive: false },
        { label: "Schedule Impact", value: "Unscheduled multi-day cargo grounding", positive: false },
        { label: "Asset Health", value: "Severe component stress", positive: false },
      ],
    },
  ];

  const handleExecute = (strategyId) => {
    setSelectedStrategy(strategyId);
    const chosen = strategies.find((s) => s.id === strategyId);
    setExecutedBanner(`Operational Strategy Updated: "${chosen.title}" has been assigned to depot dispatch.`);
    setTimeout(() => setExecutedBanner(null), 4500);
  };

  return (
    <Card className="border-2 border-primary/20 bg-card overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scale className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                3-Way Operational Strategy Comparison
                <Badge variant="outline" className="text-[10px] bg-background">
                  Decision Support Engine
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Compare trade-offs between immediate intervention, operational derating, and run-to-failure
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {executedBanner && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <span>{executedBanner}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExecutedBanner(null)} className="h-6 text-xs">
              Dismiss
            </Button>
          </div>
        )}

        {/* 3 Strategy Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {strategies.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <div
                key={strat.id}
                onClick={() => setSelectedStrategy(strat.id)}
                className={`rounded-xl border-2 p-4 flex flex-col justify-between gap-4 transition cursor-pointer relative ${
                  isSelected ? `${strat.color} ring-2 ring-primary/40` : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {/* Card Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={strat.badgeVariant} className="text-[10px] uppercase">
                      {strat.badgeText}
                    </Badge>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        Selected Plan
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground leading-snug">{strat.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{strat.subtitle}</p>
                </div>

                {/* Key Metrics */}
                <div className="bg-background/80 rounded-lg p-3 border space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Banknote className="size-3.5 text-primary" /> Cost Impact:
                    </span>
                    <span className="font-bold text-foreground">{strat.cost}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3.5 text-warning" /> Downtime:
                    </span>
                    <span className="font-semibold text-foreground">{strat.downtime}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-primary" /> Failure Risk:
                    </span>
                    <span className={`font-bold ${strat.riskColor}`}>{strat.failureRisk}</span>
                  </div>
                </div>

                {/* Trade-offs list */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  {strat.tradeoffs.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className={t.positive ? "text-green-500 font-bold" : "text-destructive font-bold"}>
                        {t.positive ? "✓" : "⚠"}
                      </span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{t.label}:</strong> {t.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecute(strat.id);
                  }}
                  className="w-full text-xs mt-2"
                >
                  {isSelected ? "Execute & Assign Plan" : `Select Strategy ${strat.id}`}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
