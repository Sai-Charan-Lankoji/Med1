
import { NEXT_URL } from "@/app/constants";

// Vendor interface (adjusted from your sample)
export interface Vendor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  plan: string;
  business_type: string;
  registered_number?: string;
  status?: string;
  contact_phone_number?: string;
  tax_number?: string;
  password?: string;
  plan_id?: string;
  user_id?: string | null;
  next_billing_date?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  address?: Array<{
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    country_code: string | null;
    province: string;
    postal_code: string;
    phone: string;
    vendor_address_id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;
}

// Analytics interfaces from your hooks
export interface MonthlyRevenue {
  month: string;
  revenue: string;
}

export interface AnalyticsData {
  total_vendors: number;
  total_orders: number;
  commission_total_orders: number;
  total_vendor_revenue: string;
  total_admin_commission: string;
  non_commissionable_revenue: string;
  final_vendor_revenue: string;
  monthly_revenue: MonthlyRevenue[];
}

export interface StoreData {
  store_id: string;
  store_name: string;
  total_revenue: number;
  total_commission: number;
  orders_count: number;
}

// export interface VendorAnalyticsData {
//   vendor_id: string;
//   commission_rate: string;
//   stores: StoreData[];
//   monthly_revenue: MonthlyRevenue[];
//   next_billing_date: string;
// }

export interface VendorAnalyticsData {
  vendor_id: string;
  vendor_name: string; // Added this
  commission_rate: string;
  stores: StoreData[];
  monthly_revenue: MonthlyRevenue[];
  next_billing_date: string;
}
// Fetch all vendors (SSR)
export async function getAllVendors(cookieHeader?: string): Promise<Vendor[]> {
  const url = `${NEXT_URL}/api/vendors`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader || "",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch vendors: ${response.statusText}`);
  }

  const data: { success: boolean; vendors: Vendor[] } = await response.json();
  if (!data.success || !Array.isArray(data.vendors)) {
    throw new Error("Vendor data is not an array or success is false");
  }

  return data.vendors;
}

// Fetch overall analytics (SSR)
export async function getOverallAnalytics(cookieHeader?: string): Promise<AnalyticsData> {
  const url = `${NEXT_URL}/api/vendors/analytics`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader || "",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch analytics: ${response.statusText}`);
  }

  const data: { status: string; statusCode: number; message: string; data: AnalyticsData } = await response.json();
  if (data.status !== "success" || !data.data) {
    throw new Error("Invalid analytics response format");
  }

  return data.data;
}

// Fetch analytics for a specific vendor (SSR)
export async function getAnalyticsByVendor(vendorId: string, cookieHeader?: string): Promise<VendorAnalyticsData> {
  const url = `${NEXT_URL}/api/vendors/analytics/${vendorId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader || "",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch vendor analytics: ${response.statusText}`);
  }

  const data: { status: string; statusCode: number; message: string; data: VendorAnalyticsData } = await response.json();
  if (data.status !== "success" || !data.data) {
    throw new Error("Invalid vendor analytics response format");
  }

  return data.data;
}

// Notify a specific vendor (client-side)
export async function notifyVendor(vendorId: string): Promise<void> {
  const url = `/api/notifications/${vendorId}`; // Relative path to Next.js API route
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status: "active" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to notify vendor: ${response.status}`);
  }
}

// Notify all vendors (client-side)
export async function notifyAllVendors(): Promise<void> {
  const url = "/api/notifications"; // Relative path to Next.js API route
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ vendorId: "all" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to notify all vendors: ${response.status}`);
  }
}