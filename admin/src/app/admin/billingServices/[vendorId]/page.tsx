"use client";

import Link from "next/link";
import { useParams } from "next/navigation"; // Use client-side params
import { useEffect, useState } from "react";
import { FaDollarSign, FaStore, FaCalendar } from "react-icons/fa";
import { getAnalyticsByVendor, VendorAnalyticsData } from "@/app/api/billingServices/route";
import { VendorCharts } from "@/app/components/VendorCharts";
import NotifyButton from "@/app/components/NotifyButton";

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); 
};

async function fetchVendorAnalytics(vendorId: string, token: string): Promise<{
  analytics: VendorAnalyticsData;
  error: string | null;
}> {
  try {
    const analytics = await getAnalyticsByVendor(vendorId, token);
    if (!analytics.vendor_name) {
      analytics.vendor_name = `Vendor ${vendorId}`; // Fallback
    }
    return { analytics, error: null };
  } catch (err) {
    console.error(`Error fetching analytics for vendor ${vendorId}:`, err);
    return {
      analytics: {
        vendor_id: vendorId,
        vendor_name: "Vendor",
        commission_rate: "0",
        stores: [],
        monthly_revenue: [],
        next_billing_date: "",
      },
      error: err instanceof Error ? err.message : "Unknown error fetching vendor analytics",
    };
  }
};

export default function VendorBillingDetailsPage() {
  const params = useParams(); // Client-side params
  const vendorId = params?.vendorId as string; // Type assertion for client-side
  const [data, setData] = useState<{
    analytics: VendorAnalyticsData;
    error: string | null;
  }>({
    analytics: {
      vendor_id: vendorId || "",
      vendor_name: "Vendor",
      commission_rate: "0",
      stores: [],
      monthly_revenue: [],
      next_billing_date: "",
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

    if (!vendorId) {
      setData((prev) => ({ ...prev, error: "No vendor ID provided" }));
      setLoading(false);
      return;
    }

    fetchVendorAnalytics(vendorId, token).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const { analytics, error } = data;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="alert alert-error shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
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
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const {  stores, commission_rate, monthly_revenue, next_billing_date } = analytics;

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="mx-auto space-y-8">
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            {/* Header with NotifyButton */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="card-title text-3xl font-bold text-primary">
                  Vendor Billing Details
                </h1>
                <p className="text-base-content/70">Advanced financial overview</p>
              </div>
              <div className="flex gap-4">
                <NotifyButton vendorId={vendorId} />
                <Link href="/admin/billingServices" className="btn btn-outline btn-sm btn-primary">
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className="stat bg-base-200 rounded-box shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="stat-figure text-info">
                  <FaDollarSign className="w-8 h-8" />
                </div>
                <div className="stat-title">Commission Rate</div>
                <div className="stat-value text-info">{commission_rate}</div>
              </div>
              <div className="stat bg-base-200 rounded-box shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="stat-figure text-success">
                  <FaStore className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Stores</div>
                <div className="stat-value text-success">{stores.length}</div>
              </div>
              <div className="stat bg-base-200 rounded-box shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="stat-figure text-warning">
                  <FaCalendar className="w-8 h-8" />
                </div>
                <div className="stat-title">Next Billing Date</div>
                <div className="stat-value text-warning">{formatDate(next_billing_date)}</div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-8">
              <VendorCharts monthlyRevenue={monthly_revenue} stores={stores} />
            </div>

            {/* Store Table */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-base-content mb-4">Store Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra table-lg">
                  <thead>
                    <tr className="bg-base-300 text-base-content">
                      <th className="rounded-tl-lg">Store Name</th>
                      <th>Total Revenue</th>
                      <th>Total Commission</th>
                      <th className="rounded-tr-lg">Order Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((store) => (
                      <tr key={store.store_id} className="hover">
                        <td>{store.store_name}</td>
                        <td>${store.total_revenue.toLocaleString()}</td>
                        <td>${store.total_commission.toLocaleString()}</td>
                        <td>{store.orders_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}