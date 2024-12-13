import { useMutation } from '@tanstack/react-query';

const baseUrl = "https://med1-wyou.onrender.com";

// Function to create a publishable API key
const createPublishableApiKey = async ({ salesChannelId, keyData }) => {
  const url = `${baseUrl}/vendor/publishableapikey`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ salesChannelId, keyData }),
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