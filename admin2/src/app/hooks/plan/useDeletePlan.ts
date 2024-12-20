import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NEXT_URL } from '@/constants';
const baseUrl =  NEXT_URL;

const deletePlan = async (id: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/plan/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()

  return useMutation(deletePlan, {
    onSuccess: () => {
      queryClient.invalidateQueries(['plans'])
    },
  })
}

