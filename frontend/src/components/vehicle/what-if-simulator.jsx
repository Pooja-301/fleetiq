import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  Clock,
  Wrench,
  Gauge,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { simulateVehicleRisk } from "@/lib/api";
import { formatCurrency } from "@/lib/fleet-data";

export function WhatIfSimulator({ vehicle }) {
  const [repairedComponents, setRepairedComponents] = useState([]);
  const [deferDays, setDeferDays] = useState(0);
  const [dailyKmAdj, setDailyKmAdj] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Run simulation whenever params change
  useEffect(() => {
    if (!vehicle || !vehicle.id) return;
    setLoading(true);

    const params = {
      repairedComponents,
      deferDays,
      dailyKmAdjustment: dailyKmAdj,
    };

    simulateVehicleRisk(vehicle.id, params)
      .then(setSimResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [vehicle?.id, repairedComponents, deferDays, dailyKmAdj]);

  const toggleComponent = (compKey) => {
    setRepairedComponents((prev) =>
      prev.includes(compKey) ? prev.filter((k) => k !== compKey) : [...prev, compKey]
    );
  };

  const handleReset = () => {
    setRepairedComponents([]);
    setDeferDays(0);
    setDailyKmAdj(0);
  };

  if (!simResult) return null;

  const { baseline, simulated, delta, narrative } = simResult;
  const isImproved = delta.riskDelta < 0;
  const isEscalated = delta.riskDelta > 0;

  return (
    <Card className="border-2 border-primary/20 bg-card overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                "What-If" Maintenance & Scenario Simulator
                <Badge variant="outline" className="text-[10px] bg-background">
                  Interactive Sandbox
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Simulate component replacements and schedule deferrals to predict risk & cost impact
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={repairedComponents.length === 0 && deferDays === 0 && dailyKmAdj === 0}
            className="text-xs h-8 gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Reset Parameters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Component Repairs */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wrench className="size-3.5 text-primary" />
              Simulate Subsystem Overhauls (Boost to 95%)
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "brakes", label: "Replace Brake Pads", cost: "₹18k" },
                { key: "engine", label: "Coolant & Thermostat", cost: "₹42k" },
                { key: "tyres", label: "Rotate & Align Tyres", cost: "₹22k" },
                { key: "battery", label: "New Heavy Battery", cost: "₹9k" },
              ].map((comp) => {
                const active = repairedComponents.includes(comp.key);
                return (
                  <button
                    key={comp.key}
                    onClick={() => toggleComponent(comp.key)}
                    className={`p-3 rounded-lg border text-left transition flex flex-col justify-between gap-1 cursor-pointer text-xs ${
                      active
                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 font-medium"
                        : "border-border bg-secondary/30 hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{comp.label}</span>
                      {active ? <Check className="size-3.5 text-green-500" /> : <span className="text-[10px] text-muted-foreground">{comp.cost}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Deferral & Route Sliders */}
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Gauge className="size-3.5 text-primary" />
              Operational & Schedule Stress Testing
            </label>

            {/* Slider 1: Defer Days */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Defer Maintenance Window:</span>
                <span className={`font-semibold ${deferDays > 0 ? "text-destructive" : "text-foreground"}`}>
                  +{deferDays} Days Delay
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={deferDays}
                onChange={(e) => setDeferDays(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>On-Time (0d)</span>
                <span>+15d</span>
                <span>+30d (Critical)</span>
              </div>
            </div>

            {/* Slider 2: Daily Load Adjustment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Daily Route Assignment:</span>
                <span className="font-semibold text-foreground">
                  {dailyKmAdj > 0 ? `+${dailyKmAdj} km (Long-Haul)` : dailyKmAdj < 0 ? `${dailyKmAdj} km (Short-Haul)` : "Standard Route"}
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="250"
                step="50"
                value={dailyKmAdj}
                onChange={(e) => setDailyKmAdj(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>-150 km (Capped)</span>
                <span>Baseline</span>
                <span>+250 km (Overworked)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Comparison Output Results */}
        <div className="bg-secondary/40 rounded-xl p-4 border border-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* Baseline Risk */}
            <div className="p-3 bg-background rounded-lg border flex flex-col justify-center gap-1">
              <span className="text-[11px] text-muted-foreground uppercase">Current Baseline Risk</span>
              <div className="text-xl font-bold">{baseline.riskScore}%</div>
              <Badge variant={baseline.riskLevel === "high" ? "danger" : baseline.riskLevel === "medium" ? "warning" : "success"} className="self-center text-[10px]">
                {baseline.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>

            {/* Delta Indicator */}
            <div className="p-3 bg-background rounded-lg border flex flex-col justify-center items-center gap-1">
              <span className="text-[11px] text-muted-foreground uppercase">Simulation Delta</span>
              <div className="flex items-center gap-1 text-lg font-bold">
                {isImproved && <TrendingDown className="size-5 text-green-500" />}
                {isEscalated && <TrendingUp className="size-5 text-destructive" />}
                <span className={isImproved ? "text-green-500" : isEscalated ? "text-destructive" : "text-muted-foreground"}>
                  {delta.riskDelta > 0 ? `+${delta.riskDelta}%` : `${delta.riskDelta}%`}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {isImproved ? "Risk Mitigated" : isEscalated ? "Risk Escalated" : "No Change"}
              </span>
            </div>

            {/* Simulated Result */}
            <div className="p-3 bg-background rounded-lg border flex flex-col justify-center gap-1">
              <span className="text-[11px] text-muted-foreground uppercase">Simulated Risk Score</span>
              <div className={`text-xl font-bold ${simulated.riskScore < 40 ? "text-green-500" : simulated.riskScore > 65 ? "text-destructive" : "text-warning"}`}>
                {simulated.riskScore}%
              </div>
              <Badge variant={simulated.riskLevel === "high" ? "danger" : simulated.riskLevel === "medium" ? "warning" : "success"} className="self-center text-[10px]">
                {simulated.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Financial & Operational Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Banknote className="size-4 text-primary" />
                Expected Breakdown Exposure:
              </span>
              <span className="font-bold">{formatCurrency(simulated.expectedExposure)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-4 text-warning" />
                Projected Downtime:
              </span>
              <span className="font-bold">{simulated.downtime}</span>
            </div>
          </div>

          {/* AI Narrative */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground flex items-start gap-2.5">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">{narrative}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
