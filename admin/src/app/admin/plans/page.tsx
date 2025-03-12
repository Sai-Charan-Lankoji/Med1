// app/admin/plans/page.tsx
import { cookies } from "next/headers";
import { NEXT_URL } from "@/app/constants";
import PlansWithSearch from "@/app/components/PlansWithSearch";
import SuspenseWithFade from "@/app/components/SuspenseWithFade";
import Loading from "@/app/components/Loading";
import { Plan } from "@/app/api/plan/route";

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
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return (
    <SuspenseWithFade fallback={<Loading />}>
      <PlansWithSearch 
        initialPlans={plans} 
        initialError={error}
        cookieHeader={cookieHeader}
      />
    </SuspenseWithFade>
  );
}