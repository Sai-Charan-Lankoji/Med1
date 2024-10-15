import { SalesChannelFormData } from '@/app/@types/saleschannel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const updateSalesChannel = async (id: string, saleschannelData: SalesChannelFormData) => {
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

  return useMutation((saleschannelData: any) => updateSalesChannel(id, saleschannelData), {
    onSuccess: () => {
      queryClient.invalidateQueries(['saleschannels', id]); 
    },
    onError: (error) => {
      console.error('Error updating sales channel:', error);
    },
  });
};
