import { UserFormData } from '@/app/@types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NEXT_URL } from '@/constants';
const baseUrl = NEXT_URL;



export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: UserFormData) => {
      const response = await fetch(`${baseUrl}/vendor/vendoruser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}