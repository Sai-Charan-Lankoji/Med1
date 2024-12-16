const baseUrl = "https://med1-wyou.onrender.com";
import { useQuery } from '@tanstack/react-query';

// Function to fetch plans
const fetchPlan = async (id: string) => {
  const url = `${baseUrl}/admin/plan/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);

      if (response.status === 404 || response.status === 500) {
        console.log('No plans found or server error. Returning empty array.');
        return []; // Return an empty array if no plans found or server error occurs
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    if (!data || data.length === 0) {
      console.log('No plans found.');
      return []; // Return an empty array if the plans list is empty
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching plan:', error.message);
      return []; // Return an empty array in case of error
    } else {
      console.error('An unknown error occurred:', error);
      return [];
    }
  }
};

// Custom React Query hook for fetching plans
export const useGetPlan = (id: string) => {
  return useQuery(['plan',id], () => fetchPlan(id), {
    refetchOnWindowFocus: false, // Avoid refetching when the window regains focus
    refetchOnMount: false,      // Avoid refetching when the component mounts
    cacheTime: 1000 * 60 * 10,  // Cache the response for 10 minutes
    staleTime: 1000 * 60 * 5,   // Mark data as fresh for 5 minutes
    retry: false,               // Disable retries on error

    // Error handling
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching plan:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};
