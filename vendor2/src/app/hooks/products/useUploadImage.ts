import { useSWRConfig } from 'swr';
import { useState } from 'react';

const baseUrl = "http://localhost:5000";

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/vendor/products/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
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
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return {
    uploadImage: uploadImageMutation,
    isLoading,
    error,
  };
};