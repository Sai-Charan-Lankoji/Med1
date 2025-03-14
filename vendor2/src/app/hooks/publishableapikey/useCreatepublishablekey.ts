import { useSWRConfig } from 'swr';
import { useState } from 'react';

const baseUrl = "http://localhost:5000";

// Function to create a publishable API key
const createPublishableApiKey = async ({ title, created_by }: { title: string; created_by: string }) => {
  const url = `${baseUrl}/api/publishibleapikey`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ title, created_by }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || `Failed to create publishable API key: ${response.status}`);
  }

  return await response.json();
};

// Custom hook for the mutation
export const useCreatePublishableApiKey = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createPublishableApiKeyMutation = async ({ title, created_by }: { title: string; created_by: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPublishableApiKey({ title, created_by });
      console.log('Publishable API key created successfully:', result);
      // Optional: Update cache if there's a related query
      mutate(
        `${baseUrl}/api/publishibleapikey`,
        (currentData: any[] | undefined) =>
          currentData ? [...currentData, result] : [result],
        false
      );
      mutate(`${baseUrl}/api/publishibleapikey`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error('Error creating publishable API key:', error);
      throw error;
    }
  };

  return {
    createPublishableApiKey: createPublishableApiKeyMutation,
    isLoading,
    error,
  };
};