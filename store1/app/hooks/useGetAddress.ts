"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";
import { Address } from "@/@types/models";
 

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_photo: string | null;
  vendor_id: string;
}

interface UseAddressesReturn {
  customer: Customer | null;
  addresses: Address[];
  isAddingAddress: boolean;
  setIsAddingAddress: (value: boolean) => void;
  newAddress: Partial<Address>;
  setNewAddress: (address: Partial<Address>) => void;
  addressError: string | null;
  customerError: string | null;
  isLoadingCustomer: boolean;
  isLoadingAddresses: boolean;
  fetchAddresses: () => Promise<void>;
  handleAddAddress: () => Promise<void>;
}

const BASE_URL = NEXT_PUBLIC_API_URL;

export const useAddresses = (): UseAddressesReturn => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    street: "",
    city: "",
    state: "",
    pincode: "",
    address_type: null,
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    setIsLoadingCustomer(true);
    try {
      const response = await fetch(`${BASE_URL}/api/customer/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch customer data");
      }

      const { data } = await response.json();
      setCustomer({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        profile_photo: data.profile_photo,
        vendor_id: data.vendor_id,
      });
      setCustomerError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch customer data";
      setCustomer(null);
      setCustomerError(message);
      toast.error(message);
    } finally {
      setIsLoadingCustomer(false);
    }
  }, []);

  // Fetch addresses
  const fetchAddressesData = useCallback(async () => {
    if (!customer?.id) return;

    setIsLoadingAddresses(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/address/customer/${customer.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch addresses");
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setAddresses(result.data);
        setAddressError(null);
      } else {
        throw new Error(result.message || "Invalid response format");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load addresses";
      setAddresses([]);
      setAddressError(message);
      toast.error(message);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [customer?.id]);

  // Add new address
  const handleAddAddress = useCallback(async () => {
    if (!customer?.id || !customer?.email) {
      setAddressError("Customer data not found. Please log in again.");
      toast.error("Customer data not found");
      return;
    }

    const addressData: Partial<Address> = {
      ...newAddress,
      customer_id: customer.id,
      customer_email: customer.email,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/address/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add address");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setAddresses((prev) => [...prev, result.data]);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          pincode: "",
          address_type: null,
        });
        setIsAddingAddress(false);
        setAddressError(null);
        toast.success("Address added successfully");
        await fetchAddressesData(); // Refresh addresses after adding
      } else {
        throw new Error(result.message || "Failed to add address");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add address";
      setAddressError(message);
      toast.error(message);
    }
  }, [customer, newAddress, fetchAddressesData]);

  // Fetch customer data on mount
  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // Fetch addresses once customer data is available
  useEffect(() => {
    if (customer?.id) {
      fetchAddressesData();
    }
  }, [customer?.id, fetchAddressesData]);

  return {
    customer,
    addresses,
    isAddingAddress,
    setIsAddingAddress,
    newAddress,
    setNewAddress,
    addressError,
    customerError,
    isLoadingCustomer,
    isLoadingAddresses,
    fetchAddresses: fetchAddressesData,
    handleAddAddress,
  };
};