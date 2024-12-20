import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;
import { useQuery } from '@tanstack/react-query';

// Function to fetch plans
const fetchPlans = async () => {
  const url = `${baseUrl}/api/plan`;

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
      console.log('Error fetching plans:', error.message);
      return []; 
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};


export const useGetPlans = () => {
  return useQuery(['plans'], fetchPlans, {
    

    // Error handling
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching plans:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};
