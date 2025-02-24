// hooks/useVendorAnalytics.ts
import useSWR from "swr";

// Overall analytics response
interface MonthlyRevenue {
  month: string;
  revenue: string;
}

interface AnalyticsData {
  total_vendors: number;
  total_orders: number;
  commission_total_orders: number;
  total_vendor_revenue: string;
  total_admin_commission: string;
  non_commissionable_revenue: string;
  final_vendor_revenue: string;
  monthly_revenue: MonthlyRevenue[];
}

interface ApiResponse {
  success: boolean;
  analytics: {
    status: "success" | "error";
    statusCode: number;
    message: string;
    data: AnalyticsData;
  };
}

// Vendor-specific analytics response
interface StoreData {
  store_id: string;
  store_name: string;
  total_revenue: number;
  total_commission: number;
  orders_count: number;
}

interface VendorAnalyticsData {
  vendor_id: string;
  commission_rate: string;
  stores: StoreData[];
  monthly_revenue: MonthlyRevenue[];
  next_billing_date: string;
}

interface VendorApiResponse {
  success: boolean;
  breakdown: {
    status: "success" | "error";
    statusCode: number;
    message: string;
    data: VendorAnalyticsData;
  };
}

interface ApiError {
  message: string;
  statusCode?: number;
}

// Fetcher for both APIs
const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || `Failed to fetch data: ${response.statusText}`,
      statusCode: response.status,
    };
    throw error;
  }
  return response.json();
};

// Hook for overall analytics
export const useOverallVendorAnalytics = () => {
  const url = "http://localhost:5000/api/vendors/analytics";
  const { data, error, isValidating, mutate } = useSWR<ApiResponse, ApiError>(
    url,
    fetcher
  );

  const analyticsData: AnalyticsData | undefined = data?.success
    ? data.analytics.data
    : undefined;

  return {
    data: analyticsData,
    isLoading: !error && !data,
    isError: !!error,
    error,
    isValidating,
    mutate,
  };
};

// Hook for vendor-specific analytics
export const useVendorSpecificAnalytics = (vendorId: string | null) => {
  const url = vendorId
    ? `http://localhost:5000/api/vendors/analytics/${vendorId}`
    : null;
  const { data, error, isValidating, mutate } = useSWR<VendorApiResponse, ApiError>(
    url,
    fetcher
  );

  const vendorData: VendorAnalyticsData | undefined = data?.success
    ? data.breakdown.data
    : undefined;

  return {
    data: vendorData,
    isLoading: !error && !data && !!vendorId, // Only loading if vendorId is provided
    isError: !!error,
    error,
    isValidating,
    mutate,
  };
};