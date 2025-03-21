import { StoreFormData } from "@/app/@types/store";
import { Next_server } from "@/constant";
import { useSWRConfig } from "swr";

const baseUrl = Next_server;

const createStore = async (storeData: StoreFormData) => {
  const response = await fetch(`${baseUrl}/api/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(storeData),
  });

  const data = await response.json();
  console.log("Create Store API response:", data); // Debug the response

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create store: ${response.status} - ${data.error || errorText}`);
  }

  // Extract the nested data (assuming { success: true, data: storeObject })
  return data.data || data;
};

export const useCreateStore = () => {
  const { mutate } = useSWRConfig();

  const createStoreMutation = async (storeData: StoreFormData) => {
    try {
      const result = await createStore(storeData);
      // Optimistic update
      mutate(
        `${baseUrl}/api/stores`,
        async (currentData: any[] | undefined) => {
          return currentData ? [...currentData, result] : [result];
        },
        false
      );
      // Trigger revalidation
      mutate(`${baseUrl}/api/stores`);
      return result;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  };

  return {
    createStore: createStoreMutation,
  };
};