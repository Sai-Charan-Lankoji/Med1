import { useMutation, useQueryClient } from '@tanstack/react-query'
const baseUrl = "https://med1-wyou.onrender.com" || 'http://localhost:9000';

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

