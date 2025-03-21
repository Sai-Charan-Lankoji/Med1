import { Next_server } from '@/constant';
import useSWR from 'swr';

const baseUrl = Next_server;

const fetchCustomerByEmail = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer details: ${response.status}`);
  }

  return response.json();
};

export const useGetCustomerByEmail = (email: string) => {
  const url = `${baseUrl}/vendor/customers?email=${email}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetchCustomerByEmail, {
    revalidateOnFocus: false,     // Common in your other hooks
    revalidateOnMount: false,     // Common in your other hooks
    dedupingInterval: 0,          // Common in your other hooks
    errorRetryCount: 0,           // Common in your other hooks
    revalidateIfStale: false,     // Optional: control staleness manually
    onError: (error) => {
      console.error('Error fetching customer details:', error);
    },
  });

  // Optional: Enhance data with timestamp for staleness (mimicking staleTime: 5 minutes)
  const enhancedData = data ? { customer: data, timestamp: Date.now() } : { customer: undefined, timestamp: 0 };

  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.customer, // Matches original structure (no explicit fallback)
    error,
    isLoading,
    timestamp: enhancedData.timestamp, // Optional: expose timestamp
    isFresh: isFresh(),        // Optional: mimic staleTime
    refetch: mutate,          // Optional: manual refetch
  };
};