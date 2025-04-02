"use client";

import { useSWRConfig } from "swr";
import { useState } from "react";
import { Next_server } from "@/constant";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || Next_server;

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  // Use the correct route from your backend
  const response = await fetch(`${baseUrl}/api/files`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // Make sure your backend returns fileUrl and relativePath in the response
  return { 
    fileUrl: data.fileUrl, 
    relativePath: data.relativePath || data.fileUrl 
  };
};

export const useUploadImage = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const uploadImageMutation = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const { fileUrl, relativePath } = await uploadImage(file);
      // Optional: Update cache if applicable
      // mutate(`${baseUrl}/vendor/products`, ...);
      setIsLoading(false);
      return { fileUrl, relativePath }; // Return both
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