import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

const createPublishableApiKey = async ({ title, created_by }: { title: string; created_by: string }) => {
  const url = `${baseUrl}/api/publishibleapikey`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ title, created_by }),
  });

  const data = await response.json();
  console.log("Create Publishable API Key API response:", data); // Debug the response

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || `Failed to create publishable API key: ${response.status}`);
  }

  // Extract the nested data (assuming { success: true, data: apiKeyObject })
  return data.data || data;
};

export const useCreatePublishableApiKey = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createPublishableApiKeyMutation = async ({ title, created_by }: { title: string; created_by: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPublishableApiKey({ title, created_by });
      // Optimistic update
      mutate(
        `${baseUrl}/api/publishibleapikey`,
        (currentData: any[] | undefined) =>
          currentData ? [...currentData, result] : [result],
        false
      );
      // Revalidate
      mutate(`${baseUrl}/api/publishibleapikey`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error creating publishable API key:", error);
      throw error;
    }
  };

  return {
    createPublishableApiKey: createPublishableApiKeyMutation,
    isLoading,
    error,
  };
};