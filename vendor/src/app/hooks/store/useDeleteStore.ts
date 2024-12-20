import { useMutation, useQueryClient } from "@tanstack/react-query";
const baseUrl = "https://med1-wyou.onrender.com";

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
  return response
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
