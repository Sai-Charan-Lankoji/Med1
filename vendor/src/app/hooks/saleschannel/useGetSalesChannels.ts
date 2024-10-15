const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { useQuery } from '@tanstack/react-query';

const fetchSalesChannels = async () => {
  
  const vendorId = sessionStorage.getItem('vendor_id');

  if (!vendorId) {
    console.log('No vendor ID found in sessionStorage');
    return []; 
  }

  const url = `${baseUrl}/vendor/saleschannel?vendor_id=${vendorId}`;

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
        console.log('No sales channels found or server error. Returning empty array.');
        return []; 
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
    if (!data || data.length === 0) {
        console.log('No sales channels found for the given vendor.');
        return []; 
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


export const useGetSalesChannels = () => {
  return useQuery(['salesChannels'], fetchSalesChannels, {
    refetchOnWindowFocus: true,  
    refetchOnMount: true,        
    cacheTime: 0,                
    staleTime: 0,               
    retry: false,               

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching products:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};



  