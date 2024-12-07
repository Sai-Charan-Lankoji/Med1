import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  contactName: string | null;
  vendorId: string | null;
  companyName: string | null;
  setAuthEmail: (email: string) => void;
  setContactName: (contactName: string) => void;
  setCompanyName: (companyName: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setAuthEmail] = useState<string | null>(null);
  const [contactName, setContactName] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>("Vendor Hub");
  
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    const storedContactName = sessionStorage.getItem('contactName');
    const storedVendorId = sessionStorage.getItem('vendor_id');
    const storedCompanyName = sessionStorage.getItem('company_name');

    if (storedEmail) setAuthEmail(storedEmail);
    if (storedContactName) setContactName(storedContactName);
    if (storedVendorId) setVendorId(storedVendorId);
    if (storedCompanyName) setCompanyName(storedCompanyName);
  }, []);

  return (
    <AuthContext.Provider value={{ email, contactName, vendorId, companyName, setAuthEmail, setContactName, setCompanyName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};