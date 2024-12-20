import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  admin_id: string | null;
  setAuthEmail: (email: string | null) => void;
  setFirstName: (first_name: string | null) => void;
  setLastName: (last_name: string | null) => void;
  setRole: (role: string | null) => void;
  setAdminId: (admin_id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setAuthEmail] = useState<string | null>(null);
  const [first_name, setFirstName] = useState<string | null>(null);
  const [last_name, setLastName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [admin_id, setAdminId] = useState<string | null>(null);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthEmail(localStorage.getItem('email'));
      setFirstName(localStorage.getItem('first_name'));
      setLastName(localStorage.getItem('last_name'));
      setRole(localStorage.getItem('role'));
      setAdminId(localStorage.getItem('admin_id'));
    }
  }, []);

  // Persist data to localStorage on update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (email) localStorage.setItem('email', email);
      if (first_name) localStorage.setItem('first_name', first_name);
      if (last_name) localStorage.setItem('last_name', last_name);
      if (role) localStorage.setItem('role', role);
      if (admin_id) localStorage.setItem('admin_id', admin_id);
    }
  }, [email, first_name, last_name, role, admin_id]);

  const contextValue: AuthContextType = {
    email,
    first_name,
    last_name,
    role,
    admin_id,
    setAuthEmail,
    setFirstName,
    setLastName,
    setRole,
    setAdminId,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
