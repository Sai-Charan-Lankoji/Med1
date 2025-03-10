// app/admin/plans/page.tsx
import { cookies } from "next/headers";
import { NEXT_URL } from "@/app/constants";
import PlansWithSearch from "@/app/components/PlansWithSearch";
import SuspenseWithFade from "@/app/components/SuspenseWithFade";
import Loading from "@/app/components/Loading";

type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  discount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  description?: string;
  no_stores: string;
  commission_rate: number;
};

async function fetchPlans(): Promise<{ plans: Plan[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    const response = await fetch(`${NEXT_URL}/api/plan`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader || "" },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch plans: ${response.status}`);
    }
    const data = await response.json();
    return { plans: data.length ? data : [], error: null };
  } catch (err) {
    console.error("Fetch plans error:", err);
    return { plans: [], error: (err as Error).message };
  }
}

export default async function PlansPage() {
  const { plans, error } = await fetchPlans();
  return (
    <SuspenseWithFade fallback={<Loading />}>
      <PlansWithSearch initialPlans={plans} initialError={error} />
    </SuspenseWithFade>
  );
}