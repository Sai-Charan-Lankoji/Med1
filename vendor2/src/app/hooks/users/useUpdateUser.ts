import useSWR from 'swr';
import { vendor_id } from '@/app/utils/constant';

const baseUrl = "http://localhost:5000";
const id = vendor_id;

const fetchVendor = async (url: string) => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching data:', error.message);
      return []; 
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};

// Custom Hook using SWR
export const useGetVendor = () => {
  return useSWR(`${baseUrl}/api/vendors/${id}`, fetchVendor, {
    revalidateOnFocus: false, // Prevents auto-refetch on window focus
    revalidateOnMount: false, // Prevents auto-refetch on mount
    revalidateIfStale: true,  // Fetches data if stale
    dedupingInterval: 1000 * 60 * 5, // Cache data for 5 minutes
    shouldRetryOnError: false, // Disables retry on error
  });
};
