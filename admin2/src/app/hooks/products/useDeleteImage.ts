import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteImage = async (productId: any): Promise<void> => {
  const response = await fetch(`${baseUrl}/vendor/products/uploads/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to delete image: ${response.status} - ${errorDetails.error}`);
  }

 };


export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteImage, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); 
    },
    onError: (error) => {
      console.error("Error occurred while deleting image:", error);
    },
  });
};
