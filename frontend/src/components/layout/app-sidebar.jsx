import { NavLink } from "react-router-dom";
import {
  BellRing,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  Sparkles,
  Truck,
  Wrench,
  X
} from "lucide-react";
import { FleetLogo } from "@/components/fleet-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fleetSummary, priorityAlerts } from "@/lib/fleet-data";
const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Vehicles", to: "/vehicles", icon: Truck, meta: String(fleetSummary.totalVehicles) },
  { label: "Maintenance", to: "/maintenance", icon: Wrench, meta: "8" },
  {
    label: "Alerts",
    to: "/alerts",
    icon: BellRing,
    meta: String(priorityAlerts.filter((a) => a.severity === "critical").length),
    metaTone: "danger"
  },
  { label: "Analytics", to: "/analytics", icon: ChartNoAxesCombined },
  { label: "AI Copilot", to: "/copilot", icon: Sparkles }
];
function AppSidebar({ open, onClose }) {
  return <>
      {open ? <div
    onClick={onClose}
    className="bg-foreground/40 fixed inset-0 z-40 lg:hidden"
    aria-hidden="true"
  /> : null}

      <aside
    className={cn(
      "bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 lg:static lg:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full"
    )}
  >
        <div className="border-sidebar-border flex h-16 shrink-0 items-center justify-between border-b px-5">
          <FleetLogo />
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main navigation">
          <p className="text-muted-foreground px-2.5 pt-1 pb-2 text-[10px] font-semibold tracking-widest uppercase">
            Operations
          </p>

          {navigation.map((item) => <NavLink
    key={item.to}
    to={item.to}
    end={item.to === "/"}
    onClick={onClose}
    className={({ isActive }) => cn(
      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    )}
  >
              {({ isActive }) => <>
                  <item.icon
    className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/80")}
  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.meta ? <Badge
    variant={item.metaTone === "danger" ? "danger" : "muted"}
    className="tabular h-5 min-w-5 px-1.5"
  >
                      {item.meta}
                    </Badge> : null}
                </>}
            </NavLink>)}

          <div className="mt-auto flex flex-col gap-1 pt-4">
            <NavLink
    to="/settings"
    onClick={onClose}
    className={({ isActive }) => cn(
      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    )}
  >
              {({ isActive }) => <>
                  <Settings className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/80")} />
                  <span>Settings</span>
                </>}
            </NavLink>
          </div>
        </nav>

        <div className="border-sidebar-border border-t p-3">
          <div className="bg-sidebar-accent/60 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Fleet health
              </span>
              <span className="tabular text-sm font-semibold">{fleetSummary.fleetHealthScore}</span>
            </div>
            <div className="bg-secondary mt-2 h-1.5 overflow-hidden rounded-full">
              <div
    className="bg-primary h-full rounded-full"
    style={{ width: `${fleetSummary.fleetHealthScore}%` }}
  />
            </div>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
              {fleetSummary.activeToday} active · {fleetSummary.inWorkshop} in workshop
            </p>
          </div>
        </div>
      </aside>
    </>;
}
export {
  AppSidebar
};
