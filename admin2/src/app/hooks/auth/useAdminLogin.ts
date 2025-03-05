// src/hooks/auth/useAdminLogin.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { NEXT_URL } from '@/constants';

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setFirstName, setLastName, setRole, setAdminId } = useAuth();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login request
      const loginResponse = await fetch(`${NEXT_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || 'Failed to authenticate admin');
      }

      // Step 2: Fetch user details after login
      const meResponse = await fetch(`${NEXT_URL}/api/auth/me`, {
        credentials: 'include', // Cookie is sent automatically
      });

      if (!meResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await meResponse.json();
      const { first_name, last_name, role, id: adminId } = userData;

      // Update AuthContext
      setAuthEmail(email);
      setFirstName(first_name);
      setLastName(last_name);
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