// useUpdateVendorPlan.js
import { vendor_id } from "@/app/utils/constant";
import { Next_server } from "@/constant";
import { useSWRConfig } from "swr";

interface UpdatePlanData {
  plan_id: string;
  plan: string;
}

const updateVendorPlan = async (vendorId: string, updateData: UpdatePlanData) => {
  const response = await fetch(`${Next_server}/api/vendors/plan/${vendorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  console.log("Update Vendor Plan API response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to update plan");
  }

  return data.vendor; // Extract the vendor object from the response
};

export const useUpdateVendorPlan = () => {
  const { mutate } = useSWRConfig();

  const updatePlanMutation = async (updateData: UpdatePlanData) => {
    try {
      const result = await updateVendorPlan(vendor_id, updateData);
      // Update relevant caches
      mutate(`${Next_server}/api/vendors/${vendor_id}`, result, { revalidate: true });
      mutate(`${Next_server}/api/plan/${updateData.plan_id}`, undefined, { revalidate: true });
      return result;
    } catch (error) {
      console.error("Error updating vendor plan:", error instanceof Error ? error.message : String(error));
      throw error;
    }
  };

  return {
    mutateAsync: updatePlanMutation,
    isLoading: false, // Can add a loading state if needed
  };
};