import { Next_server } from "@/constant";
import { useState } from "react";

interface ResetPasswordData {
  message: string;
}

interface ResetPasswordParams {
  email: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const [data, setData] = useState<ResetPasswordData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async ({ email, newPassword }: ResetPasswordParams) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${Next_server}/api/vendor/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, data, error };
};