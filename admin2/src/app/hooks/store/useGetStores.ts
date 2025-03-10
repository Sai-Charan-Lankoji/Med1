import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;
import { useQuery } from '@tanstack/react-query';

const fetchStores = async (vendor_id: string) => {
  

  const url = `${baseUrl}/api/stores/vendor?vendor_id=${vendor_id}`;

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
        console.log('No stores found or server error. Returning empty array.');
        return []; 
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
 
    if (!data || data.length === 0) {
      console.log('No stores found for the given vendor.');
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


export const useGetStores = (vendor_id: string) => {
  return useQuery(['stores', vendor_id],  () => fetchStores(vendor_id), {
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



  