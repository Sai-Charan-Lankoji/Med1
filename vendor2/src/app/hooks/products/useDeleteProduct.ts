import { useSWRConfig } from "swr";
import { useState } from "react";

const baseUrl = "http://localhost:5000";

const deleteProduct = async (id: string) => {
  const response = await fetch(`${baseUrl}/vendor/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to delete product: ${response.status} - ${errorDetails.error}`);
  }
};

export const useDeleteProduct = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteProductMutation = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      // Optimistic update
      mutate(
        `${baseUrl}/vendor/products`,
        (currentData: any[] | undefined) =>
          currentData ? currentData.filter((product) => product.id !== id) : currentData,
        false
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error occurred while deleting product:", error);
      throw error;
    }
  };

  return {
    deleteProduct: deleteProductMutation,
    isLoading,
    error,
  };
};