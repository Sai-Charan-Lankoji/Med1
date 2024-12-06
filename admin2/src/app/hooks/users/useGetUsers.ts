import { User } from "@medusajs/medusa";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const fetchUsers = async (): Promise<User[]> => { // Change return type to User[]
  const response = await fetch(`${baseUrl}/admin/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid email or password');
    }
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  return data.users; // Ensure it returns the array of users
};
