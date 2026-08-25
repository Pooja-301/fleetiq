import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import { priorityAlerts, relativeTime } from "@/lib/fleet-data";
function AppHeader({ title, description, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const unread = priorityAlerts.filter((a) => a.severity !== "info").length;
  return <header className="bg-background/85 border-border sticky top-0 z-30 border-b backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
          <Menu />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
          {description ? <p className="text-muted-foreground hidden truncate text-xs sm:block">{description}</p> : null}
        </div>

        <div className="relative hidden w-64 md:block xl:w-72">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
    type="search"
    placeholder="Search vehicles, alerts, VINs"
    aria-label="Search fleet"
    className="pl-9"
  />
        </div>

        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Search">
          <Search />
        </Button>

        <Button
    variant="ghost"
    size="icon-sm"
    onClick={toggleTheme}
    aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
  >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative" aria-label={`Notifications, ${unread} unread`}>
              <Bell />
              {unread > 0 ? <span className="bg-destructive text-destructive-foreground tabular absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold">
                  {unread}
                </span> : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-3 py-2.5">
              <span className="text-sm font-semibold">Notifications</span>
              <Badge variant="danger">{unread} active</Badge>
            </div>
            <div className="max-h-80 overflow-y-auto p-1">
              {priorityAlerts.slice(0, 5).map((alert) => <div key={alert.id} className="hover:bg-accent flex gap-2.5 rounded-md p-2.5 transition-colors">
                  <span
    aria-hidden="true"
    className={alert.severity === "critical" ? "bg-destructive mt-1.5 size-1.5 shrink-0 rounded-full" : alert.severity === "warning" ? "bg-warning mt-1.5 size-1.5 shrink-0 rounded-full" : "bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"}
  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{alert.title}</p>
                    <p className="text-muted-foreground mt-0.5 text-[11px]">
                      {alert.vehicleId} · {relativeTime(alert.raisedAt)}
                    </p>
                  </div>
                </div>)}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:pr-2.5">
              <Avatar>
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-semibold">Priya Menon</span>
                <span className="text-muted-foreground block text-[10px]">Fleet Manager</span>
              </span>
              <ChevronDown className="text-muted-foreground hidden size-3.5 sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-muted-foreground">priya.menon@fleetiq.io</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCog />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notification rules
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}
export {
  AppHeader
};
