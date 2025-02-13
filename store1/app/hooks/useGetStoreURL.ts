const baseUrl = "http://localhost:5000";
import { useQuery } from '@tanstack/react-query';

const fetchStoreByURL = async (store_url: string) => {
  const url = `${baseUrl}/api/stores/url/${store_url}`;

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
        console.log('No Store found or server error. Returning empty array.');
        return [];
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    if (!data || data.length === 0) {
      console.log('No store found.');
      return []; 
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching store:', error.message);
      return []; 
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};

export const useGetStore = (store_url: string) => {
  return useQuery(['store',store_url], () => fetchStoreByURL(store_url), {
    refetchOnWindowFocus: false, 
    refetchOnMount: false,    
    cacheTime: 1000 * 60 * 10,  
    staleTime: 1000 * 60 * 5,   
    retry: false,            

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching store:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};
