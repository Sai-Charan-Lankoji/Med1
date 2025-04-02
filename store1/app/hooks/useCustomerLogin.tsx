"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

export const useCustomerLogin = () => {
  const router = useRouter();
  const { setUser, setIsLogin } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login request
      const url = NEXT_PUBLIC_API_URL;
      const loginResponse = await fetch(`${url}/api/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        if (loginResponse.status === 401) {
          throw new Error("Unauthorized: Invalid email or password");
        }
        throw new Error(errorData.error || "Failed to authenticate customer");
      }

      const data = await loginResponse.json();
      console.log("Login Response:", data);

      // Step 2: Fetch user details after login
      const meResponse = await fetch(`${url}/api/customer/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!meResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const customer = await meResponse.json();
      console.log("Customer Details:", customer);

      // Update UserContext with object-based setUser
      setUser({
        firstName: customer.first_name || "",
        email: customer.email || "",
        profilePhoto: customer.profile_photo || "",
      });
      setIsLogin(true);

      // Keep customer-specific sessionStorage
      sessionStorage.setItem("customerId", customer.id || "");
      sessionStorage.setItem("customerEmail", customer.email || "");

      // Redirect logic
      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
        localStorage.removeItem("redirectAfterLogin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
