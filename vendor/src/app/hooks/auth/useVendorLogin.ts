import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface VendorLoginResponse {
  token: string;
  vendor: {
    id: string;
    contact_email: string;
    contact_name: string;
    business_type: string;
  };
}

export const useVendorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName } = useAuth()!;
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
  
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        console.log(`Response not OK: ${response.status}`); 
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid email or password');
        }
        throw new Error('Failed to authenticate vendor');
      }
  
      const data: VendorLoginResponse = await response.json();
      if (data.token) {
        console.log('Login successful'); 
        
        sessionStorage.setItem('vendor_id', data.vendor.id); 
        sessionStorage.setItem('business_type', data.vendor.business_type);
        setAuthEmail(data.vendor.contact_email);
        setContactName(data.vendor.contact_name);
        
        router.push('/vendor/orders');
      }
    } catch (err: any) {
      console.error('Error during login:', err); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { login, loading, error };
};