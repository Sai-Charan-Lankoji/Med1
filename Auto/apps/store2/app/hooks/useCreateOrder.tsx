// import { OrderFormData } from "@/app/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";  
import {NEXT_PUBLIC_API_URL} from "../../constants/constants"
const baseUrl = NEXT_PUBLIC_API_URL ;
const createOrder = async (orderData : any) => {
  const response = await fetch(`${baseUrl}/store/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
    },
  });
};
