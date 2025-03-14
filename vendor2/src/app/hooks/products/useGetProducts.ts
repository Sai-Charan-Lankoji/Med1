import useSWR from 'swr';
import { vendor_id } from '@/app/utils/constant';

const baseUrl = "http://localhost:5000";

const fetchProducts = async (url: string) => {
  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return [];
  }

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
      console.log('No products found or server error. Returning empty array.');
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  if (!data || data.length === 0) {
    console.log('No products found for the given vendor.');
    return [];
  }

  return data;
};

export const useGetProducts = () => {
  const url = vendor_id ? `${baseUrl}/api/products/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchProducts, {
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
    ? { products: data, timestamp: Date.now() }
    : { products: [], timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.products, // Matches original structure
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};