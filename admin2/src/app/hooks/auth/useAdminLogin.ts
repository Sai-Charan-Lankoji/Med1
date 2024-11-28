import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setFirstName, setLastName, setRole , setAdminId } = useAuth();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
  
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid email or password');
        }
        throw new Error('Failed to authenticate vendor');
      }

      // Assuming the response contains the necessary information to set auth context
      const data = await response.json();
      setAuthEmail(data.user.email);
      setFirstName(data.user.first_name);
      setLastName(data.user.last_name);
      setRole(data.user.role); 
      setAdminId(data.user.id);
      router.push('admin/vendors');
      console.log(data.user)
      // Navigate to admin/vendors after successful login
    } catch (err: any) {
      console.error('Error during login:', err); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { login, loading, error };
};
