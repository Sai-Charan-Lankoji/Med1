import { Next_server } from "@/constant";
import { useSWRConfig } from "swr";

const baseUrl = Next_server;

const deleteStore = async (id: string) => {
  const response = await fetch(`${baseUrl}/api/stores/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Delete Store API response:", data); // Debug the response

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to delete store: ${response.status} - ${data.error || errorDetails.error}`);
  }

  // Extract the nested data (assuming { success: true, data: {...} })
  return data.data || data;
};

export const useDeleteStore = () => {
  const { mutate } = useSWRConfig();

  const deleteStoreMutation = async (id: string) => {
    try {
      const result = await deleteStore(id);
      // Optimistic update
      mutate(
        `${baseUrl}/api/stores`,
        async (currentData: any[] | undefined) => {
          if (currentData) {
            return currentData.filter((store) => store.id !== id);
          }
          return currentData;
        },
        false
      );
      // Trigger revalidation
      mutate(`${baseUrl}/api/stores`);
      return result;
    } catch (error) {
      console.error("Error occurred while deleting store:", error);
      throw error;
    }
  };

  return {
    deleteStore: deleteStoreMutation,
  };
};