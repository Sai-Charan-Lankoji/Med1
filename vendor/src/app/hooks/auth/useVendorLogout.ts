import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { set } from 'lodash';

export const useVendorLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName, } = useAuth();
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null); 
    const url = process.env.NEXT_PUBLIC_API_URL 


    try {
      const response = await fetch(`${url}/vendor/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
       sessionStorage.clear();
       setAuthEmail(null);
        setContactName(null);


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
