const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { vendor_id } from '@/app/utils/constant';
import { useQuery } from '@tanstack/react-query';
const id = vendor_id
const fetchVendor = async () => { 
  const url = `${baseUrl}/vendor/vendors/${id}`;
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


export const useGetVendor = () => {
  return useQuery(['store',id], () => fetchVendor(), {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
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



  