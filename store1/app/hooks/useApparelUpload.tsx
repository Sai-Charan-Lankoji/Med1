import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_API_URL} from "../../constants/constants"

const baseUrl = NEXT_PUBLIC_API_URL;

type CreateApparelUploadInput = {
  url: string | undefined;
  apparelDesign_id?: string;
};

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

  return response.json(); 
};


export const useCreateApparelUpload = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: createApparelUpload, 
    onSuccess: () => {
      queryClient.invalidateQueries(['apparelUploads']);
    },
    onError: (error: any) => {
      console.error('Error creating apparel upload:', error);
    },
  });
};
