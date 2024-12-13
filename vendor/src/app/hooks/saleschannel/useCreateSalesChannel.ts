import { SalesChannelFormData } from "@/app/@types/saleschannel";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = "https://med1-wyou.onrender.com";
const createSalesChannel = async (saleschannelData: SalesChannelFormData) => {
  const response = await fetch(`${baseUrl}/vendor/saleschannel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(saleschannelData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create sales channel: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateSalesChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesChannel,
    onSuccess: () => {
      queryClient.invalidateQueries(['salesChannels']);
    },
    onError: (error) => {
      console.error('Error creating sales channel:', error);
    },
  });
};
