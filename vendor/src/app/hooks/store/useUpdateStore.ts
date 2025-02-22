import { useMutation, useQueryClient } from '@tanstack/react-query';

const baseUrl = "http://localhost:5000";

interface StoreUpdateFormData {
  storeId: string;
  store_url?: string;
}

const updateStore = async (storeData: StoreUpdateFormData) => {
  const { storeId, ...updateData } = storeData;
  const id = storeId
  const response = await fetch(`${baseUrl}/api/stores/${id}`, {
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
