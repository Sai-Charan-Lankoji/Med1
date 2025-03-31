
import { NEXT_PUBLIC_API_URL } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';

const baseUrl = NEXT_PUBLIC_API_URL;
const fetchPlan = async (id: string) => {
  const url = `${baseUrl}/admin/plan/${id}`;

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
        console.log('No plans found or server error. Returning empty array.');
        return [];
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    if (!data || data.length === 0) {
      console.log('No plans found.');
      return []; 
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching plan:', error.message);
      return []; 
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};

export const useGetPlan = (id: string) => {
  return useQuery(['plan',id], () => fetchPlan(id), {
    refetchOnWindowFocus: false, 
    refetchOnMount: false,    
    cacheTime: 1000 * 60 * 10,  
    staleTime: 1000 * 60 * 5,   
    retry: false,            

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching plan:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};
