// app/admin/vendors/[vendorId]/page.tsx
import { cookies } from "next/headers";
import VendorDetails from "@/app/components/VendorDetails";
import SuspenseWithFade from "@/app/components/SuspenseWithFade";
import Loading from "@/app/components/Loading";
import {NEXT_URL} from "@/app/constants";

type Store = {
  id: string;
  name: string;
  default_currency_code: string;
  swap_link_template: string;
  payment_link_template: string;
  invite_link_template: string;
  store_type: string;
  publishableapikey: string;
  store_url: string;
  vendor_id: string;
  default_sales_channel_id: string;
  default_location_id: string | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchVendorStores(vendorId: string): Promise<{ stores: Store[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  console.log("Fetching stores for vendorId:", vendorId);
  console.log("Cookies sent:", cookieHeader);

  try {
    const response = await fetch(`${NEXT_URL}/api/stores/vendor?vendor_id=${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      return { stores: [], error: errorData.error || "Failed to fetch vendor stores" };
    }

    const data = await response.json();
    return { stores: data, error: null };
  } catch (err) {
    console.error("Fetch error:", err);
    return { stores: [], error: (err as Error).message };
  }
}

export default async function VendorDetailsPage({ params }: { params: { vendorId: string } }) {
  const { stores, error } = await fetchVendorStores(params.vendorId);

  return (
    <SuspenseWithFade fallback={<Loading />}>
      <VendorDetails stores={stores} error={error} vendorId={params.vendorId} />
    </SuspenseWithFade>
  );
}