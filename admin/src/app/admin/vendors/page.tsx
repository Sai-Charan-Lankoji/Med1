// app/admin/vendors/page.tsx
import { cookies } from "next/headers";
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

async function fetchVendors(): Promise<{ vendors: Vendor[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${NEXT_URL}/api/vendors`, {
      headers: { cookie: cookieHeader || "" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vendors");
    }

    const data = await response.json();
    return { vendors: data.vendors, error: null };
  } catch (err) {
    return { vendors: [], error: (err as Error).message };
  }
}

export default async function VendorsPage() {
  const { vendors, error } = await fetchVendors();

  return (
    <SuspenseWithFade fallback={<Loading />}>
      <VendorsWithSearch initialVendors={vendors} initialError={error} />
    </SuspenseWithFade>
  );
}