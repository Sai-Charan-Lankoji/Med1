import { useSWRConfig } from "swr";

const baseUrl = "http://localhost:5000";

const deleteStore = async (id: string) => {
  const response = await fetch(`${baseUrl}/api/stores/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to delete store: ${response.status} - ${errorDetails.error}`);
  }
  return response;
};

export const useDeleteStore = () => {
  const { mutate } = useSWRConfig();

  const deleteStoreMutation = async (id: string) => {
    try {
      const result = await deleteStore(id);
      // Invalidate or update the 'stores' cache, similar to queryClient.invalidateQueries(['stores'])
      mutate(
        `${baseUrl}/api/stores`,
        async (currentData: any[] | undefined) => {
          // Optimistically remove the store from the list
          if (currentData) {
            return currentData.filter((store) => store.id !== id);
          }
          return currentData;
        },
        false // Don’t revalidate immediately
      );
      // Trigger revalidation after success
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