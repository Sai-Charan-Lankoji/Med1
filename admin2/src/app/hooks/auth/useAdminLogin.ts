import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { NEXT_URL } from '@/constants';
import { TokenEncryption } from '@/app/utils/encryption';

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setFirstName, setLastName, setRole, setAdminId } = useAuth();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null); 

    const localUrl = "http://localhost:5000/api/auth/login" 
    // `${NEXT_URL}/api/auth/login`

    try {
      const response = await fetch( `${NEXT_URL}/api/auth/login`, {
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
        throw new Error('Failed to authenticate admin');
      }

      const data = await response.json();
      const { first_name, last_name, role, id: adminId } = data.user; 

      // Encrypt and then decrypt the token to test the process
      const encryptedToken = await TokenEncryption.encrypt(data.token);
      const decryptedToken = await TokenEncryption.decrypt(encryptedToken);
      
      localStorage.setItem('auth_token', decryptedToken);
      localStorage.setItem('email', email);
      localStorage.setItem('first_name', first_name);
      localStorage.setItem('last_name', last_name);
      localStorage.setItem('role', role);
      localStorage.setItem('admin_id', adminId);
      
      setAuthEmail(email);
      setFirstName(first_name);
      setLastName(first_name);
      setRole(role);
      setAdminId(adminId);

      router.push('/admin/vendors');
    } catch (err: any) {
      console.error('Error during login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};