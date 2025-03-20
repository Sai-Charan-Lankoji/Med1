import useSWR from "swr";

const baseUrl = "http://localhost:5000";

const fetchPlan = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Plan API response:", data); // Debug the raw response

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log("No plan found or server error. Returning null.");
      return null;
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  // Extract the nested plan data (assuming { success: true, data: planObject })
  const planData = data.data || data;
  if (!planData) {
    console.log("No plan found.");
    return null;
  }

  return planData;
};

export const useGetPlan = (id: string) => {
  const url = id ? `${baseUrl}/api/plan/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchPlan, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch on mount
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
    errorRetryCount: 0,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Error occurred while fetching plan:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    },
  });

  return {
    data: data || null, // Return null if no plan is found
    error,
    isLoading,
    refetch: mutate,
  };
};