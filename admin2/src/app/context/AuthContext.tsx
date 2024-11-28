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
  const [email, setAuthEmail] = useState<string | null>(() => sessionStorage.getItem('email'));
  const [first_name, setFirstName] = useState<string | null>(() => sessionStorage.getItem('first_name'));
  const [last_name, setLastName] = useState<string | null>(() => sessionStorage.getItem('last_name'));
  const [role, setRole] = useState<string | null>(() => sessionStorage.getItem('role'));
  const [admin_id, setAdminId] = useState<string | null>(() => sessionStorage.getItem('admin_id'));

  // Persist auth data to sessionStorage
  useEffect(() => {
    if (email) sessionStorage.setItem('email', email);
    if (first_name) sessionStorage.setItem('first_name', first_name);
    if (last_name) sessionStorage.setItem('last_name', last_name);
    if (role) sessionStorage.setItem('role', role);
    if (admin_id) sessionStorage.setItem('admin_id', admin_id);
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

  return (
    <AuthContext.Provider value={contextValue}>
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

