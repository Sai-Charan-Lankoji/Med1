import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// TypeScript interface for Plan
export interface Plan {
  id?: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  isActive: boolean;
  duration?: 'monthly' | 'yearly' | 'quarterly';
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// API base URL
const API_BASE_URL = "http://localhost:9000/admin/plan";

// Fetch all plans
export const useFetchPlans = (filters?: { isActive?: boolean; duration?: string }) => {
  return useQuery({
    queryKey: ["plans", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive.toString());
      }
      if (filters?.duration) {
        queryParams.append('duration', filters.duration);
      }
      
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
  });
};

// Fetch single plan
export const useFetchPlan = (id: string) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Create plan mutation
export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPlan: Partial<Plan>) => {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlan),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

// Update plan mutation
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Plan> }) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific plan and plans list
      queryClient.invalidateQueries({ queryKey: ["plan", id] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

// Delete plan mutation
export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    },
    onSuccess: () => {
      // Invalidate plans list
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};