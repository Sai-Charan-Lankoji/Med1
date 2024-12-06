import { SalesChannelFormData } from '@/app/@types/saleschannel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface SalesChannelEditFormData{
  channelId: string,
  name: string,
  description: string,
  vendor_id: string,
  default_sales_channel_id: string
}

const updateSalesChannel = async (saleschannelData: SalesChannelEditFormData) => {
  console.log("SALES CHANNEL ID: ", saleschannelData.default_sales_channel_id)
  const id = saleschannelData.default_sales_channel_id;
  const response = await fetch(`${baseUrl}/vendor/saleschannel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(saleschannelData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update sales channel: ${response.status}`);
  }

  return response.json();
};

export const useUpdateSalesChannel = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((saleschannelData: any) => updateSalesChannel(saleschannelData), {
    onSuccess: () => {
      queryClient.invalidateQueries(['saleschannel',id]); 
    },
    onError: (error) => {
      console.error('Error updating sales channel:', error);
    },
  });
};
