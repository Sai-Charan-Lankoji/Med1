import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NEXT_URL } from '@/constants';

export interface UpdatePlanData {
  name?: string
  description?: string
  price?: number
  features?: string[]
  isActive?: boolean
  commission_rate?: number // Added commission_rate to the interface
}

const baseUrl = NEXT_URL;


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

