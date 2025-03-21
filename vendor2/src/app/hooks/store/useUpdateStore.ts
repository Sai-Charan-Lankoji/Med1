import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

interface StoreUpdateFormData {
  storeId: string;
  store_url?: string;
}

const updateStore = async (storeData: StoreUpdateFormData) => {
  const { storeId, ...updateData } = storeData;
  const id = storeId;
  const response = await fetch(`${baseUrl}/api/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  console.log("Update Store API response:", data); // Debug the response

  if (!response.ok) {
    throw new Error(`Failed to update store: ${response.status} - ${data.error}`);
  }

  // Extract the nested data (assuming { success: true, data: storeObject })
  return data.data || data;
};

export const useUpdateStore = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateStoreMutation = async (storeData: StoreUpdateFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateStore(storeData);
      // Optimistic update
      mutate(
        `${baseUrl}/api/stores/${storeData.storeId}`,
        result,
        false
      );
      // Revalidate
      mutate(`${baseUrl}/api/stores/${storeData.storeId}`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error updating store:", error);
      throw error;
    }
  };

  return {
    updateStore: updateStoreMutation,
    isLoading,
    error,
  };
};