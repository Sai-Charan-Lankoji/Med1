// useGetOrders.ts
import useSWR from "swr";
import { Next_server } from "@/constant";
import { vendor_id } from "@/app/utils/constant";

const baseUrl = Next_server;

const fetchOrders = async (url: string) => {
  if (!vendor_id) {
    console.warn("No vendor ID found in sessionStorage");
    return [];
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Let SWR handle the error
  }
};

export const useGetOrders = () => {
  const url = vendor_id ? `${baseUrl}/api/orders/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    url ? ["orders", vendor_id] : null,
    () => fetchOrders(url!),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      dedupingInterval: 10000, 
      refreshInterval: 0, // Disable auto-refresh
      shouldRetryOnError: true,
      revalidateIfStale: true,
      retryCount: 3,
      retryOnErrorDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      onError: (err) => {
        console.error("Failed to fetch orders:", err.message);
      },
    }
  );

  return {
    data: data || [],
    isLoading,
    error: error ? new Error("Failed to fetch orders") : null,
    refetch: mutate,
  };
};