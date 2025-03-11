'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  contactName: string | null;
  vendorId: string | null;
  companyName: string | null;
  businessType: string | null;
  plan: string | null;
  setAuthEmail: (email: string) => void;
  setContactName: (contactName: string) => void;
  setCompanyName: (companyName: string) => void;
  setVendorId: (vendorId: string) => void;
  setBusinessType: (businessType: string) => void;
  setPlan: (plan: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setAuthEmail] = useState<string | null>(null);
  const [contactName, setContactName] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>("Vendor Hub");
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  
  useEffect(() => {
    const updateFromSessionStorage = () => {
      const storedEmail = sessionStorage.getItem('email');
      const storedContactName = sessionStorage.getItem('contact_name');
      const storedVendorId = sessionStorage.getItem('vendor_id');
      const storedCompanyName = sessionStorage.getItem('company_name');
      const storedBusinessType = sessionStorage.getItem('business_type');
      const storedPlan = sessionStorage.getItem('plan');

      if (storedEmail) setAuthEmail(storedEmail);
      if (storedContactName) setContactName(storedContactName);
      if (storedVendorId) setVendorId(storedVendorId);
      if (storedCompanyName) setCompanyName(storedCompanyName);
      if (storedBusinessType) setBusinessType(storedBusinessType);
      if (storedPlan) setPlan(storedPlan);
    };

    updateFromSessionStorage();

    window.addEventListener('storage', updateFromSessionStorage);

    return () => {
      window.removeEventListener('storage', updateFromSessionStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      email, 
      contactName, 
      vendorId, 
      companyName, 
      businessType, 
      plan, 
      setAuthEmail, 
      setContactName, 
      setCompanyName, 
      setVendorId, 
      setBusinessType, 
      setPlan 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

