import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetchPublishableapikeys = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch publishable api keys details: ${response.status}`);
  }

  return response.json();
};

export const useGetPublishableApiKeys = (id: string) => {
  const url = `${baseUrl}/vendor/publishableapikey/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchPublishableapikeys, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 0,
    errorRetryCount: 0,
    revalidateIfStale: false, // Control staleness manually
    onError: (error) => {
      console.error('Error fetching publishable details:', error);
    },
  });

  // Enhance data with timestamp for staleness
  const enhancedData = data ? { apikeys: data, timestamp: Date.now() } : { apikeys: undefined, timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.apikeys, // Matches original structure (no fallback to [])
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};