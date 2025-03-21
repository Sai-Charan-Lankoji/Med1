import useSWR from "swr";
import { vendor_id } from "@/app/utils/constant";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

const fetchVendor = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log("Vendor API response:", data); // Debug the raw response

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    // Extract the nested vendor data (assuming { success: true, data: vendorObject })
    return data.data || data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching vendor:", error.message);
      return null; // Single vendor, not an array
    } else {
      console.error("An unknown error occurred:", error);
      return null;
    }
  }
};

export const useGetVendor = () => {
  const url = vendor_id ? `${baseUrl}/api/vendors/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchVendor, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
    shouldRetryOnError: false,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching vendor:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  return {
    data: data || null, // Return null if no vendor is found
    error,
    isLoading,
    refetch: mutate,
  };
};