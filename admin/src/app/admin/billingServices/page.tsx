"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUsers, FaShoppingCart, FaDollarSign, FaPercent } from "react-icons/fa";
import { getAllVendors, getOverallAnalytics, AnalyticsData, Vendor } from "@/app/api/billingServices/route";
import { AnimatedNumber } from "@/app/components/AnimatedNumber";

async function fetchBillingData(token: string): Promise<{
  vendors: Vendor[];
  analytics: AnalyticsData;
  error: string | null;
}> {
  try {
    const [vendorsResponse, analyticsResponse] = await Promise.all([
      getAllVendors(token),
      getOverallAnalytics(token),
    ]);

    const analyticsData = analyticsResponse;

    return { vendors: vendorsResponse, analytics: analyticsData, error: null };
  } catch (err) {
    console.error("Error fetching billing data:", err);
    return {
      vendors: [],
      analytics: {
        total_vendors: 0,
        total_orders: 0,
        commission_total_orders: 0,
        total_vendor_revenue: "0",
        total_admin_commission: "0",
        non_commissionable_revenue: "0",
        final_vendor_revenue: "0",
        monthly_revenue: [],
      },
      error: err instanceof Error ? err.message : "Unknown error fetching billing data",
    };
  }
}

export default function BillingServicesPage() {
  const [data, setData] = useState<{
    vendors: Vendor[];
    analytics: AnalyticsData;
    error: string | null;
  }>({
    vendors: [],
    analytics: {
      total_vendors: 0,
      total_orders: 0,
      commission_total_orders: 0,
      total_vendor_revenue: "0",
      total_admin_commission: "0",
      non_commissionable_revenue: "0",
      final_vendor_revenue: "0",
      monthly_revenue: [],
    },
    error: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setData((prev) => ({ ...prev, error: "No authentication token found" }));
      setLoading(false);
      return;
    }

    fetchBillingData(token).then((result) => {
      console.log("Fetched billing data:", result);
      setData({ ...result });
      console.log("State updated with:", result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const { vendors, analytics, error } = data;
  console.log("Rendering with analytics:", analytics);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6 text-error-content"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-error-content">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center text-base-content/60">
          <p>No vendors available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Vendors",
      value: analytics.total_vendors || 0,
      icon: <FaUsers className="w-8 h-8 text-primary" />,
    },
    {
      title: "Total Orders",
      value: analytics.total_orders || 0,
      icon: <FaShoppingCart className="w-8 h-8 text-success" />,
    },
    {
      title: "Total Vendor Revenue",
      value: parseFloat(analytics.total_vendor_revenue || "0"),
      icon: <FaDollarSign className="w-8 h-8 text-info" />,
      decimals: 2,
      prefix: "$",
    },
    {
      title: "Total Admin Commission",
      value: parseFloat(analytics.total_admin_commission || "0"),
      icon: <FaPercent className="w-8 h-8 text-warning" />,
      decimals: 2,
      prefix: "$",
    },
    {
      title: "Commissionable Orders",
      value: analytics.commission_total_orders || 0,
      icon: <FaShoppingCart className="w-8 h-8 text-accent" />,
    },
    {
      title: "Non-Commissionable Revenue",
      value: parseFloat(analytics.non_commissionable_revenue || "0"),
      icon: <FaDollarSign className="w-8 h-8 text-error" />,
      decimals: 2,
      prefix: "$",
    },
    {
      title: "Final Vendor Revenue",
      value: parseFloat(analytics.final_vendor_revenue || "0"),
      icon: <FaDollarSign className="w-8 h-8 text-secondary" />,
      decimals: 2,
      prefix: "$",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="mx-auto space-y-8">
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="card-title text-3xl font-bold text-primary">Billing Services</h1>
                <p className="text-base-content/70">Overall financial summary and vendor details</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="stat bg-base-200 rounded-box shadow-md p-4 transform transition-all hover:scale-105"
                >
                  <div className="stat-figure">{stat.icon}</div>
                  <div className="stat-title text-base-content/80">{stat.title}</div>
                  <div className="stat-value text-base-content">
                    {/* Fallback to raw value if animation fails */}
                    <AnimatedNumber
                      value={stat.value}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      duration={0.8}
                    />
                    {/* Uncomment to test raw value */}
                    {/* <span>{stat.prefix || ""}{stat.value.toFixed(stat.decimals || 0)}</span> */}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto mt-8">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-300 text-base-content/80">
                    <th>Company Name</th>
                    <th>Contact Name</th>
                    <th>Contact Email</th>
                    <th>Plan</th>
                    <th>Business Type</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-base-300 cursor-pointer transition-colors"
                    >
                      <td className="font-medium text-base-content">
                        <Link href={`/admin/billingServices/${vendor.id}`}>
                          {vendor.company_name || "N/A"}
                        </Link>
                      </td>
                      <td className="text-base-content">{vendor.contact_name || "N/A"}</td>
                      <td className="text-base-content/70 font-mono text-sm">{vendor.contact_email || "N/A"}</td>
                      <td className="text-base-content">{vendor.plan || "N/A"}</td>
                      <td className="text-base-content">{vendor.business_type || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}