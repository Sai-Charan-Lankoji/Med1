import { useMutation } from '@tanstack/react-query';

const baseUrl = "http://localhost:5000";

// Function to create a publishable API key
const createPublishableApiKey = async ({ title,created_by }) => {
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
  return useMutation(createPublishableApiKey, {
    onSuccess: (data) => {
      console.log('Publishable API key created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating publishable API key:', error);
    },
  });
};