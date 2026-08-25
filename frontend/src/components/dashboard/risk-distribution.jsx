import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fleetSummary, riskDistribution } from "@/lib/fleet-data";
const sliceColor = {
  low: "var(--color-chart-2)",
  medium: "var(--color-chart-3)",
  high: "var(--color-chart-4)"
};
const dotClass = {
  low: "bg-chart-2",
  medium: "bg-chart-3",
  high: "bg-chart-4"
};
function RiskDistribution() {
  const total = riskDistribution.reduce((sum, item) => sum + item.value, 0);
  return <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk distribution</CardTitle>
        <CardDescription>Across {fleetSummary.totalVehicles} monitored vehicles</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative mx-auto h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
    data={riskDistribution}
    dataKey="value"
    nameKey="name"
    innerRadius={54}
    outerRadius={78}
    paddingAngle={2}
    strokeWidth={0}
  >
                {riskDistribution.map((entry) => <Cell key={entry.key} fill={sliceColor[entry.key]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular text-xl font-semibold tracking-tight">{total}</span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">Vehicles</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {riskDistribution.map((item) => {
    const pct = Math.round(item.value / total * 100);
    return <div key={item.key} className="flex items-center gap-2.5">
                <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotClass[item.key]}`} />
                <span className="flex-1 text-xs font-medium">{item.name}</span>
                <span className="tabular text-muted-foreground text-xs">{item.value}</span>
                <span className="tabular w-9 text-right text-xs font-semibold">{pct}%</span>
              </div>;
  })}
        </div>
      </CardContent>
    </Card>;
}
export {
  RiskDistribution
};
