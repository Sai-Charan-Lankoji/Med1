import { useMutation, useQueryClient } from '@tanstack/react-query';
const baseUrl = "https://med1-wyou.onrender.com";


const updateProduct = async (id: string, productData: any) => {
  const response = await fetch(`${baseUrl}/vendor/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status}`);
  }

  return response.json();
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation((productData: any) => updateProduct(id, productData), {
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]); 
    },
    onError: (error) => {
      console.error('Error updating product:', error);
    },
  });
};
