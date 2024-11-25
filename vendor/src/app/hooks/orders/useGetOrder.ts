import { useQuery } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const fetchOrderDetails = async (id: string) => {
  const url = `${baseUrl}/vendor/orders/${id}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order details: ${response.status}`);
  }

  const data = await response.json();
  console.log("UseGetOrder Details Hook: ", data)
  return data;
};

export const useGetOrder = (id: string) => {
  return useQuery(['order', id], () => fetchOrderDetails(id), {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false,
    onError: (error) => {
      console.error('Error fetching order details:', error);
    },
  });
};
