"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { Next_server } from "@/constant";

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

const resetPasswordFetcher = async (
  key: string,
  { arg }: { arg: ResetPasswordPayload }
): Promise<ResetPasswordResponse> => {
  const response = await fetch(key, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reset password");
  }

  return response.json();
};

export const useResetPassword = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || Next_server;
  const url = `${baseUrl}/vendor/resetpassword`;
  const key = ["reset-password", url]; // Use an array key for better specificity
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, data, error } = useSWRMutation<
    ResetPasswordResponse,
    Error,
    string[],
    ResetPasswordPayload
  >(
    key,
    (key: string[], { arg }) => resetPasswordFetcher(key[1], { arg }), // Use the URL from the key array
    {
      onSuccess: (data: ResetPasswordResponse) => {
        // Invalidate related caches
        mutate("user-data", undefined, { revalidate: true });
        mutate("vendor-data", undefined, { revalidate: true });
      },
      onError: (err: Error) => {
        // Expose the error to the UI; no need for console.error since the UI will handle it
      },
    }
  );

  return {
    resetPassword: (data: ResetPasswordPayload) => trigger(data),
    isLoading: isMutating,
    data,
    error,
  };
};