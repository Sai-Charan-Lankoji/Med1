import { useSWRConfig } from "swr";
import { useState } from "react";

const baseUrl = "http://localhost:5000";

// Assuming ProductFormData is defined elsewhere; if not, define it
interface ProductFormData {
  [key: string]: any; // Placeholder; replace with actual type if available
}

const createProduct = async (productData: ProductFormData) => {
  const response = await fetch(`${baseUrl}/vendor/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateProduct = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createProductMutation = async (productData: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createProduct(productData);
      // Optimistic update
      mutate(
        `${baseUrl}/vendor/products`,
        (currentData: any[] | undefined) =>
          currentData ? [...currentData, result] : [result],
        false
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error('Error creating product:', error);
      throw error;
    }
  };

  return {
    createProduct: createProductMutation,
    isLoading,
    error,
  };
};