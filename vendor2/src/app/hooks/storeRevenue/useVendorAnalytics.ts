import useSWR from "swr";
import axios from "axios";
import { Next_server } from "@/constant";

// Define types for API responses
interface Store {
  store_id: string;
  store_name: string;
  total_revenue: number;
  total_commission: number;
  orders_count: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface CommissionData {
  vendor_id: string;
  commission_rate: string;
  total_orders: number;
  commission_total_orders: number;
  total_vendor_revenue: string;
  total_admin_commission: string;
  non_commissionable_revenue: string;
  final_vendor_revenue: string;
  stores: Store[];
  monthly_revenue: MonthlyRevenue[];
}

interface TopProduct {
  product_id: string;
  product_name: string;
  order_count?: number;
  total_revenue?: string;
  view_count?: number;
}

interface EngagementData {
  product_views: number;
  most_viewed_products: TopProduct[];
  cart_abandonment: {
    total_carts: number;
    abandoned_carts: number;
    abandonment_rate: string;
  };
  repeat_purchases: {
    repeat_customer_count: number;
    total_orders_by_repeat_customers: number;
  };
}

interface ProductStats {
  top_selling_products: TopProduct[];
  most_viewed_products: TopProduct[];
}

interface VendorAnalyticsData {
  commission: CommissionData;
  engagement: EngagementData;
  products: ProductStats;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const useVendorAnalytics = (vendorId: string, selectedMonth: string = "All") => {
  // Build URL with filters
  const baseUrl = `${Next_server}/api`;

  // Filters are only applied when a specific month is selected
  const filters = selectedMonth === "All"
    ? {} // No filters for full data
    : {
        startDate: `2025-${(new Date(`${selectedMonth} 1, 2025`).getMonth() + 1).toString().padStart(2, "0")}-01`,
        endDate: `2025-${(new Date(`${selectedMonth} 1, 2025`).getMonth() + 1).toString().padStart(2, "0")}-${new Date(
          2025,
          new Date(`${selectedMonth} 1, 2025`).getMonth() + 1,
          0
        ).getDate()}`,
      };

  // Construct query string dynamically
  const queryString = Object.keys(filters).length > 0
    ? `?${new URLSearchParams(filters).toString()}`
    : "";

  const commissionKey = `${baseUrl}/commission/${vendorId}${queryString}`;
  const engagementKey = `${baseUrl}/engagement/${vendorId}${queryString}`;
  const productsKey = `${baseUrl}/topSelling-products/${vendorId}${queryString}`;

  const { data: commissionData, error: commissionError } = useSWR<CommissionData>(commissionKey, fetcher);
  const { data: engagementData, error: engagementError } = useSWR<EngagementData>(engagementKey, fetcher);
  const { data: productsData, error: productsError } = useSWR<ProductStats>(productsKey, fetcher);

  const isLoading = !commissionData || !engagementData || !productsData;
  const isError = commissionError || engagementError || productsError;

  const data: VendorAnalyticsData | null = isLoading || isError ? null : {
    commission: commissionData!,
    engagement: engagementData!,
    products: productsData!,
  };

  return { data, isLoading, isError };
};