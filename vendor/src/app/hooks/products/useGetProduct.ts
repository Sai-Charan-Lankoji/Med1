import { useQuery } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


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
    onError: (error) => {
      console.error('Error fetching product details:', error);
    },
  });
};
