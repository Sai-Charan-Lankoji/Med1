"use client";

import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || Next_server;

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/vendor/products/uploads`, {
    method: "POST",
    body: formData,
    credentials: "include", // Include credentials if needed for authentication
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
  }

  const { fileUrl } = await response.json();
  return fileUrl;
};

export const useUploadImage = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const uploadImageMutation = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const fileUrl = await uploadImage(file);
      // Optional: Update cache if applicable
      // mutate(`${baseUrl}/vendor/products`, ...);
      setIsLoading(false);
      return fileUrl;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error; // Re-throw to allow the component to handle the error
    }
  };

  return {
    uploadImage: uploadImageMutation,
    isLoading,
    error,
  };
};