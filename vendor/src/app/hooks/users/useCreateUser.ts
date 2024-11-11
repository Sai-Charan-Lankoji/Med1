import { useMutation, useQueryClient } from '@tanstack/react-query'
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export declare enum UserRoles {
    ADMIN = "admin",
    MEMBER = "member",
    DEVELOPER = "developer"
  }
interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  role:UserRoles
  vendorId: string
  storeId: string
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: UserFormData) => {
      const response = await fetch(`${baseUrl}/vendor/users`, {
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