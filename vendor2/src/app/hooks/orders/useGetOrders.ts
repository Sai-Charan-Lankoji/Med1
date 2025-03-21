import useSWR from "swr";

const baseUrl = Next_server;
import { vendor_id } from "@/app/utils/constant";
import { Next_server } from "@/constant";

const fetchOrders = async (url: string) => {
  if (!vendor_id) {
    console.log("No vendor ID found in sessionStorage");
    return [];
  }
  console.log("Praveen vendor_id", vendor_id);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log("Praveen data", data);

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
      if (response.status === 404 || response.status === 500) {
        console.log("No orders found or server error. Returning empty array.");
        return [];
      }
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    // Return the nested data array instead of the raw response
    return Array.isArray(data.data) ? data.data : [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching data:", error.message);
      return [];
    } else {
      console.error("An unknown error occurred:", error);
      return [];
    }
  }
};

export const useGetOrders = () => {
  const url = vendor_id ? `${baseUrl}/api/orders/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    vendor_id ? ["orders", vendor_id] : null,
    () => fetchOrders(url!),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 5 * 60 * 1000, // 5-minute stale time
      refreshInterval: 0,
      shouldRetryOnError: false,
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error("Error occurred while fetching orders:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      },
    }
  );

  // No need to normalize here since fetchOrders already returns an array
  const ordersData = data || [];

  return {
    data: ordersData,
    isLoading,
    error,
    refetch: mutate,
  };
};