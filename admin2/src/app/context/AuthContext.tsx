// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  adminId: string | null;
  setAuthEmail: (email: string | null) => void;
  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setRole: (role: string | null) => void;
  setAdminId: (adminId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth?: {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    id: string;
  } | null;
}) {
  const [email, setAuthEmail] = useState<string | null>(initialAuth?.email || null);
  const [firstName, setFirstName] = useState<string | null>(initialAuth?.first_name || null);
  const [lastName, setLastName] = useState<string | null>(initialAuth?.last_name || null);
  const [role, setRole] = useState<string | null>(initialAuth?.role || null);
  const [adminId, setAdminId] = useState<string | null>(initialAuth?.id || null);

  const contextValue: AuthContextType = {
    email,
    firstName,
    lastName,
    role,
    adminId,
    setAuthEmail,
    setFirstName,
    setLastName,
    setRole,
    setAdminId,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};