import useSWR from 'swr';
import { vendor_id } from '@/app/utils/constant';
import { Next_server } from '@/constant';

const baseUrl = Next_server;

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
  console.log('Products API response:', data); // Debug the raw response

  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
    if (response.status === 404 || response.status === 500) {
      console.log('No products found or server error. Returning empty array.');
      return [];
    }
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  // Handle nested response (e.g., { success: true, data: [...] }) or direct array
  const productsData = data.data || data;
  if (!productsData || productsData.length === 0) {
    console.log('No products found for the given vendor.');
    return [];
  }

  return Array.isArray(productsData) ? productsData : [];
};

export const useGetProducts = () => {
  const url = vendor_id ? `${baseUrl}/api/products/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchProducts, {
    revalidateOnFocus: false,
    revalidateOnMount: true, // Fetch data when the component mounts
    dedupingInterval: 5 * 60 * 1000, // 5-minute deduping (mimics stale time)
    errorRetryCount: 0,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching products:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });

  const productsData = Array.isArray(data) ? data : [];

  return {
    data: productsData,
    error,
    isLoading,
    refetch: mutate, // Manual refetch trigger
  };
};