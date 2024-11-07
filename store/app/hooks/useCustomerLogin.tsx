'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
//import { useCart } from '@/context/cartContext'; // Import the cart context

interface StoreLoginResponse {
  customer: any;
  token: string;
  username: string;
  email: string;
  vendor_id: string;
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
// useCustomerLogin.ts
export const useCustomerLogin = () => {
  const router = useRouter();
  const { setUser, setIsLogin } = useUserContext();
 // const { mergeLocalCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleCartTransition = (customerId: string) => {
  //   const guestCart = localStorage.getItem('guest_cart');
  //   if (guestCart) {
  //     try {
  //       const guestCartItems: CartItem[] = JSON.parse(guestCart);
  //       const existingUserCart = localStorage.getItem(`cart_${customerId}`);
  //       const userCartItems: CartItem[] = existingUserCart ? JSON.parse(existingUserCart) : [];
  //       const mergedCart = [...userCartItems];
        
  //       guestCartItems.forEach((guestItem) => {
  //         const existingItem = mergedCart.find(item => item.id === guestItem.id);
  //         if (existingItem) {
  //           existingItem.quantity += guestItem.quantity;
  //         } else {
  //           mergedCart.push(guestItem);
  //         }
  //       });

  //       localStorage.setItem(`cart_${customerId}`, JSON.stringify(mergedCart));
  //       localStorage.removeItem('guest_cart');
  //       mergeLocalCart();
  //     } catch (error) {
  //       console.error('Error merging carts:', error);
  //     }
  //   }
  // };

  const login = async (email: string, password: string, vendorId: any) => {
    setLoading(true);
    setError(null);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
      const response = await fetch(`${url}/store/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, vendorId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error Response Data:`, errorData);
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid email or password');
        }
        throw new Error(errorData.message || 'Failed to authenticate customer');
      }

      const data: StoreLoginResponse = await response.json();
      
      if (data.token) {
        console.log('Login successful', data);
        
        // Store authentication data in context
        setUser(data.customer.first_name, data.customer.email, data.token); // Pass the token here
        sessionStorage.setItem('customerId', data.customer.id)
        sessionStorage.setItem('customerEmail', data.customer.email);
        //handleCartTransition(data.customer.id);
        
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin);
          localStorage.removeItem('redirectAfterLogin');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ... (logout function remains the same)

  return { login,  loading, error };
};
