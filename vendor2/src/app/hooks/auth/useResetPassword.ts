import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

const resetPasswordFetcher = async (
  url: string,
  { arg }: { arg: ResetPasswordPayload }
): Promise<ResetPasswordResponse> => {
  const response = await fetch(url, {
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

  return await response.json();
};

export const useResetPassword = () => {
  const url = "http://localhost:5000/vendor/resetpassword";
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, data, error } = useSWRMutation<
    ResetPasswordResponse,
    Error,
    string,
    ResetPasswordPayload
  >(
    url, // Using the URL directly as the key
    resetPasswordFetcher,
    {
      onSuccess: (data: ResetPasswordResponse) => {
        mutate('user-data', undefined, { revalidate: true });
        mutate('vendor-data', undefined, { revalidate: true });
      },
      onError: (error: Error) => {
        console.error("Password reset failed:", error.message);
      },
    }
  );

  return {
    mutate: (data: ResetPasswordPayload) => trigger(data),
    isLoading: isMutating,
    data,
    error,
  };
};