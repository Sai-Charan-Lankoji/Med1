import { useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = "http://localhost:5000";
const createProduct = async (productData: ProductFormData) => {
  const response = await fetch(`${baseUrl}/vendor/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    },
  });
};
