import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import {NEXT_PUBLIC_API_URL} from "@/constants/constants"
const baseUrl = NEXT_PUBLIC_API_URL 
const createCart = async (cartData : any) => {
  const response = await fetch(`${baseUrl}/api/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(cartData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create cart: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      console.error('Error creating cart:', error);
    },
  });
};
