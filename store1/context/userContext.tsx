'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NEXT_PUBLIC_API_URL } from '@/constants/constants';
import { useRouter } from 'next/navigation';

interface UserContextType {
  firstName: string | null;
  email: string | null;
  profilePhoto: string | null;
  isLogin: boolean;
  setUser: (userData: { firstName: string | null; email: string | null; profilePhoto: string | null }) => void;
  setIsLogin: (status: boolean) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();

  // Fetch user details on mount to check if already logged in
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}` 

        }      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { first_name, email, profile_photo } = result.data;
          setUser({ firstName: first_name, email, profilePhoto: profile_photo });
          setIsLogin(true);
        } else {
          setUser({ firstName: null, email: null, profilePhoto: null });
          setIsLogin(false);
        }
      } else {
        setUser({ firstName: null, email: null, profilePhoto: null });
        setIsLogin(false);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser({ firstName: null, email: null, profilePhoto: null });
      setIsLogin(false);
    }
  };

  useEffect(() => {
    // Fetch user details on mount
    fetchUserDetails();

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
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth_token
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Logout failed:', errorData);
        throw new Error(errorData.message || 'Failed to logout');
      }

      // Clear context and sessionStorage
      setUser({ firstName: null, email: null, profilePhoto: null });
      setIsLogin(false);
      sessionStorage.removeItem('customerId');
      sessionStorage.removeItem('customerEmail');
      router.push("/"); // Redirect to homepage
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear state even if logout request fails
      setUser({ firstName: null, email: null, profilePhoto: null });
      setIsLogin(false);
      sessionStorage.removeItem('customerId');
      sessionStorage.removeItem('customerEmail');
      router.push("/"); // Redirect to homepage
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