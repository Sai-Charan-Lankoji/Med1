import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface VendorLoginResponse {
  token: string;
  vendor?: {
    id: string;
    contact_email: string;
    contact_name: string;
    business_type: string;
    company_name: string;
    plan: string;
  };
  vendorUser?: {
    email: string;
    first_name: string;
    vendor_id: string;
  }
}

export const useVendorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName, setCompanyName } = useAuth()!;
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
  
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to authenticate vendor');
      }
  
      const loginData: VendorLoginResponse = data;
      if (loginData.token) {
        if (loginData.vendor) {
          sessionStorage.setItem('vendor_id', loginData.vendor.id); 
          sessionStorage.setItem('business_type', loginData.vendor.business_type);
          sessionStorage.setItem('company_name', loginData.vendor.company_name);
          sessionStorage.setItem('plan', loginData.vendor.plan);
          sessionStorage.setItem('email', loginData.vendor.contact_email);
          sessionStorage.setItem('contactName', loginData.vendor.contact_name);
      
          setAuthEmail(loginData.vendor.contact_email);
          setContactName(loginData.vendor.contact_name);
          setCompanyName(loginData.vendor.company_name);
        } 
        else if (loginData.vendorUser) {
          sessionStorage.setItem('vendor_id', loginData.vendorUser.vendor_id);
          sessionStorage.setItem('contactName', loginData.vendorUser.first_name);
          sessionStorage.setItem('email', loginData.vendorUser.email);
          setAuthEmail(loginData.vendorUser.email);
          setContactName(loginData.vendorUser.first_name);
        }
      }
    } catch (err: any) {
      console.error('Error during login:', err); 
      setError(err.message);
      throw err; // Re-throw the error to be caught in the component
    } finally {
      setLoading(false);
    }
  };
  
  return { login, loading, error };
};

