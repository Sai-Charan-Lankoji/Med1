import { vendor_id } from '@/app/utils/constant';
import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';

const baseUrl = "http://localhost:5000";

const deleteUser = async (userId: string) => {
  if (!vendor_id) {
    console.warn('No vendor ID found in sessionStorage');
    throw new Error('Vendor ID not found');
  }

  const url = `${baseUrl}/api/vendor-users/${userId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`HTTP error! Status: ${response.status}, ${errorData.error}`);
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const useDeleteUser = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteUserMutation = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteUser(userId);
      // Optimistic update
      mutate(
        vendor_id ? `${baseUrl}/api/vendor-users/vendor/${vendor_id}` : null,
        (currentData: any[] | undefined) =>
          currentData ? currentData.filter((user) => user.id !== userId) : currentData,
        false
      );
      // Revalidate
      mutate(vendor_id ? `${baseUrl}/api/vendor-users/vendor/${vendor_id}` : null);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      if (error instanceof Error) {
        console.error('Error occurred while deleting user:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  };

  return {
    deleteUser: deleteUserMutation,
    isLoading,
    error,
  };
};