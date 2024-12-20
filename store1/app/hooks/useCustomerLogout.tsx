import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import {NEXT_PUBLIC_API_URL} from "../../constants/constants"

export const useCustomerLogout = () => {
  const { setUser, setIsLogin } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCartTransition = () => {
    try {
      const customerId = sessionStorage.getItem('customerId');
      if (customerId) {
        const currentCart = localStorage.getItem(`cart_${customerId}`);
        if (currentCart) {
          localStorage.setItem('guest_cart', currentCart);
          localStorage.removeItem(`cart_${customerId}`);
        }
      }
    } catch (error) {
      console.error('Error handling cart transition during logout:', error);
    }
  };

  const clearUserSession = () => {
    localStorage.removeItem('customerToken');
    
    sessionStorage.removeItem('customerId');
    sessionStorage.removeItem('customerEmail');
    
    setUser(null, null);
    setIsLogin(false);
    
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const auth_token = localStorage.getItem('customerToken')
    try {
      const url = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/customer/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log out');
      }

      handleCartTransition();

      clearUserSession();

       
      router.push('/');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'An error occurred during logout');
      
      clearUserSession();
    } finally {
      setLoading(false);
    }
  };

  return { 
    logout, 
    loading, 
    error 
  };
};