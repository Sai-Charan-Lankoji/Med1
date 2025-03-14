import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetchPlan = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log('No plans found or server error. Returning empty array.');
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  if (!data || data.length === 0) {
    console.log('No plans found.');
    return [];
  }

  return data;
};

export const useGetPlan = (id: string) => {
  const url = `${baseUrl}/api/plan/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchPlan, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 1000 * 60 * 10, // Matches cacheTime: 10 minutes
    errorRetryCount: 0,
    revalidateIfStale: false, // Control staleness manually
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching plan:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });

  // Enhance data with timestamp for staleness
  const enhancedData = data
    ? { plan: data, timestamp: Date.now() }
    : { plan: [], timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.plan, // Matches original structure
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};