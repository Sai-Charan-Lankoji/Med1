import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetchCustomer = async (url: string) => {
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
      console.log('No customer found or server error. Returning empty array.');
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return data;
};

export const useGetCustomer = (id: string) => {
  const url = `${baseUrl}/api/customer/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchCustomer, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 0,
    errorRetryCount: 0,
    revalidateIfStale: false, // Control staleness manually
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching customer:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });

  // Enhance data with timestamp for staleness
  const enhancedData = data
    ? { customer: data, timestamp: Date.now() }
    : { customer: [], timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.customer, // Matches original structure
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};