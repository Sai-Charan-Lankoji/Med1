import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

interface Customer {
  id: string;
  email: string;
  first_name: string;
  profile_photo: string | null;
}

interface UseCustomerLogoutReturn {
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  customer: Customer | null;
  fetchCustomerData: () => Promise<void>;
}

export const useCustomerLogout = (): UseCustomerLogoutReturn => {
  const { setUser, setIsLogin } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customer data');
      }

      const { data } = await response.json();
      setCustomer({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        profile_photo: data.profile_photo,
      });
      setUser({
        firstName: data.first_name,
        email: data.email,
        profilePhoto: data.profile_photo,
      });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customer data';
      setError(message);
      setCustomer(null);
      setUser({ firstName: null, email: null, profilePhoto: null });
    }
  }, [setUser]);

  // Handle cart transition during logout
  const handleCartTransition = useCallback((customerId: string) => {
    try {
      const currentCart = localStorage.getItem(`cart_${customerId}`);
      if (currentCart) {
        localStorage.setItem('guest_cart', currentCart);
        localStorage.removeItem(`cart_${customerId}`);
      }
    } catch (error) {
      console.error('Error handling cart transition during logout:', error);
    }
  }, []);

  // Clear user session
  const clearUserSession = useCallback(() => {
    setUser({ firstName: null, email: null, profilePhoto: null });
    setIsLogin(false);
  }, [setUser, setIsLogin]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!customer?.id) {
        await fetchCustomerData(); // Fetch customer data if not already available
        if (!customer?.id) {
          throw new Error('Customer ID not found. Please log in again.');
        }
      }

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/logout`, {
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

      handleCartTransition(customer.id);
      clearUserSession();
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during logout';
      setError(message);
      clearUserSession();
      router.push('/login'); // Redirect to login on error
    } finally {
      setLoading(false);
    }
  }, [customer, fetchCustomerData, handleCartTransition, clearUserSession, router]);

  return {
    logout,
    loading,
    error,
    customer,
    fetchCustomerData,
  };
};