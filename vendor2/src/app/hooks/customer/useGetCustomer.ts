import useSWR from "swr";

const baseUrl = "http://localhost:5000";

const fetchCustomer = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Customer API response:", data); // Debug the raw response

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log("No customer found or server error. Returning null.");
      return null; // Return null for a single customer instead of an empty array
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  // Extract the nested customer data (assuming { success: true, data: customerObject })
  return data.data || data; // Fallback to data if not nested
};

export const useGetCustomer = (id: string) => {
  const url = id ? `${baseUrl}/api/customer/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchCustomer, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 5 * 60 * 1000, // 5-minute deduping
    errorRetryCount: 0,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching customer:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  // Ensure data is a customer object or null
  const customerData = data || null;

  return {
    data: customerData,
    error,
    isLoading,
    refetch: mutate,
  };
};