import { useMutation, useQueryClient } from '@tanstack/react-query';

const baseUrl = "https://med1-wyou.onrender.com";

interface StoreUpdateFormData {
  storeId: string;
  store_url?: string;
}

const updateStore = async (storeData: StoreUpdateFormData) => {
  const { storeId, ...updateData } = storeData;
  const response = await fetch(`${baseUrl}/vendor/store?id=${storeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update store: ${response.status}`);
  }

  return response.json();
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (storeData: StoreUpdateFormData) => updateStore(storeData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['store']); // Ensure related queries are updated
      },
      onError: (error) => {
        console.error('Error updating store:', error);
      },
    }
  );
};
