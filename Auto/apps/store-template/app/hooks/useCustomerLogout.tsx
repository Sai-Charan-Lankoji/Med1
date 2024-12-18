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
      // Get current customer ID
      const customerId = sessionStorage.getItem('customerId');
      if (customerId) {
        // Save current cart state before logout
        const currentCart = localStorage.getItem(`cart_${customerId}`);
        if (currentCart) {
          // Transfer authenticated user's cart to guest cart
          localStorage.setItem('guest_cart', currentCart);
          // Remove the user-specific cart
          localStorage.removeItem(`cart_${customerId}`);
        }
      }
    } catch (error) {
      console.error('Error handling cart transition during logout:', error);
    }
  };

  const clearUserSession = () => {
    // Clear authentication tokens
    localStorage.removeItem('customerToken');
    
    // Clear session storage
    sessionStorage.removeItem('customerId');
    sessionStorage.removeItem('customerEmail');
    
    // Clear user context
    setUser(null, null);
    setIsLogin(false);
    
    // Clear cart context
    // clearCart();
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/store/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log out');
      }

      // Handle cart transition before clearing session
      handleCartTransition();

      // Clear all user session data
      clearUserSession();
      
      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'An error occurred during logout');
      
      // Even if the API call fails, we should still clear local session
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