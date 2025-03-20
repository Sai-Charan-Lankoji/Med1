import useSWR from "swr";
import { vendor_id } from "@/app/utils/constant";

const baseUrl = "http://localhost:5000";

const fetchSalesChannels = async (url: string) => {
  if (!vendor_id) {
    console.log("No vendor ID found in sessionStorage");
    return [];
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Sales Channels API response:", data); // Debug the raw response

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log("No sales channels found or server error. Returning empty array.");
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  // Extract the nested data array (assuming { success: true, data: array })
  const salesChannelsData = data.data || data;
  if (!salesChannelsData || salesChannelsData.length === 0) {
    console.log("No sales channels found for the given vendor.");
    return [];
  }

  return Array.isArray(salesChannelsData) ? salesChannelsData : [];
};

export const useGetSalesChannels = () => {
  const url = vendor_id ? `${baseUrl}/api/saleschannels/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchSalesChannels, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 5 * 60 * 1000, // 5-minute deduping
    errorRetryCount: 0,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching sales channels:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  const salesChannelsData = Array.isArray(data) ? data : [];

  return {
    data: salesChannelsData,
    error,
    isLoading,
    refetch: mutate,
  };
};