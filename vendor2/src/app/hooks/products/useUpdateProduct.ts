import { useSWRConfig } from 'swr';
import { useState } from 'react';

const baseUrl = "http://localhost:5000";

const updateProduct = async (id: string, productData: any) => {
  const response = await fetch(`${baseUrl}/vendor/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status}`);
  }

  return response.json();
};

export const useUpdateProduct = (id: string) => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateProductMutation = async (productData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateProduct(id, productData);
      // Optimistic update
      mutate(
        `${baseUrl}/vendor/products/${id}`,
        result,
        false
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products/${id}`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error('Error updating product:', error);
      throw error;
    }
  };

  return {
    updateProduct: updateProductMutation,
    isLoading,
    error,
  };
};