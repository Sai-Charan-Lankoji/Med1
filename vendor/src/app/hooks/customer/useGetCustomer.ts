const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { useQuery } from '@tanstack/react-query';

const fetchCustomer = async (id: string) => {

  const url = `${baseUrl}/vendor/customers/${id}`;

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


export const useGetCustomer = (id: string) => {
  return useQuery(['customer', id], () => fetchCustomer(id), {
    refetchOnWindowFocus: true,  
    refetchOnMount: true,        
    cacheTime: 0,                
    staleTime: 0,               
    retry: false,               

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching customer:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};



  