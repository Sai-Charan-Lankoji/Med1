import { useQuery } from '@tanstack/react-query';
import { NEXT_URL } from '@/constants';

const baseUrl = NEXT_URL;

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

    const data = await response.json(); 
    return data.invites;
  },{
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
