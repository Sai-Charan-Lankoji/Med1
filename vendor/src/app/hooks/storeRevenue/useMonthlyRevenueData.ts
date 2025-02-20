"use client";

import { useEffect, useState } from "react";

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export function useMonthlyRevenueData(vendorId: string) {
  const [data, setData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const response = await fetch(`http://localhost:5000/api/monthly/${vendorId}`);
        if (!response.ok) throw new Error("Failed to fetch revenue data");

        const result = await response.json();

        
        // Format months to display correctly in the chart
        const formattedData = result?.revenue?.map((entry: MonthlyRevenue) => ({
            name: entry.month, // No need to convert again, it's already in "Nov", "Dec" format
            revenue: entry.revenue,
          }));
          

        setData(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      fetchRevenue();
    }
  }, [vendorId]);

  return { data, loading, error };
}
