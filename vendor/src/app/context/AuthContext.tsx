import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  contactName: string | null;
  vendorId: string | null;
  setAuthEmail: (email: string) => void;
  setContactName: (contactName: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setAuthEmail] = useState<string | null>(null);
  const [contactName, setContactName] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);

  // Persist email, contact name, and vendor ID in session storage
  useEffect(() => {
    if (email) sessionStorage.setItem('email', email);
    if (contactName) sessionStorage.setItem('contactName', contactName);
    if (vendorId) sessionStorage.setItem('vendor_id', vendorId);
  }, [email, contactName, vendorId]);

  // Restore session data on reload
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    const storedContactName = sessionStorage.getItem('contactName');
    const storedVendorId = sessionStorage.getItem('vendor_id');

    if (storedEmail) setAuthEmail(storedEmail);
    if (storedContactName) setContactName(storedContactName);
    if (storedVendorId) setVendorId(storedVendorId);
  }, []);

  return (
    <AuthContext.Provider value={{ email, contactName, vendorId, setAuthEmail, setContactName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
