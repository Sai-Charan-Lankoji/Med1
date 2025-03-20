import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetchStore = async (url: string) => {
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
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return data;
};

export const useGetStore = (id: string) => {
  const url = `${baseUrl}/api/stores/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchStore, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 0,
    errorRetryCount: 0,
    revalidateIfStale: false, // Control staleness manually
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching products:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });

  // Enhance data with timestamp for staleness
  const enhancedData = data
    ? { store: data, timestamp: Date.now() }
    : { store: [], timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.store, // Matches original structure
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};