import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setFirstName, setLastName, setRole, setAdminId } = useAuth();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = "https://med1-wyou.onrender.com"; 

      const response = await fetch(`${url}/api/auth/login`, {
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
      const { email: userEmail, first_name, last_name, role, id: adminId } = data.user;

      // Save data to sessionStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('email', email);
      localStorage.setItem('first_name', first_name);
      localStorage.setItem('last_name', last_name);
      localStorage.setItem('role', role);
      localStorage.setItem('admin_id', adminId);
      setAuthEmail(email);
      setFirstName(first_name);
      setLastName(last_name);
      setRole(role);
      setAdminId(adminId);
    

      // Navigate to admin/vendors after successful login
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
