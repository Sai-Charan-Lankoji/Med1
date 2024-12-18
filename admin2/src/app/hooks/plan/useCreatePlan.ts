import { CreatePlanData, Plan } from '@/app/@types/plan';
import { useMutation, useQueryClient } from '@tanstack/react-query'

const baseUrl = "https://med1-wyou.onrender.com"

export const useCreatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPlan: CreatePlanData) => {

      const response = await fetch(`${baseUrl}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include', // Added to handle credentials
        },
        credentials: "include", // Added to ensure cookies are sent
        body: JSON.stringify(newPlan),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create plan: ${response.status}`);
      }

      const data = await response.json();
      return data.plan as Plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
    },
  })
}

