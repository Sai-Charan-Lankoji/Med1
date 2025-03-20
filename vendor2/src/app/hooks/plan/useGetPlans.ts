import useSWR from "swr";

const baseUrl = "http://localhost:5000";

const fetchPlans = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Plans API response:", data); // Debug the raw response

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log("No plans found or server error. Returning empty array.");
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  // Extract the nested data array (assuming { success: true, data: array })
  const plansData = data.data || data;
  if (!plansData || plansData.length === 0) {
    console.log("No plans found.");
    return [];
  }

  return Array.isArray(plansData) ? plansData : [];
};

export const useGetPlans = () => {
  const url = `${baseUrl}/api/plan`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchPlans, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    errorRetryCount: 0,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching plans:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  const plansData = Array.isArray(data) ? data : [];

  return {
    data: plansData,
    error,
    isLoading,
    refetch: mutate,
  };
};