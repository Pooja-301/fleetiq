import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Sparkles,
  Gauge,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchVehicles } from "@/lib/api";

export function SubstituteAllocation({ vehicle }) {
  const [substitutes, setSubstitutes] = useState([]);
  const [dispatchedId, setDispatchedId] = useState(null);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!vehicle || !vehicle.id) return;

    fetchVehicles()
      .then((allVehicles) => {
        if (!Array.isArray(allVehicles)) return;

        const targetDepot = (vehicle.depot || "").toLowerCase();
        const targetType = vehicle.type;

        const candidates = allVehicles
          .filter(
            (cand) =>
              cand.id !== vehicle.id &&
              cand.type === targetType &&
              cand.healthScore >= 70 &&
              (cand.riskLevel === "low" || cand.riskLevel === "medium")
          )
          .map((cand) => {
            const candDepot = (cand.depot || "").toLowerCase();
            const isSameDepot = candDepot.length > 0 && candDepot === targetDepot;
            let matchScore = 78;
            if (isSameDepot) matchScore += 16;
            if (cand.healthScore >= 85) matchScore += 5;

            return {
              id: cand.id,
              name: cand.name || "Commercial Fleet Unit",
              type: cand.type,
              plate: cand.plate,
              depot: cand.depot,
              driver: cand.driver,
              healthScore: cand.healthScore,
              riskLevel: cand.riskLevel,
              isSameDepot,
              matchScore: Math.min(99, matchScore),
            };
          })
          .sort((a, b) => {
            if (a.isSameDepot !== b.isSameDepot) return b.isSameDepot - a.isSameDepot;
            return b.healthScore - a.healthScore;
          })
          .slice(0, 4);

        setSubstitutes(candidates);
      })
      .catch(() => {});
  }, [vehicle?.id, vehicle?.type, vehicle?.depot]);

  const handleDispatch = (sub) => {
    setDispatchedId(sub.id);
    setBanner(
      `Route Reassigned! ${sub.id} (${sub.name}) has been dispatched to take over active route from ${vehicle.id}.`
    );
    setTimeout(() => setBanner(null), 5000);
  };

  if (!vehicle || substitutes.length === 0) return null;

  return (
    <Card className="border-2 border-primary/20 bg-card overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ArrowLeftRight className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Smart Substitute Vehicle Allocation
                <Badge variant="outline" className="text-[10px] bg-background">
                  Auto-Matched
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                AI-matched healthy replacement trucks to prevent delivery delays when {vehicle.id} is serviced
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {banner && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <span>{banner}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setBanner(null)} className="h-6 text-xs">
              Dismiss
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {substitutes.map((sub) => {
            const isDispatched = dispatchedId === sub.id;
            return (
              <div
                key={sub.id}
                className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition ${
                  isDispatched
                    ? "border-green-500 bg-green-500/5 ring-1 ring-green-500"
                    : "border-border bg-secondary/20 hover:border-primary/40"
                }`}
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-foreground">{sub.id}</span>
                    <Badge variant="success" className="text-[10px]">
                      {sub.matchScore}% Match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate">{sub.name}</p>
                  <span className="text-[10px] text-muted-foreground">{sub.plate}</span>
                </div>

                {/* Subsystem Health Badge */}
                <div className="bg-background rounded-lg p-2.5 border flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Health</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {sub.healthScore}/100
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-secondary/50">
                    {sub.isSameDepot ? "Same Depot" : "Nearby Hub"}
                  </Badge>
                </div>

                {/* Depot & Driver */}
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span className="truncate">{sub.depot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{sub.driver}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    disabled={isDispatched}
                    onClick={() => handleDispatch(sub)}
                    className={`w-full text-xs h-8 ${isDispatched ? "bg-muted text-muted-foreground" : ""}`}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-green-500 mr-1" />
                        Dispatched
                      </>
                    ) : (
                      "Dispatch Substitute"
                    )}
                  </Button>

                  <Button variant="ghost" size="sm" asChild className="w-full text-[11px] h-6 text-muted-foreground hover:text-foreground">
                    <Link to={`/vehicles/${sub.id}`}>
                      View Specs <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
