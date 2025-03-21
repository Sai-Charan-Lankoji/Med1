"use client";

import { Next_server } from "@/constant";
import { useEffect, useState } from "react";

interface StoreRevenue {
  name: string;
  captured_revenue: number;
  pending_revenue: number;
  refunded_revenue: number;
}

export function useRevenueData(vendorId: string) {
  const [data, setData] = useState<StoreRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 

//   useEffect(()=>{
//     sessionStorage.getItem(vendor_id)
//   },[])

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const response = await fetch(`${Next_server}/api/${vendorId}`);
        if (!response.ok) throw new Error("Failed to fetch revenue data");

        const result = await response.json();
        setData(result);
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
