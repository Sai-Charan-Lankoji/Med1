const baseUrl = "http://localhost:5000";
import { vendor_id } from '@/app/utils/constant';
import { useQuery } from '@tanstack/react-query';

const fetchOrders = async () => {
  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return []; 
  }
console.log('Praveen vendor_id', vendor_id);
  const url = `${baseUrl}/api/orders/vendor/${vendor_id}`;

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

      if (response.status === 404 || response.status === 500) {
        console.log('No orders found or server error. Returning empty array.');
        return []; 
      }

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


export const useGetOrders = () => {
  return useQuery(['orders'], fetchOrders, {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false,               

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching orders:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};



  