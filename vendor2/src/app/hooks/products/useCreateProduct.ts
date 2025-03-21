"use client";

import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || Next_server;

// Define ProductFormData type for better type safety
interface ProductFormData {
  title: string;
  subtitle: string;
  handle: string;
  material: string;
  description: string;
  discountable: boolean;
  type: string;
  tags: string;
  width: number;
  length: number;
  height: number;
  weight: number;
  mid_code: string;
  hs_code: string;
  origin_country: string;
  thumbnail: string;
  vendor_id: string;
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
        { revalidate: false }
      );
      // Revalidate
      mutate(`${baseUrl}/vendor/products`, undefined, { revalidate: true });
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error; // Re-throw to allow the component to handle the error
    }
  };

  return {
    createProduct: createProductMutation,
    isLoading,
    error,
  };
};