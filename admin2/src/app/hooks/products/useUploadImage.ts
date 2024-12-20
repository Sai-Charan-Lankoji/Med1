import { useMutation } from '@tanstack/react-query';
import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;

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
  return useMutation(uploadImage, {
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
  });
};
