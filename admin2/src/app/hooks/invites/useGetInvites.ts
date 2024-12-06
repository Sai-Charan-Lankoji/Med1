import { useQuery } from '@tanstack/react-query';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useGetInvites = () => {
  return useQuery(['invites'], async () => {
    const response = await fetch(`${baseUrl}/admin/invites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invites');
    }

    const data = await response.json(); // Assuming the response is an array of invites
    return data.invites;
  },{
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
