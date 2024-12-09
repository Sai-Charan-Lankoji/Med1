import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  const url = process.env.NEXT_PUBLIC_API_URL;

  const mutation = useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>(
    async (data: ResetPasswordPayload) => {
      const response = await fetch(`${url}/vendor/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset password");
      }

      return await response.json();
    },
    {
      onSuccess: () => {
        // Invalidate any queries related to the user or vendor if needed
        queryClient.invalidateQueries(["user-data"]);
        queryClient.invalidateQueries(["vendor-data"]);
      },
      onError: (error) => {
        console.error("Password reset failed:", error.message);
      },
    }
  );

  return mutation;
};

