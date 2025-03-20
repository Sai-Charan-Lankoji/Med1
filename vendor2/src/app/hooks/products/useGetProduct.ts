import useSWR from 'swr';

const baseUrl = "http://localhost:5000";

const fetchProductDetails = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status}`);
  }

  const data = await response.json();
  return data.products;
};

export const useGetProduct = (id: string) => {
  const url = `${baseUrl}/vendor/products/${id}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchProductDetails, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    dedupingInterval: 0,
    errorRetryCount: 0,
    revalidateIfStale: false, // Control staleness manually
    onError: (error) => {
      console.error('Error fetching product details:', error);
    },
  });

  // Enhance data with timestamp for staleness
  const enhancedData = data ? { product: data, timestamp: Date.now() } : { product: undefined, timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.product, // Matches original structure (no fallback to [])
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};