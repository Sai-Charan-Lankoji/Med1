import { useQuery } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const fetchPublishableapikeys = async (id: string) => {
  const url = `${baseUrl}/vendor/publishableapikey/${id}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch publishable api keys details: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const useGetPublishableApiKeys = (id: string) => {
  return useQuery(['publishabelapikey', id], () => fetchPublishableapikeys(id), {
    refetchOnWindowFocus: false,  
    refetchOnMount: false,        
    cacheTime: 0,                
    staleTime: 1000 * 60 * 5,               
    retry: false, 
    onError: (error) => {
      console.error('Error fetching publishable details:', error);
    },
  });
};
