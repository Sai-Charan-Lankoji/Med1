import { useMutation, useQueryClient } from '@tanstack/react-query'
import bcrypt from 'bcryptjs';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type UserRoles = "admin" | "member" | "developer";
interface UserFormData {
  first_name: string
  last_name: string
  email: string
  password: string
  role: UserRoles
  vendor_id: string
}

export const useSaveUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, userData, existingHashedPassword }: { userId?: string, userData: UserFormData, existingHashedPassword?: string }) => {
      const url = userId ? `${baseUrl}/vendor/vendoruser/${userId}` : `${baseUrl}/vendor/vendoruser`;
      const method = userId ? 'PUT' : 'POST';

      // Check if the password needs to be updated
      if (userId && existingHashedPassword) {
        const isSamePassword = await bcrypt.compare(userData.password, existingHashedPassword);
        if (!isSamePassword) {
          // Hash the new password if it's different from the existing one
          userData.password = await bcrypt.hash(userData.password, 10);
        } else {
          // Keep the existing hashed password if it's the same
          delete userData.password;
        }
      } else {
        // Hash the password for new users
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(userId ? 'Failed to update user' : 'Failed to create user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
