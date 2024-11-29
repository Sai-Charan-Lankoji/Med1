import { useMutation, useQueryClient } from '@tanstack/react-query'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

const deletePlan = async (id: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/admin/plan/${id}`, {
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

