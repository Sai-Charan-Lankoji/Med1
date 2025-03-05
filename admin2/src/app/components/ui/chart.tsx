// components/ui/chart.tsx
import type React from "react";
import { BarChart, Bar, AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
  children: React.ReactElement;
  config?: Record<string, { label: string; color: string }>;
  className?: string;
}

export function ChartContainer({ children, config, className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ content }: { content: React.ComponentType<ChartTooltipProps> }) {
  return <Tooltip content={content as any} />;
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <div className="font-semibold text-gray-800 mb-2">{label}</div>
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700">
              {item.name}: <span className="font-medium">${Number(item.value).toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { BarChart as Bar, AreaChart as Area };