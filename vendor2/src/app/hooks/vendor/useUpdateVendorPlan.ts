// hooks/useUpdateVendorPlan.ts
import { vendor_id } from "@/app/utils/constant";
import { useSWRConfig } from "swr";

interface UpdatePlanData {
  plan_id: string;
  plan: string;
}

const updateVendorPlan = async (updateData: UpdatePlanData) => {
  const response = await fetch(`http://localhost:5000/api/vendors/${vendor_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update plan');
  }

  return response.json();
};

export const useUpdateVendorPlan = () => {
  const { mutate } = useSWRConfig();

  const updatePlanMutation = async (updateData: UpdatePlanData) => {
    try {
      const result = await updateVendorPlan(updateData);
      // Invalidate or update relevant caches, similar to queryClient.invalidateQueries
      mutate(
        `http://localhost:5000/api/vendors/${vendor_id}`,
        result, // Optimistically update with the returned data
        false // Don’t revalidate immediately
      );
      mutate(`http://localhost:5000/api/vendors/${vendor_id}`); // Revalidate 'vendor'
      // If 'currentPlan' uses a different endpoint, adjust this key accordingly
      mutate(`http://localhost:5000/api/vendors/${vendor_id}/plan`); // Hypothetical 'currentPlan' key
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating vendor plan:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  };

  return {
    updatePlan: updatePlanMutation,
  };
};