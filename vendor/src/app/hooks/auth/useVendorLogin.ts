'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react'; 
import { TokenEncryption } from '@/app/utils/encryption';

interface VendorLoginResponse {
  token: string | null;
  vendor?: {
    id: string;
    business_type: string;
    company_name: string;
    plan: string;
    contact_email: string;
    contact_name: string;
    plan_id: string;
  };
  vendorUser?: {
    vendor_id: string;
    first_name: string;
    email: string;
  };
}

const useVendorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName, setCompanyName, setVendorId, setBusinessType, setPlan } = useAuth();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try { 
      const localUrl = "http://localhost:5000/api/vendor/login"
      const url = 'https://med1-wyou.onrender.com';
      //`${url}/api/vendor/login`,
      const response = await fetch( `${url}/api/vendor/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (response.status === 404) {
          throw new Error('User not found');
        } else if (response.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else {
          throw new Error('An error occurred during login. Please try again.');
        }
      }

      const data: VendorLoginResponse = await response.json();
      if (data.token) {  
        const encryptedToken = await TokenEncryption.encrypt(data.token);
          const decryptedToken = await TokenEncryption.decrypt(encryptedToken);
         sessionStorage.setItem('auth_token',decryptedToken);
        if (data.vendor) {
          sessionStorage.setItem('vendor_id', data.vendor.id);
          sessionStorage.setItem('business_type', data.vendor.business_type);
          sessionStorage.setItem('company_name', data.vendor.company_name);
          sessionStorage.setItem('plan', data.vendor.plan);
          sessionStorage.setItem('email', data.vendor.contact_email);
          sessionStorage.setItem('contact_name', data.vendor.contact_name);
          sessionStorage.setItem("plan_id", data.vendor.plan_id);
  
          setAuthEmail(data.vendor.contact_email);
          setContactName(data.vendor.contact_name);
          setCompanyName(data.vendor.company_name);
          setVendorId(data.vendor.id);
          setBusinessType(data.vendor.business_type);
          setPlan(data.vendor.plan);
        } else if (data.vendorUser) {
          sessionStorage.setItem('vendor_id', data.vendorUser.vendor_id);
          sessionStorage.setItem('contact_name', data.vendorUser.first_name);
          sessionStorage.setItem('email', data.vendorUser.email);
          
          setAuthEmail(data.vendorUser.email);
          setContactName(data.vendorUser.first_name);
          setVendorId(data.vendorUser.vendor_id);
        } else {
          throw new Error('Invalid response from server');
        }
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      setError(err.message || 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useVendorLogin;

