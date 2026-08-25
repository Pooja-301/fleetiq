import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, CalendarClock, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { HealthScoreBar, RiskBadge } from "@/components/dashboard/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatKm, vehicles as mockVehicles } from "@/lib/fleet-data";
import { fetchVehicles } from "@/lib/api";

function VehicleTable({ compact = false }) {
  const [dataVehicles, setDataVehicles] = React.useState(mockVehicles);
  const [isLive, setIsLive] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [risk, setRisk] = React.useState("all");
  const [sortKey, setSortKey] = React.useState("healthScore");

  React.useEffect(() => {
    fetchVehicles()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDataVehicles(data);
          setIsLive(true);
        }
      })
      .catch(() => {});
  }, []);

  const [page, setPage] = React.useState(1);
  const pageSize = compact ? 5 : 10;

  React.useEffect(() => {
    setPage(1);
  }, [query, risk, sortKey]);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataVehicles.filter((v) => {
      const matchesRisk = risk === "all" || v.riskLevel === risk;
      const matchesQuery = !q || v.id.toLowerCase().includes(q) || v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q);
      return matchesRisk && matchesQuery;
    }).sort((a, b) => {
      if (sortKey === "healthScore") return a.healthScore - b.healthScore;
      if (sortKey === "mileage") return b.mileage - a.mileage;
      return a.id.localeCompare(b.id);
    });
  }, [dataVehicles, query, risk, sortKey]);

  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const visible = compact ? rows.slice(0, 5) : rows.slice((page - 1) * pageSize, page * pageSize);
  return <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle>Fleet vehicles</CardTitle>
            <CardDescription>
              {compact ? "Highest-risk vehicles first" : `${rows.length} of ${dataVehicles.length} vehicles shown`}
            </CardDescription>
          </div>

          {!compact ? <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search ID, name, plate"
    aria-label="Search vehicles"
    className="pl-9"
  />
              </div>

              <Select value={risk} onValueChange={(v) => setRisk(v)}>
                <SelectTrigger className="w-[132px]" aria-label="Filter by risk level">
                  <SlidersHorizontal className="text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk</SelectItem>
                  <SelectItem value="high">High risk</SelectItem>
                  <SelectItem value="medium">Medium risk</SelectItem>
                  <SelectItem value="low">Low risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={(v) => setSortKey(v)}>
                <SelectTrigger className="w-[152px]" aria-label="Sort vehicles">
                  <ArrowUpDown className="text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthScore">Lowest health</SelectItem>
                  <SelectItem value="mileage">Highest mileage</SelectItem>
                  <SelectItem value="id">Vehicle ID</SelectItem>
                </SelectContent>
              </Select>
            </div> : <Button variant="outline" size="sm" asChild className="ml-auto shrink-0">
              <Link to="/vehicles">
                View all
                <ChevronRight />
              </Link>
            </Button>}
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Vehicle ID</TableHead>
                <TableHead>Name / Type</TableHead>
                <TableHead>Health score</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Mileage</TableHead>
                <TableHead>Last service</TableHead>
                <TableHead>Next maintenance</TableHead>
                <TableHead className="pr-5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visible.map((vehicle) => {
    const overdue = vehicle.nextMaintenanceIn.toLowerCase().startsWith("overdue");
    return <TableRow key={vehicle.id}>
                    <TableCell className="pl-5">
                      <Link
      to={`/vehicles/${vehicle.id}`}
      className="tabular text-primary text-sm font-semibold hover:underline"
    >
                        {vehicle.id}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{vehicle.name}</span>
                        <span className="text-muted-foreground text-[11px]">
                          {vehicle.type} · {vehicle.depot}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <HealthScoreBar score={vehicle.healthScore} />
                    </TableCell>

                    <TableCell>
                      <RiskBadge level={vehicle.riskLevel} />
                    </TableCell>

                    <TableCell className="tabular text-right text-sm">{formatKm(vehicle.mileage)}</TableCell>

                    <TableCell className="tabular text-muted-foreground text-xs">
                      {formatDate(vehicle.lastService)}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="tabular text-xs font-medium">{formatDate(vehicle.nextMaintenance)}</span>
                        {overdue ? <Badge variant="danger" className="w-fit">
                            <CalendarClock />
                            {vehicle.nextMaintenanceIn}
                          </Badge> : <span className="text-muted-foreground text-[11px]">{vehicle.nextMaintenanceIn}</span>}
                      </div>
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <Button
      variant={vehicle.riskLevel === "high" ? "default" : "outline"}
      size="sm"
      asChild
    >
                        <Link to={`/vehicles/${vehicle.id}`}>
                          {vehicle.riskLevel === "high" ? "Review" : "Details"}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>;
  })}

              {visible.length === 0 ? <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="py-12 text-center">
                    <p className="text-sm font-medium">No vehicles match your filters</p>
                    <p className="text-muted-foreground mt-1 text-xs">Try clearing the search or risk filter.</p>
                  </TableCell>
                </TableRow> : null}
            </TableBody>
          </Table>
        </div>

        {!compact && rows.length > pageSize && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t text-xs text-muted-foreground">
            <span>
              Showing <strong>{(page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, rows.length)}</strong> of <strong>{rows.length.toLocaleString()}</strong> vehicles
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 text-xs"
              >
                Previous
              </Button>
              <span className="px-2 text-foreground font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-3 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>;
}
export {
  VehicleTable
};
