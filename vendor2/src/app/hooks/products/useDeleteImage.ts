import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

const deleteImage = async (productId: string): Promise<void> => {
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
  const [error, setError] = useState<Error | null>(null);

  const deleteImageMutation = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteImage(productId);
      // Invalidate the cache for the specific product
      mutate(
        `${baseUrl}/vendor/products/${productId}`,
        (currentData: any) => {
          if (!currentData) return currentData;
          return { ...currentData, thumbnail: "" }; // Update the thumbnail to empty
        },
        false // Optimistic update without revalidation
      );
      // Revalidate the specific product
      mutate(`${baseUrl}/vendor/products/${productId}`);
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
      const err = error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      console.error("Error occurred while deleting image:", err);
      throw err;
    }
  };

  return {
    deleteImage: deleteImageMutation,
    isLoading,
    error,
  };
};