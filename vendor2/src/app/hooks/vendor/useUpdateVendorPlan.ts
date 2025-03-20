import { vendor_id } from "@/app/utils/constant";
import { useSWRConfig } from "swr";

interface UpdatePlanData {
  plan_id: string;
  plan: string;
}

const updateVendorPlan = async (updateData: UpdatePlanData) => {
  const response = await fetch(`http://localhost:5000/api/vendors/${vendor_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  console.log("Update Vendor Plan API response:", data); // Debug the response

  if (!response.ok) {
    throw new Error(data.error || "Failed to update plan");
  }

  // Extract the nested data (assuming { success: true, data: updatedVendor })
  return data.data || data;
};

export const useUpdateVendorPlan = () => {
  const { mutate } = useSWRConfig();

  const updatePlanMutation = async (updateData: UpdatePlanData) => {
    try {
      const result = await updateVendorPlan(updateData);
      // Invalidate or update relevant caches
      mutate(`http://localhost:5000/api/vendors/${vendor_id}`, result, { revalidate: true });
      // Optionally invalidate the plan endpoint if used
      mutate(`http://localhost:5000/api/plan/${updateData.plan_id}`, undefined, { revalidate: true });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating vendor plan:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      throw error;
    }
  };

  return {
    mutateAsync: updatePlanMutation, // Match the expected usage in ServicesDashboard
    isLoading: false, // SWR mutations don't have a built-in isLoading, but adding for compatibility
  };
};