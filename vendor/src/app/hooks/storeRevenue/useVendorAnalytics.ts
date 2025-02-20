import useSWR from 'swr'

export interface Store {
  store_id: string
  store_name: string
  total_revenue: number
  total_commission: number
  orders_count: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface VendorAnalytics {
  vendor_id: string
  commission_rate: string
  total_orders: number
  commission_total_orders: number
  total_vendor_revenue: string
  total_admin_commission: string
  non_commissionable_revenue: string
  final_vendor_revenue: string
  stores: Store[]
  monthly_revenue: MonthlyRevenue[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useVendorAnalytics(vendorId: string) {
  const { data, error, isLoading } = useSWR<VendorAnalytics>(
    `http://localhost:5000/api/commission/${vendorId}`,
    fetcher,
  )

  return {
    data,
    isError: error,
    isLoading,
  }
}

