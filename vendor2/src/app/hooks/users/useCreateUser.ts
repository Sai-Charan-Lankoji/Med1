import { UserFormData } from '@/app/@types/user';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { vendor_id } from '@/app/utils/constant'; // Import if needed

const baseUrl = "http://localhost:5000";

const createUser = async (newUser: UserFormData) => {
  const response = await fetch(`${baseUrl}/api/vendor-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

export const useCreateUser = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createUserMutation = async (newUser: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createUser(newUser);
      // Optimistic update
      mutate(
        vendor_id ? `${baseUrl}/api/vendor-users/vendor/${vendor_id}` : null,
        (currentData: any[] | undefined) =>
          currentData ? [...currentData, result] : [result],
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
        console.error('Error creating user:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  };

  return {
    createUser: createUserMutation,
    isLoading,
    error,
  };
};