import useSWR from "swr";

const baseUrl = Next_server;
import { vendor_id } from '@/app/utils/constant';
import { Next_server } from "@/constant";

const fetchCustomers = async (url: string) => {
  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return [];
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data.data; // Array of customers
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

export const useGetCustomers = () => {
  const url = vendor_id ? `${baseUrl}/api/customer/vendor/${vendor_id}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    vendor_id ? ['customers', vendor_id] : null,
    () => fetchCustomers(url!),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 5 * 60 * 1000, // 5-minute stale time
      refreshInterval: 0,
      shouldRetryOnError: false,
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error('Error occurred while fetching customers:', error.message);
        } else {
          console.error('An unknown error occurred:', error);
        }
      },
    }
  );

  const customersData = Array.isArray(data) ? data : [];

  return {
    data: customersData,
    isLoading,
    error,
    refetch: mutate,
  };
};