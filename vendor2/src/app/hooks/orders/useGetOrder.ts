import useSWR from "swr";

const baseUrl = "http://localhost:5000";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch order details: ${response.status} - ${errorData.error || "Unknown error"}`);
  }

  const data = await response.json();
  console.log("Order API response:", data); // Debug the raw response

  // Extract the nested order data (assuming { success: true, data: orderObject })
  return data.data || data; // Fallback to data if not nested
};

export const useGetOrder = (id: string) => {
  const url = id ? `${baseUrl}/api/orders/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 5 * 60 * 1000, // 5-minute deduping
    errorRetryCount: 0,
    onError: (error) => {
      console.error("Error fetching order details:", error);
    },
  });

  const orderData = data || undefined; // Ensure data is an object or undefined

  return {
    data: orderData,
    error,
    isLoading,
    refetch: mutate,
  };
};