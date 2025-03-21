import { SalesChannelFormData } from '@/app/@types/saleschannel';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { Next_server } from '@/constant';

const baseUrl = Next_server;

interface SalesChannelEditFormData {
  channelId: string;
  name: string;
  description: string;
  vendor_id: string;
  default_sales_channel_id: string;
}

const updateSalesChannel = async (saleschannelData: SalesChannelEditFormData) => {
  const id = saleschannelData.default_sales_channel_id;
  const response = await fetch(`${baseUrl}/api/saleschannels/${id}`, {
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
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateSalesChannelMutation = async (saleschannelData: SalesChannelEditFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateSalesChannel(saleschannelData);
      // Optimistic update
      mutate(
        `${baseUrl}/api/saleschannels/${id}`,
        result,
        false
      );
      // Revalidate
      mutate(`${baseUrl}/api/saleschannels/${id}`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error('Error updating sales channel:', error);
      throw error;
    }
  };

  return {
    updateSalesChannel: updateSalesChannelMutation,
    isLoading,
    error,
  };
};