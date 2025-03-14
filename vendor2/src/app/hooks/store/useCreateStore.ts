import { StoreFormData } from "@/app/@types/store";
import { useSWRConfig } from "swr";

const baseUrl = "http://localhost:5000";

const createStore = async (storeData: StoreFormData) => {
  const response = await fetch(`${baseUrl}/api/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(storeData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create store: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateStore = () => {
  const { mutate } = useSWRConfig();

  const createStoreMutation = async (storeData: StoreFormData) => {
    try {
      const result = await createStore(storeData);
      // Invalidate or update the 'stores' cache, similar to queryClient.invalidateQueries(['stores'])
      mutate(
        `${baseUrl}/api/stores`,
        async (currentData: any[] | undefined) => {
          // Optimistically add the new store to the list
          return currentData ? [...currentData, result] : [result];
        },
        false // Don’t revalidate immediately
      );
      // Trigger revalidation after success
      mutate(`${baseUrl}/api/stores`);
      return result;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  };

  return {
    createStore: createStoreMutation,
  };
};