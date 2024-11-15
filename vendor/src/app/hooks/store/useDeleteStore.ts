import { useMutation, useQueryClient } from "@tanstack/react-query";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const deleteStore = async (id: string) => {
  const response = await fetch(`${baseUrl}/vendor/store/${id}`, {
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
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries(["stores"]);
    },
    onError: (error) => {
      console.error("Error occurred while deleting store:", error);
    },
  });
};
