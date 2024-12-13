const baseUrl = "https://med1-wyou.onrender.com";
import { vendor_id } from '@/app/utils/constant';
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  

  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return []; 
  }

  const url = `${baseUrl}/api/vendor-users/vendor/${vendor_id}`;

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
        console.log('No Users found or server error. Returning empty array.');
        return []; 
      }

      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }
 
    if (!data || data.length === 0) {
      console.log('No Users found for the given vendor.');
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


export const useGetUsers = () => {
  return useQuery(['users'], fetchUsers, {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false,                

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while fetching users:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    },
  });
};



  