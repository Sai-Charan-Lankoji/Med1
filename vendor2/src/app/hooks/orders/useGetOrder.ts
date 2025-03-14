import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order details: ${response.status}`);
  }

  return response.json();
};

export const useGetOrder = (id: string) => {
  const url = `${baseUrl}/api/orders/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 0,
    // To approximate staleTime behavior
    revalidateIfStale: true, // Revalidate only if data is considered stale by your logic
    // Custom stale check can be implemented via a wrapper if needed
    errorRetryCount: 0,
    onError: (error) => {
      console.error('Error fetching order details:', error);
    },
  });

  // Optional: Mimic staleTime by wrapping data with a timestamp check
  const isDataFresh = () => {
    if (!data || !data.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - data.timestamp < fiveMinutes;
  };

  // Wrap data to include timestamp if needed
  const enhancedData = data
    ? { ...data, timestamp: data.timestamp || Date.now() }
    : undefined;

  return {
    data: enhancedData,
    error,
    isLoading,
    isFresh: isDataFresh(), // Custom helper to mimic staleTime
    refetch: mutate, // Manual refetch if needed
  };
};