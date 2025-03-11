import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { set } from 'lodash';
import { auth_token } from '@/app/utils/constant';

export const useVendorLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName,setCompanyName } = useAuth();
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null); 
    const url = 'http://localhost:5000';
    try {
      const response = await fetch(`${url}/api/vendor/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        credentials: 'include',
      });

      if (response.ok) {
       sessionStorage.clear();
       setAuthEmail(null);
        setContactName(null);
        setCompanyName(null);
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
