// context/UserContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  email: string | null;
  customerToken: string | null; // New state for customer token
  setUser: (username: string | null, email: string | null, token?: string | null) => void; // Update setUser signature
  logout: () => void;  
  isLogin: boolean; 
  setIsLogin: (status: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); 
  const [customerToken, setCustomerToken] = useState<string | null>(null); // State for token
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedEmail = sessionStorage.getItem('email');
    const storedToken = localStorage.getItem('customerToken'); // Load token from local storage

    if (storedUsername && storedEmail) {
      setUsername(storedUsername);
      setEmail(storedEmail);
    }

    if (storedToken) {
      setCustomerToken(storedToken); // Set token if exists
      setIsLogin(true); // User is logged in
    }

    const removeCustomerId = () => {
      localStorage.removeItem('customerId');
    };

    window.addEventListener('beforeunload', removeCustomerId);

    return () => {
      window.removeEventListener('beforeunload', removeCustomerId);
    };
  }, []);

  const setUser = (username: string | null, email: string | null, token?: string | null) => {
    setUsername(username);
    setEmail(email);
    if (token) {
      setCustomerToken(token); // Set the token
      localStorage.setItem('customerToken', token); // Store token in local storage
    } else {
      setCustomerToken(null); // Clear token on logout
      localStorage.removeItem('customerToken'); // Remove token from local storage
    }

    // Store user data in sessionStorage
    if (username && email) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('email', email);
    } else {
      // Clear user data if logging out
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('email');
    }
  };

  const logout = () => {
    setUser(null, null); 
  };

  return (
    <UserContext.Provider value={{ username, email, customerToken, setUser, logout, isLogin, setIsLogin}}>
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
