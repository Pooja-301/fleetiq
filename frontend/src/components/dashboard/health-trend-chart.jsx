import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { healthTrend } from "@/lib/fleet-data";
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="bg-popover text-popover-foreground rounded-lg border p-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold">{label} 2026</p>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => <div key={entry.dataKey} className="flex items-center gap-2 text-[11px]">
            <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="tabular ml-auto font-medium">{entry.value}</span>
          </div>)}
      </div>
    </div>;
}
function HealthTrendChart() {
  return <Card className="h-full">
      <CardHeader className="flex-row items-start gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Fleet health &amp; risk trend</CardTitle>
          <CardDescription>Average health score against high-risk vehicle count</CardDescription>
        </div>
        <Badge variant="success" className="ml-auto shrink-0">
          +7.2 over 6 months
        </Badge>
      </CardHeader>

      <CardContent className="pl-1">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthTrend} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
    dataKey="month"
    tickLine={false}
    axisLine={false}
    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
    dy={6}
  />
              <YAxis
    yAxisId="left"
    domain={[60, 90]}
    tickLine={false}
    axisLine={false}
    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
    width={34}
  />
              <YAxis
    yAxisId="right"
    orientation="right"
    domain={[0, 50]}
    tickLine={false}
    axisLine={false}
    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
    width={28}
  />
              <Tooltip content={<ChartTooltip />} />

              <Area
    yAxisId="left"
    type="monotone"
    dataKey="health"
    name="Health score"
    stroke="var(--color-chart-1)"
    strokeWidth={2}
    fill="url(#healthFill)"
    dot={false}
    activeDot={{ r: 4, strokeWidth: 0 }}
    isAnimationActive={false}
  />
              <Line
    yAxisId="right"
    type="monotone"
    dataKey="highRisk"
    name="High risk"
    stroke="var(--color-chart-4)"
    strokeWidth={2}
    strokeDasharray="4 3"
    dot={false}
    activeDot={{ r: 4, strokeWidth: 0 }}
  />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 pl-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="bg-chart-1 h-0.5 w-4 rounded-full" />
            <span className="text-muted-foreground text-[11px]">Average health score</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="bg-chart-4 h-0.5 w-4 rounded-full" />
            <span className="text-muted-foreground text-[11px]">High-risk vehicles</span>
          </div>
        </div>
      </CardContent>
    </Card>;
}
export {
  HealthTrendChart
};
