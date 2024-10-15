import { useQuery } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const fetchPublishableapikeys = async () => {
  const url = `${baseUrl}/vendor/publishableapikey`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch publishable api keys details: ${response.status}`);
  }

  const data = await response.json();
  return data[0];
};

export const useGetPublishableApiKeys = () => {
  return useQuery(['publishabelapikey'], () => fetchPublishableapikeys(), {
    onError: (error) => {
      console.error('Error fetching publishable details:', error);
    },
  });
};
