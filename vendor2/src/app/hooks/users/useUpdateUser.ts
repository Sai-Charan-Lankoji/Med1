"use client";

import { useSWRConfig } from "swr";
import { useState } from "react";
import { vendor_id } from "@/app/utils/constant";
import { Next_server } from "@/constant";

const baseUrl = Next_server;

const updateUser = async (userData: { id: string; [key: string]: any }) => {
  if (!vendor_id) {
    console.warn("No vendor ID found in sessionStorage");
    throw new Error("Vendor ID not found");
  }

  const { id, ...updateData } = userData;
  const url = `${baseUrl}/api/vendor-users/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...updateData, vendor_id: vendor_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`HTTP error! Status: ${response.status}, ${errorData.error}`);
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    throw error;
  }
};

export const useUpdateUser = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateUserMutation = async (userData: { id: string; [key: string]: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateUser(userData);
      // Optimistic update
      mutate(
        `${baseUrl}/api/users`,
        (currentData: any[] | undefined) => {
          if (!currentData) return currentData;
          return currentData.map((user) =>
            user.id === userData.id ? { ...user, ...result } : user
          );
        },
        false
      );
      // Revalidate
      mutate(`${baseUrl}/api/users`);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return {
    updateUser: updateUserMutation,
    isLoading,
    error,
  };
};