"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AddressForm({ customerId, customerEmail, onSubmit }) {
  const [address, setAddress] = useState({
    customer_id: customerId || "",
    customer_email: customerEmail || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(address);
      setAddress({
        customer_id: customerId || "",
        customer_email: customerEmail || "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Add Delivery Address
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer ID
          </label>
          <Input
            name="customer_id"
            value={address.customer_id}
            disabled
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            name="customer_email"
            type="email"
            value={address.customer_email}
            disabled
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <Input
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Enter Street Address"
            className="w-full"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Input
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Enter City"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Input
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="Enter State"
              className="w-full"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <Input
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Enter Pincode"
            className="w-full"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </form>
    </div>
  );
}