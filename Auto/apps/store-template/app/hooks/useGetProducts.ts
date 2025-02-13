import { NEXT_PUBLIC_STORE_ID } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';

const baseUrl = "https://med1-wyou.onrender.com";
const storeId = NEXT_PUBLIC_STORE_ID
const fetchProducts = async () => {
  if (!storeId) {
    console.log('Store ID and Vendor ID are required');
    return [];
  }

  const url = `${baseUrl}/store/products?storeId=${storeId}`;

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
      console.log(`HTTP error! Status: ${response.status}`);

      if (response.status === 404 || response.status === 500) {
        console.log('No products found or server error. Returning empty array.');
        return [];
      }

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return data.products;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching products:', error.message);
      return [];
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};

export const useGetProducts = () => {
  return useQuery(
    ['products'],
    () => fetchProducts(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
      enabled: Boolean(storeId),

      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error('Error occurred while fetching products:', error.message);
        } else {
          console.error('An unknown error occurred:', error);
        }
      },
    }
  );
};