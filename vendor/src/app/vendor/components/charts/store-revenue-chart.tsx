"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"  
import { useRevenueData } from "@/app/hooks/storeRevenue/useRevenueData" 
import { vendor_id } from "@/app/utils/constant";
import { useEffect } from "react";





const data = [
  { name: "Store A", revenue: 4000 },
  { name: "Store B", revenue: 3000 },
  { name: "Store C", revenue: 2000 },
  { name: "Store D", revenue: 2780 },
  { name: "Store E", revenue: 1890 },
  { name: "Store F", revenue: 2390 },
] 



export function StoreRevenueChart() {  
  useEffect(()=>{
    sessionStorage.getItem(vendor_id)
  }) 

  
  const { data,loading,error } = useRevenueData(vendor_id) 

  if (loading) return <p>Loading store revenue...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (data.length === 0) return <p>No revenue data available.</p>;


  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="captured_revenue" fill="#4CAF50" name="Captured Revenue" />
        <Bar dataKey="pending_revenue" fill="#FFC107" name="Pending Revenue" />
        <Bar dataKey="refunded_revenue" fill="#F44336" name="Refunded Revenue" />
      </BarChart>
    </ResponsiveContainer>
  )
}

