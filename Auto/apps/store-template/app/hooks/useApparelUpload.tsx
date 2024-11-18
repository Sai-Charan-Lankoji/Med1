import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_API_URL} from "../../constants/constants"

const baseUrl = NEXT_PUBLIC_API_URL;

type CreateApparelUploadInput = {
  url: string | undefined;
  apparelDesign_id?: string;
};

// Function to make the API POST request
const createApparelUpload = async (uploadData: CreateApparelUploadInput) => {
  const response = await fetch(`${baseUrl}/store/apparelUpload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(uploadData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create apparel upload: ${response.status} - ${errorText}`);
  }

  return response.json(); // Return the response JSON
};

// Custom hook to create an apparel upload
export const useCreateApparelUpload = () => {
  const queryClient = useQueryClient(); // For cache invalidation or refreshing data

  return useMutation({
    mutationFn: createApparelUpload, // Function to call for mutation
    onSuccess: () => {
      // Invalidate or refresh queries that depend on apparel uploads
      queryClient.invalidateQueries(['apparelUploads']); // Optional: adjust query key as per your needs
    },
    onError: (error: any) => {
      console.error('Error creating apparel upload:', error);
    },
  });
};
