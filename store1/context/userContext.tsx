
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  email: string | null;
  customerToken: string | null;
  profile: string | null;
  setUser: (username: string | null, email: string | null, profile_photo: string | null, token?: string | null) => void; 
  logout: () => void;  
  isLogin: boolean; 
  setIsLogin: (status: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); 
  const [customerToken, setCustomerToken] = useState<string | null>(null); 
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [ profile, setProfilePhoto] = useState<string | null>(null);
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedEmail = sessionStorage.getItem('email');
    const storedToken = sessionStorage.getItem('auth_token');

    if (storedUsername && storedEmail) {
      setUsername(storedUsername);
      setEmail(storedEmail);
    }

    if (storedToken) {
      setCustomerToken(storedToken); 
      setIsLogin(true); 
    }

    const removeCustomerId = () => {
      localStorage.removeItem('customerId');
    };

    window.addEventListener('beforeunload', removeCustomerId);

    return () => {
      window.removeEventListener('beforeunload', removeCustomerId);
    };
  }, []);

  const setUser = (username: string | null, email: string | null, profile_photo?: string | null, token?: string | null) => {
    setUsername(username);
    setEmail(email);
    if (token) {
      setCustomerToken(token); 
      sessionStorage.setItem('auth_token', token);
    } else {
      setCustomerToken(null); 
      sessionStorage.removeItem('auth_token'); 
    }

    if (profile_photo) {
      sessionStorage.setItem('profile', profile_photo)
      setProfilePhoto(profile_photo); 
    } else {
      setProfilePhoto(null); 
    }

    if (username && email) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('email', email);
    } else {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('email');
    }
  };

  const logout = () => {
    setUser(null, null); 
  };

  return (
    <UserContext.Provider value={{ username, email, customerToken, profile, setUser, logout, isLogin, setIsLogin }}>
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


