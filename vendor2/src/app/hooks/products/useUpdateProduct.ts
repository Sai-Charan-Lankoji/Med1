"use client";

import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || Next_server;

// Define ProductUpdateData type for better type safety
interface ProductUpdateData {
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  [key: string]: any; // Allow additional fields if needed
}

const updateProduct = async (id: string, productData: ProductUpdateData) => {
  const response = await fetch(`${baseUrl}/vendor/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const useUpdateProduct = (id: string) => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateProductMutation = async (productData: ProductUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateProduct(id, productData);
      // Optimistic update
      mutate(
        `${baseUrl}/vendor/products/${id}`,
        result,
        { revalidate: false }
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products/${id}`, undefined, { revalidate: true });
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error; // Re-throw to allow the component to handle the error
    }
  };

  return {
    updateProduct: updateProductMutation,
    isLoading,
    error,
  };
};