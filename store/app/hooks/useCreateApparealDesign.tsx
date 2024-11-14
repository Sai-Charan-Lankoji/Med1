import { useMutation, useQueryClient } from "@tanstack/react-query";
import {NEXT_PUBLIC_API_URL} from "../../constants/constant"  

const CreateApparelDesign = async (data : any) =>{  
    const baseUrl = NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/store/apparelDesign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create apparelDesign: ${response.status} - ${errorText}`);
      }
      return response.json();
};

export const UseCreateApparelDesign = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: CreateApparelDesign,
      onSuccess: () => {
        queryClient.invalidateQueries(['apparelDesign']);
        
      },
      onError: (error) => {
        console.error('Error creating apparelDesign:', error);
      },
    });
  };