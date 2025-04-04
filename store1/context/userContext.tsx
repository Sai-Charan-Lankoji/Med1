"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";
import { useRouter } from "next/navigation";

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

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { first_name, email, profile_photo } = result.data;
          setUser({ firstName: first_name, email, profilePhoto: profile_photo });
          setIsLogin(true);
        } else {
          resetUserState();
        }
      } else {
        resetUserState();
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      resetUserState();
    }
  };

  const resetUserState = () => {
    setUser({ firstName: null, email: null, profilePhoto: null });
    setIsLogin(false);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const setUser = (userData: { firstName: string | null; email: string | null; profilePhoto: string | null }) => {
    const { firstName, email, profilePhoto } = userData;
    setFirstName(firstName);
    setEmail(email);
    setProfilePhoto(profilePhoto);

    if (firstName && email) {
      sessionStorage.setItem("firstName", firstName);
      sessionStorage.setItem("email", email);
      if (profilePhoto) sessionStorage.setItem("profilePhoto", profilePhoto);
      else sessionStorage.removeItem("profilePhoto");
    } else {
      sessionStorage.removeItem("firstName");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("profilePhoto");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser({ firstName: null, email: null, profilePhoto: null });
      setIsLogin(false);
      sessionStorage.removeItem("firstName");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("profilePhoto");
      sessionStorage.removeItem("customerId");
      sessionStorage.removeItem("customerEmail");
      localStorage.removeItem("customerId");
      router.push("/");
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
  if (!context) throw new Error("useUserContext must be used within a UserProvider");
  return context;
};