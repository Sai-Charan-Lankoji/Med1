import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UpdatePlanData {
  name?: string
  description?: string
  price?: number
  features?: string[]
  isActive?: boolean
}

const baseUrl = "https://med1-wyou.onrender.com" || 'http://localhost:9000';


const updatePlan = async ({ id, ...updateData }: UpdatePlanData & { id: string }): Promise<any> => {
  const response = await fetch(`${baseUrl}/api/plan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation(updatePlan, {
    onSuccess: () => {
      queryClient.invalidateQueries(['plans'])
    },
  })
}

