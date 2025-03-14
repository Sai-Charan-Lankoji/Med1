import { useSWRConfig } from "swr";
import { useState } from "react";

const baseUrl = "http://localhost:5000";

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
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteImageMutation = async (productId: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteImage(productId);
      // Optimistic update
      mutate(
        `${baseUrl}/vendor/products`,
        (currentData: any[] | undefined) =>
          currentData ? currentData.filter((product) => product.id !== productId) : currentData,
        false
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error occurred while deleting image:", error);
      throw error;
    }
  };

  return {
    deleteImage: deleteImageMutation,
    isLoading,
    error,
  };
};