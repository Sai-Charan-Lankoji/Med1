// src/components/VendorCharts.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StoreData, MonthlyRevenue } from "@/app/api/billingServices/route";

interface VendorChartsProps {
  monthlyRevenue: MonthlyRevenue[];
  stores: StoreData[];
}

export function VendorCharts({ monthlyRevenue, stores }: VendorChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="loading loading-spinner loading-lg text-primary"></div>;
  }

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  const monthlyRevenueData = monthlyRevenue.map((rev) => ({
    month: rev.month,
    revenue: parseFloat(rev.revenue),
  }));

  const storeRevenueData = stores.map((store) => ({
    name: store.store_name,
    value: store.total_revenue,
  }));

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="card bg-base-200 shadow-xl p-6 border border-base-300 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-primary mb-4">Monthly Revenue Trend</h2>
        <div className="w-full overflow-x-auto rounded-lg bg-base-100 p-4">
          <LineChart
            width={500}
            height={300}
            data={monthlyRevenueData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis
              label={{ value: "Revenue ($)", angle: -90, position: "insideLeft", fill: "#6b7280" }}
              stroke="#6b7280"
            />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ color: "#6b7280" }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fill="#8884d8"
              activeDot={{ r: 8, fill: "#fff", stroke: "#8884d8" }}
            />
          </LineChart>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl p-6 border border-base-300 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-primary mb-4">Revenue by Store</h2>
        <div className="w-full flex justify-center rounded-lg bg-base-100 p-4">
          <PieChart width={400} height={300}>
            <Pie
              data={storeRevenueData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {storeRevenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ color: "#6b7280" }} />
          </PieChart>
        </div>
      </div>
    </div>
  );
}