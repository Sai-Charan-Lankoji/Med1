import { useMutation, useQueryClient } from "@tanstack/react-query";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const deleteProduct = async (id: string) => {
  const response = await fetch(`${baseUrl}/vendor/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to delete product: ${response.status} - ${errorDetails.error}`);
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error occurred while deleting product:", error);
    },
  });
};
