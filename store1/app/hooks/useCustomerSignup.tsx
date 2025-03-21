"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";
import { TokenEncryption } from "../utils/encryption";

interface StoreSignupResponse {
  token: string;
  vendor_id: string;
  customer: any;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  color: any;
  thumbnail: any;
  quantity: number;
  side: string;
}

export const useCustomerSignup = () => {
  const { setUser, setIsLogin } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const signup = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone: string,
    has_account: boolean,
    vendor_id: string | null
  ) => {
    setLoading(true);
    setError(null);

    try { 
      const localUrl = "http://localhost:5000/api/customer/signup" 
      //`${url}/api/customer/signup`
      const url = NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/customer/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          phone,
          has_account,
          vendor_id,
        }),
      });

      if (!response.ok) {
        console.log(`Response not OK: ${response.status}`);
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid email or password");
        }
        throw new Error("Failed to authenticate customer");
      }

      const data: StoreSignupResponse = await response.json();

      if (data.token) { 
        const encryptedToken = await TokenEncryption.encrypt(data.token);
        const decryptedToken = await TokenEncryption.decrypt(encryptedToken);

        sessionStorage.setItem("customerId", data.customer.id);
        sessionStorage.setItem("customerEmail", data.customer.email);

        setUser({ firstName: first_name, email: email, profilePhoto: null });

       

        const redirectAfterSignup = localStorage.getItem("redirectAfterSignup");
        if (redirectAfterSignup) {
          router.push(redirectAfterSignup);
          localStorage.removeItem("redirectAfterSignup");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during Signup:", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
