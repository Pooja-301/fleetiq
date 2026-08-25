import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Scale,
  ArrowLeftRight,
  Truck,
  Sparkles,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthScoreRing } from "@/components/dashboard/health-score-ring";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { WhatIfSimulator } from "@/components/vehicle/what-if-simulator";
import { StrategyComparison } from "@/components/vehicle/strategy-comparison";
import { SubstituteAllocation } from "@/components/vehicle/substitute-allocation";
import { fetchVehicles, fetchVehicleRisk } from "@/lib/api";
import { vehicles as mockVehicles } from "@/lib/fleet-data";

export default function SimulationPage() {
  const [allVehicles, setAllVehicles] = useState(mockVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState("FL-1042");
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'whatif' | 'strategy' | 'substitute'
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch fleet list
  useEffect(() => {
    fetchVehicles()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setAllVehicles(res);
          // Default to first high-risk vehicle if available
          const firstHighRisk = res.find((v) => v.riskLevel === "high");
          if (firstHighRisk) setSelectedVehicleId(firstHighRisk.id);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Fetch enriched vehicle risk telemetry whenever selectedVehicleId changes
  useEffect(() => {
    if (!selectedVehicleId) return;
    setLoading(true);

    fetchVehicleRisk(selectedVehicleId)
      .then((riskRes) => {
        const base = allVehicles.find((v) => v.id === selectedVehicleId) || mockVehicles.find((v) => v.id === selectedVehicleId) || mockVehicles[0];
        setCurrentVehicle({
          ...base,
          healthScore: Math.max(1, 100 - (riskRes.riskScore || base.riskProbability * 100)),
          riskScore: riskRes.riskScore,
          riskLevel: riskRes.riskLevel || base.riskLevel,
          riskProbability: riskRes.riskProbability || (riskRes.riskScore ? riskRes.riskScore / 100 : base.riskProbability),
          explanation: riskRes.explanation || base.explanation,
          recommendation: riskRes.recommendation || base.recommendation,
        });
      })
      .catch(() => {
        const base = allVehicles.find((v) => v.id === selectedVehicleId) || mockVehicles[0];
        setCurrentVehicle(base);
      })
      .finally(() => setLoading(false));
  }, [selectedVehicleId, allVehicles]);

  // Filter high-risk vehicles for quick selection chips
  const highRiskUnits = allVehicles.filter((v) => v.riskLevel === "high").slice(0, 5);
  const filteredVehicles = allVehicles.filter(
    (v) =>
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.depot || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Simulation & Decision Hub"
      description={
        <span className="flex items-center gap-2">
          <span>Counterfactual What-If risk modeling, 3-way strategy comparison, and smart replacement allocation</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <Sparkles className="size-2.5" />
            DECISION ENGINE
          </span>
        </span>
      }
    >
      <div className="space-y-6">
        {/* Vehicle Selection & Fleet Filter Bar */}
        <Card className="border-2 border-primary/20 bg-card">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Quick High-Risk Vehicle Chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-destructive" />
                  Quick Select Critical / High-Risk Units:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {highRiskUnits.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 cursor-pointer ${
                        selectedVehicleId === v.id
                          ? "bg-destructive text-destructive-foreground border-destructive ring-2 ring-destructive/30"
                          : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                      }`}
                    >
                      <span>{v.id}</span>
                      <span className="text-[10px] opacity-80">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Search & Dropdown Selector */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="h-9 px-3 pr-8 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    {filteredVehicles.slice(0, 100).map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.id} — {v.name} ({v.depot}) [{v.riskLevel.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Selected Vehicle Snapshot Strip */}
            {currentVehicle && (
              <div className="pt-3 border-t grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Unit</span>
                  <div className="font-bold text-foreground">{currentVehicle.id}</div>
                  <span className="text-[11px] text-muted-foreground truncate block">{currentVehicle.name}</span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Depot Hub</span>
                  <div className="font-semibold text-foreground">{currentVehicle.depot}</div>
                  <span className="text-[10px] text-muted-foreground">{currentVehicle.plate}</span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Duty Driver</span>
                  <div className="font-medium text-foreground">{currentVehicle.driver}</div>
                  <span className="text-[10px] text-muted-foreground">{currentVehicle.type}</span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Health Score</span>
                  <div className="font-bold text-base text-foreground">{currentVehicle.healthScore}/100</div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Risk Posture</span>
                  <div>
                    <Badge
                      variant={currentVehicle.riskLevel === "high" ? "danger" : currentVehicle.riskLevel === "medium" ? "warning" : "success"}
                      className="text-[10px] uppercase"
                    >
                      {currentVehicle.riskLevel} Risk ({Math.round((currentVehicle.riskProbability || 0.4) * 100)}%)
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Next Service</span>
                  <div className="font-semibold text-foreground truncate">{currentVehicle.nextMaintenanceIn || "In 30 days"}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-3">
          {[
            { id: "all", label: "Unified Command Center (All 3 Tools)", icon: Layers },
            { id: "whatif", label: "1. What-If Risk Simulator", icon: SlidersHorizontal },
            { id: "strategy", label: "2. 3-Way Strategy Comparison", icon: Scale },
            { id: "substitute", label: "3. Smart Substitute Allocation", icon: ArrowLeftRight },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Core Decision Modules */}
        {currentVehicle && (
          <div className="space-y-6">
            {/* Component 1: What-If Simulator */}
            {(activeTab === "all" || activeTab === "whatif") && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <SlidersHorizontal className="size-4 text-primary" />
                  Module 1: Counterfactual "What-If" Scenario Simulator
                </div>
                <WhatIfSimulator vehicle={currentVehicle} />
              </section>
            )}

            {/* Component 2: 3-Way Strategy Comparison */}
            {(activeTab === "all" || activeTab === "strategy") && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Scale className="size-4 text-primary" />
                  Module 2: 3-Way Operational Strategy Comparison
                </div>
                <StrategyComparison vehicle={currentVehicle} />
              </section>
            )}

            {/* Component 3: Smart Substitute Vehicle Allocation */}
            {(activeTab === "all" || activeTab === "substitute") && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ArrowLeftRight className="size-4 text-primary" />
                  Module 3: Smart Substitute Vehicle Allocation
                </div>
                <SubstituteAllocation vehicle={currentVehicle} />
              </section>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
