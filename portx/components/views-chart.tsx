"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface ViewsChartProps {
  data: { date: string; views: number }[];
}

export function ViewsChart({ data }: ViewsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke="currentColor" 
          className="text-muted-foreground/60 text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="currentColor" 
          className="text-muted-foreground/60 text-xs" 
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--foreground)"
          }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="rgb(59, 130, 246)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#viewsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}