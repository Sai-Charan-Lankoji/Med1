import useSWR from "swr";
import { vendor_id } from "@/app/utils/constant";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

const fetchStores = async (url: string) => {
  if (!vendor_id) {
    console.log("No vendor ID found in sessionStorage");
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
    console.log("Stores API response:", data);

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
      if (response.status === 404 || response.status === 500) {
        console.log("No stores found or server error. Returning empty array.");
        return [];
      }
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    const storesData = data.data || data;
    if (!storesData || storesData.length === 0) {
      console.log("No stores found for the given vendor.");
      return [];
    }

    return Array.isArray(storesData) ? storesData : [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching stores:", error.message);
      return [];
    } else {
      console.error("An unknown error occurred:", error);
      return [];
    }
  }
};

export const useGetStores = () => {
  const url = vendor_id ? `${baseUrl}/api/stores/vendor?vendor_id=${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchStores, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 5 * 60 * 1000,
    errorRetryCount: 0,
    revalidateIfStale: false,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching stores:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  const storesData = Array.isArray(data) ? data : [];

  return {
    data: storesData,
    error,
    isLoading,
    refetch: mutate,
  };
};