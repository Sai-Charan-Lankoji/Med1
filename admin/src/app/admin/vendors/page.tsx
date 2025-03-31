"use client"; // Make it a client component

import { useEffect, useState } from "react";
import { NEXT_URL } from "@/app/constants";
import VendorsWithSearch from "@/app/components/VendorsWithSearch";
import SuspenseWithFade from "@/app/components/SuspenseWithFade";
import Loading from "@/app/components/Loading";

type Vendor = {
  id: string;
  company_name: string;
  contact_name: string;
  registered_number: string;
  status: string;
  contact_email: string;
  contact_phone_number: string;
  tax_number: string;
  plan: string;
  plan_id: string;
  next_billing_date: string;
  business_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    vendor_address_id: string;
  }[];
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    async function fetchVendors() {
      try {
        const response = await fetch(`${NEXT_URL}/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }

        const data = await response.json();
        setVendors(data.vendors || []);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <SuspenseWithFade fallback={<Loading />}>
        <Loading />
      </SuspenseWithFade>
    );
  }

  return (
    <SuspenseWithFade fallback={<Loading />}>
      <VendorsWithSearch initialVendors={vendors} initialError={error} />
    </SuspenseWithFade>
  );
}