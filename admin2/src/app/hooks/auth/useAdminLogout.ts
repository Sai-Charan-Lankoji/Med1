import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAdminLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null); 
    const url = process.env.NEXT_PUBLIC_API_URL 
    const auth_token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(`${url}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.clear()
        router.push('/');
      } else {
        throw new Error('Failed to log out');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
