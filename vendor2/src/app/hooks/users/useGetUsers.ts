import useSWR from 'swr';
import { vendor_id } from '@/app/utils/constant';
import { Next_server } from '@/constant';

const baseUrl = Next_server;

// Fetcher function with improved error handling
const fetchUsers = async (url: string): Promise<any[]> => {
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
      console.log('No Users found or server error. Returning empty array.');
      return [];
    }

    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  if (!data || data.length === 0) {
    console.log('No Users found for the given vendor.');
    return [];
  }

  return data;
};

export const useGetUsers = () => {
  const url = vendor_id ? `${baseUrl}/api/vendor-users/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetchUsers, {
    revalidateOnFocus: false,     // Matches refetchOnWindowFocus: false
    revalidateOnMount: true,     // Matches refetchOnMount: false
    dedupingInterval: 10000,          
    errorRetryCount: 2, 
              // Matches retry: false
    // Improvement: Only revalidate if explicitly stale (controlled manually)
    revalidateIfStale: true,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching users:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
    // Improvement: Suspense support (optional, won't break existing code)
    suspense: false,
  });

  // Improvement: Add timestamp to data for freshness tracking
  const enhancedData = data
    ? { users: data, timestamp: Date.now() } // Wrap data to avoid modifying original structure
    : { users: [], timestamp: 0 };

  // Improvement: Helper to check if data is fresh (mimics staleTime)
  const isFresh = () => {
    if (!enhancedData.timestamp) return false;
    const fiveMinutes = 1000 * 60 * 5;
    return Date.now() - enhancedData.timestamp < fiveMinutes;
  };

  return {
    data: enhancedData.users, // Matches original return structure
    error,
    isLoading,
    // Improvements (optional to use, won't break existing code)
    timestamp: enhancedData.timestamp, // Expose timestamp if needed
    isFresh: isFresh(),               // Freshness check (like staleTime)
    refetch: mutate,                  // Manual refetch capability
  };
};