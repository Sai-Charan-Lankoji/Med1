import { NEXT_PUBLIC_API_URL } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';
 
const baseUrl = NEXT_PUBLIC_API_URL;
const fetchProducts = async (store_id: string) => {
  
  if (!store_id) {
    console.log('Store ID and Vendor ID are required');
    return [];
  }

  const url = `${baseUrl}/api/products/store/${store_id}`;

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

export const useGetProducts = (store_id: string) => {
  return useQuery(
    ['products', store_id],
    () => fetchProducts(store_id),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 0,
      staleTime: 1000 * 60 * 5, 
      retry: false,
      enabled: Boolean(store_id),

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