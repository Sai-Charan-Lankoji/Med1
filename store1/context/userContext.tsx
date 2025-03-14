'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NEXT_PUBLIC_API_URL } from '@/constants/constants';

interface UserContextType {
  firstName: string | null;
  email: string | null;
  profilePhoto: string | null;
  isLogin: boolean;
  setUser: (userData: { firstName: string | null; email: string | null; profilePhoto: string | null }) => void;
  setIsLogin: (status: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const storedFirstName = sessionStorage.getItem('firstName');
    const storedEmail = sessionStorage.getItem('email');
    const storedProfilePhoto = sessionStorage.getItem('profilePhoto');

    if (storedFirstName && storedEmail) {
      setFirstName(storedFirstName);
      setEmail(storedEmail);
      setProfilePhoto(storedProfilePhoto || null);
      setIsLogin(true); // If user data exists, assume logged in
    }

    const removeCustomerId = () => {
      localStorage.removeItem('customerId');
    };

    window.addEventListener('beforeunload', removeCustomerId);

    return () => {
      window.removeEventListener('beforeunload', removeCustomerId);
    };
  }, []);

  const setUser = (userData: { firstName: string | null; email: string | null; profilePhoto: string | null }) => {
    const { firstName, email, profilePhoto } = userData;

    setFirstName(firstName);
    setEmail(email);
    setProfilePhoto(profilePhoto || null);

    if (firstName && email) {
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('email', email);
      if (profilePhoto) {
        sessionStorage.setItem('profilePhoto', profilePhoto);
      } else {
        sessionStorage.removeItem('profilePhoto');
      }
    } else {
      sessionStorage.removeItem('firstName');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('profilePhoto');
    }
  };

  const logout = async () => {
    try {
      // Call the backend logout endpoint
      const url = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/customer/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth_token
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      // Clear context and sessionStorage
      setUser({ firstName: null, email: null, profilePhoto: null });
      setIsLogin(false);
      sessionStorage.removeItem('customerId');
      sessionStorage.removeItem('customerEmail');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ firstName, email, profilePhoto, isLogin, setUser, setIsLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};