'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import {NEXT_PUBLIC_API_URL} from "@/constants/constants" 
import { TokenEncryption } from '../utils/encryption';

interface StoreLoginResponse {
  customer: any;
  token: string;
  username: string;
  email: string;
  vendor_id: string;
  profile_photo: string;
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
export const useCustomerLogin = () => {
  const router = useRouter();
  const { setUser, setIsLogin } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const login = async (email: string, password: string, vendorId: any) => {
    setLoading(true);
    setError(null);

    try { 
      const localUrl = "http://localhost:5000/api/customer/login" 
      //`${url}/api/customer/login`
      const url = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, vendorId }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 

        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid email or password');
        }
        throw new Error(errorData.message || 'Failed to authenticate customer');
      }

      const data: StoreLoginResponse = await response.json();
      
      if (data.token) { 
        const encryptedToken = await TokenEncryption.encrypt(data.token);
        const decryptedToken = await TokenEncryption.decrypt(encryptedToken); 

         
        setUser(data.customer.first_name, data.customer.email, data.customer.profile_photo, decryptedToken); 
        sessionStorage.setItem('customerId', data.customer.id)
        sessionStorage.setItem('customerEmail', data.customer.email);
        
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin);
          localStorage.removeItem('redirectAfterLogin');
        } else {
          router.push('dashboard');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return { login,  loading, error };
};
