// hooks/useUpdateVendorPlan.ts
import { vendor_id } from "@/app/utils/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { useEffect } from "react";


interface UpdatePlanData {
  plan_id: string;
  plan: string;
}

export const useUpdateVendorPlan = () => { 
 

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdatePlanData) => {
      const response = await fetch(`http://localhost:9000/vendor/vendors/${vendor_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData), 

      }); 
      console.log("updated Data : " , updateData)

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update plan');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
    },
  });
};