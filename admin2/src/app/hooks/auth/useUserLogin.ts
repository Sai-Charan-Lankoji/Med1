import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/context/AuthContext';

export const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName } = useAuth()!;
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${url}/vendor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the user's session token or other relevant data
        sessionStorage.setItem("user_token", data.token);
        sessionStorage.setItem('vendor_id',data.user.vendor_id)
        setAuthEmail(data.user.email);
        setContactName(data.user.first_name);
        router.push("/vendor/orders");
      }  
    } catch (err: any) {
      console.error('Error during login:', err); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};