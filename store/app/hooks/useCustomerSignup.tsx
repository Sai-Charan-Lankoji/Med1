'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
//import { useCart } from '@/context/cartContext';

interface StoreSignupResponse {
  token: string;
  vendor_id: string;
  customer: any;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  color: any;
  thumbnail: any;
  quantity: number;
  side: string;
}

export const useCustomerSignup = () => {
  const { setUser, setIsLogin } = useUserContext();
  //const { mergeLocalCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleCartTransition = (customerId: string) => {
  //   const guestCart = localStorage.getItem('guest_cart');
  //   if (guestCart) {
  //     try {
  //       const guestCartItems: CartItem[] = JSON.parse(guestCart);
  //       localStorage.setItem(`cart_${customerId}`, JSON.stringify(guestCartItems));
  //       localStorage.removeItem('guest_cart');
  //       mergeLocalCart();
  //     } catch (error) {
  //       console.error('Error transferring cart:', error);
  //     }
  //   }
  // };

  const signup = async (email: string, password: string, first_name: string, last_name: string, phone: string, has_account: boolean, vendor_id: string | null) => {
    setLoading(true);
    setError(null);
  
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/store/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, first_name, last_name, phone, has_account, vendor_id }),
      });
  
      if (!response.ok) {
        console.log(`Response not OK: ${response.status}`);
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid email or password');
        }
        throw new Error('Failed to authenticate customer');
      }
  
      const data: StoreSignupResponse = await response.json();
      
      if (data.token) {
        console.log('Signup successful:', JSON.stringify(data, null, 2)); 
        console.log( "signup Data : ",data)
        sessionStorage.setItem('customerId', data.customer.id) 
        sessionStorage.setItem('customerEmail', data.customer.email);

        
        // Store authentication data in context
        setUser(first_name, email, data.token); // Pass the token here
        
        // Handle cart transition
        //handleCartTransition(data.customer.id);
        
        // Handle redirect
        const redirectAfterSignup = localStorage.getItem('redirectAfterSignup');
        if (redirectAfterSignup) {
          router.push(redirectAfterSignup);
          localStorage.removeItem('redirectAfterSignup');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error during Signup:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  return { signup, loading, error };
};