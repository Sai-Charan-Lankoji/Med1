import { useMutation } from '@tanstack/react-query';
import { NEXT_URL } from '@/constants';

const baseUrl = NEXT_URL;

export const useCreateInvite = () => {
  return useMutation(async ({ email, role }: { email: string; role: string }) => {
    const response = await fetch(`${baseUrl}/admin/invites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ user: email, role }),
    });

    if (!response.ok) {
      throw new Error('Failed to create invite');
    }

    return await response.text(); 
  });
};
