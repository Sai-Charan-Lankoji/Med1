import { SalesChannelFormData } from "@/app/@types/saleschannel";
import { useSWRConfig } from "swr";
import { useState } from "react";

const baseUrl = "http://localhost:5000";

const createSalesChannel = async (saleschannelData: SalesChannelFormData) => {
  const response = await fetch(`${baseUrl}/api/saleschannels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(saleschannelData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create sales channel: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateSalesChannel = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createSalesChannelMutation = async (saleschannelData: SalesChannelFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createSalesChannel(saleschannelData);
      // Optimistic update
      mutate(
        `${baseUrl}/api/saleschannels`,
        (currentData: any[] | undefined) =>
          currentData ? [...currentData, result] : [result],
        false
      );
      // Revalidate
      mutate(`${baseUrl}/api/saleschannels`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error('Error creating sales channel:', error);
      throw error;
    }
  };

  return {
    createSalesChannel: createSalesChannelMutation,
    isLoading,
    error,
  };
};