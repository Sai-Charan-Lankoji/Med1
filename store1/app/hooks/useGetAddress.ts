import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

interface Address {
  id: string;
  customer_id: string;
  customer_email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  address_type: "billing" | "shipping" | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  metadata: Record<string, any> | null;
}

interface UseAddressesReturn {
  addresses: Address[];
  selectedAddressId: string | undefined; // Changed from string | null
  setSelectedAddressId: (id: string | undefined) => void; // Changed from string | null
  isAddingAddress: boolean;
  setIsAddingAddress: (value: boolean) => void;
  newAddress: Partial<Address>;
  setNewAddress: (address: Partial<Address>) => void;
  addressError: string | null;
  fetchAddresses: () => Promise<void>;
  handleAddAddress: (e: React.FormEvent) => Promise<void>;
}

const BASE_URL = "http://localhost:5000";

export const useAddresses = (customerId: string | null): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined); // Changed from null to undefined
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    street: "",
    city: "",
    state: "",
    pincode: "",
    address_type: null,
  });
  const [addressError, setAddressError] = useState<string | null>(null);

  const fetchAddressesData = useCallback(async () => {
    if (!customerId) return;

    try {
      const response = await fetch(`${BASE_URL}/api/address/customer/${customerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch addresses");
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setAddresses(result.data);
        if (result.data.length > 0 && selectedAddressId === undefined) { // Changed from !selectedAddressId
          setSelectedAddressId(result.data[0].id);
        }
      } else {
        throw new Error(result.message || "Invalid response format");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load addresses";
      setAddresses([]);
      setAddressError(message);
      toast.error(message);
    }
  }, [customerId, selectedAddressId]);

  const handleAddAddress = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!customerId) {
        setAddressError("Customer ID not found. Please log in again.");
        toast.error("Customer ID not found");
        return;
      }

      const customerEmail = sessionStorage.getItem("customerEmail");
      if (!customerEmail) {
        setAddressError("Customer Email not found. Please log in again.");
        toast.error("Customer Email not found");
        return;
      }

      const addressData: Partial<Address> = {
        ...newAddress,
        customer_id: customerId,
        customer_email: customerEmail,
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
          setNewAddress({ street: "", city: "", state: "", pincode: "", address_type: null });
          setIsAddingAddress(false);
          setAddressError(null);
          toast.success("Address added successfully");
          await fetchAddressesData();
        } else {
          throw new Error(result.message || "Failed to add address");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to add address";
        setAddressError(message);
        toast.error(message);
      }
    },
    [customerId, newAddress, fetchAddressesData]
  );

  useEffect(() => {
    fetchAddressesData();
  }, [fetchAddressesData]);

  return {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingAddress,
    setIsAddingAddress,
    newAddress,
    setNewAddress,
    addressError,
    fetchAddresses: fetchAddressesData,
    handleAddAddress,
  };
};