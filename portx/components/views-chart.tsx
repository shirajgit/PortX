"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface ViewsChartProps {
  data: { date: string; views: number }[];
}

/* Single series — brand accent, 2px line, recessive axes/grid, crosshair tooltip.
   Colors are the lp-* theme tokens so light/dark follow the toggle. */
export function ViewsChart({ data }: ViewsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--lp-border)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--lp-subtle)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tick={{ fill: "var(--lp-subtle)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "var(--lp-border-strong)", strokeWidth: 1 }}
          contentStyle={{
            background: "var(--lp-surface)",
            border: "1px solid var(--lp-border-strong)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--lp-text)",
            boxShadow: "0 12px 32px -12px rgba(0,0,0,0.35)",
          }}
          labelStyle={{ color: "var(--lp-muted)", marginBottom: 2 }}
          itemStyle={{ color: "var(--lp-text)", padding: 0 }}
          formatter={(v) => [v, "Views"]}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="var(--lp-accent)"
          strokeWidth={2}
          fill="url(#viewsGradient)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--lp-surface)", fill: "var(--lp-accent)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
