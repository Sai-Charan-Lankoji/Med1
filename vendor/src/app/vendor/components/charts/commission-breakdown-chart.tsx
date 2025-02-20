"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useCommissionBreakdown } from "@/app/hooks/storeRevenue/useVendorAnalytics";
import { vendor_id } from "@/app/utils/constant";

export function CommissionBreakdownChart() {
  const { commissionData, loading, error } = useCommissionBreakdown(vendor_id);

  if (loading) return <p>Loading commission breakdown...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalRevenueBeforeDeductions = commissionData?.stores.reduce((sum, store) => sum + store.total_revenue, 0) || 0;
  const totalAdminCommission = parseFloat(commissionData?.total_admin_commission || "0");
  const totalVendorEarnings = totalRevenueBeforeDeductions - totalAdminCommission;

  const data = [
    { name: "Vendor Revenue (Before Deductions)", value: totalRevenueBeforeDeductions },
    { name: "Admin Share (Commission)", value: totalAdminCommission },
    { name: "Vendor Earnings (Final Amount)", value: totalVendorEarnings },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className="text-sm font-semibold">💰 Total Revenue: <span className="text-blue-500">${totalRevenueBeforeDeductions.toFixed(2)}</span></p>
        <p className="text-sm font-semibold">🔹 Admin Share: <span className="text-green-500">${totalAdminCommission.toFixed(2)}</span></p>
        <p className="text-sm font-semibold">🏆 Final Vendor Earnings: <span className="text-yellow-500">${totalVendorEarnings.toFixed(2)}</span></p>
      </div>
    </div>
  );
}
