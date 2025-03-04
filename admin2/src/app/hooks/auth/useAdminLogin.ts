"use client";
import { useState, useEffect } from "react"; // Add useEffect
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { NEXT_URL } from "@/constants";
import { TokenEncryption } from "@/app/utils/encryption";
import useSWR, { mutate } from "swr";

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch auth state");
  return res.json();
};

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Track client-side
  const { setAuthEmail, setFirstName, setLastName, setRole, setAdminId } = useAuth();
  const router = useRouter();

  // Set isClient to true only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use SWR only on the client
  const { data: authData, error: authError } = useSWR(
    isClient && localStorage.getItem("auth_token") ? `${NEXT_URL}/api/auth/me` : null,
    (url) => fetcher(url, localStorage.getItem("auth_token") || ""),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${NEXT_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid email or password");
        }
        throw new Error("Failed to authenticate admin");
      }

      const data = await response.json();
      const { first_name, last_name, role, id: adminId } = data.user;

      const encryptedToken = await TokenEncryption.encrypt(data.token);
      const decryptedToken = await TokenEncryption.decrypt(encryptedToken);

      // Only access localStorage on the client
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", decryptedToken);
        localStorage.setItem("email", email);
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("role", role);
        localStorage.setItem("admin_id", adminId);
      }

      setAuthEmail(email);
      setFirstName(first_name);
      setLastName(last_name);
      setRole(role);
      setAdminId(adminId);

      mutate(`${NEXT_URL}/api/auth/me`);
      router.push("/admin/vendors");
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, authData, authError };
};