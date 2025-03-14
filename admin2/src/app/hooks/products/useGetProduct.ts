import { useQuery } from '@tanstack/react-query';
import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;


const fetchProductDetails = async (id: string) => {
  const url = `${baseUrl}/vendor/products/${id}`;
  
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
  return useQuery(['product', id], () => fetchProductDetails(id), {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false, 
    onError: (error) => {
      console.error('Error fetching product details:', error);
    },
  });
};
