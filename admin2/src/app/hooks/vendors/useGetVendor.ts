import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;
import { useQuery } from '@tanstack/react-query';

const fetchVendor = async (id: string) => {
  const url = `${baseUrl}/api/vendors/${id}`;  
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
        console.log('No customer found or server error. Returning empty array.');
        return []; 
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    return data.vendor;
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


export const useGetVendor = (id: string) => {
  return useQuery(['vendor', id], () => fetchVendor(id), {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false,               

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching vendor:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};



  