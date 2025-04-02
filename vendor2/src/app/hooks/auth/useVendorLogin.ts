"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { Next_server } from "@/constant";

interface VendorLoginResponse {
  error: any;
  message: string;
  data?: {
    vendor?: {
      id: string;
      business_type: string;
      company_name: string;
      plan: string;
      contact_email: string;
      contact_name: string;
      plan_id: string;
    };
    vendorUser?: {
      vendor_id: string;
      first_name: string;
      email: string;
    };
  };
}

const useVendorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthEmail, setContactName, setCompanyName, setVendorId, setBusinessType, setPlan } = useAuth();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return false;
    }

    try {
      const url = Next_server;
      const response = await fetch(`${url}/api/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Send and receive cookies
      });

      const result: VendorLoginResponse = await response.json();

      if (!response.ok) {
        const errorMessage = result.error?.details || result.message || "Failed to login";
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        } else if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        } else {
          throw new Error(errorMessage);
        }
      }

      // Fetch vendor details after successful login
      const vendorData = await fetchVendorDetails();
      updateAuthState(vendorData);

      return true;
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.message || "An unknown error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async () => {
    const response = await fetch(`${Next_server}/api/vendor/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send auth_token cookie
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.details || result.message || "Failed to fetch vendor details");
    }
    return result.data;
  };

  const updateAuthState = (vendorData: any) => {
    if (vendorData.vendor) {
      sessionStorage.setItem("vendor_id", vendorData.vendor.id);
      sessionStorage.setItem("business_type", vendorData.vendor.business_type);
      sessionStorage.setItem("company_name", vendorData.vendor.company_name);
      sessionStorage.setItem("plan", vendorData.vendor.plan);
      sessionStorage.setItem("email", vendorData.vendor.contact_email);
      sessionStorage.setItem("contact_name", vendorData.vendor.contact_name);
      sessionStorage.setItem("plan_id", vendorData.vendor.plan_id);

      setAuthEmail(vendorData.vendor.contact_email);
      setContactName(vendorData.vendor.contact_name);
      setCompanyName(vendorData.vendor.company_name);
      setVendorId(vendorData.vendor.id);
      setBusinessType(vendorData.vendor.business_type);
      setPlan(vendorData.vendor.plan);
    } else if (vendorData.vendorUser) {
      sessionStorage.setItem("vendor_id", vendorData.vendorUser.vendor_id);
      sessionStorage.setItem("contact_name", vendorData.vendorUser.first_name);
      sessionStorage.setItem("email", vendorData.vendorUser.email);

      setAuthEmail(vendorData.vendorUser.email);
      setContactName(vendorData.vendorUser.first_name);
      setVendorId(vendorData.vendorUser.vendor_id);
    }
  };

  return { login, loading, error };
};

export default useVendorLogin;