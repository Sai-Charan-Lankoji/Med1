"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Loader2, PlusCircle, Eye, EyeOff, User, Lock, Key, LogOut } from "lucide-react";
import Image from "next/image";
import { useCustomerLogout } from "../hooks/useCustomerLogout";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

const profileSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone: z.string().min(10).max(15).optional(),
});

const changePasswordSchema = z
  .object({
    old_password: z.string().min(6),
    new_password: z.string().min(6),
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: "New password must be different from old password",
    path: ["new_password"],
  });

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const tokenChangePasswordSchema = z.object({
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type TokenChangePasswordFormData = z.infer<typeof tokenChangePasswordSchema>;

const updateCustomerProfile = async (id: string, formData: ProfileFormData & { profile_photo?: File }) => {
  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, value);
    }
  });

  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/${id}`, {
    method: "PUT",
    body: form,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

const changeCustomerPassword = async (id: string, formData: ChangePasswordFormData) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/${id}/change-password`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const resetCustomerPassword = async (formData: ResetPasswordFormData) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/reset-password`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const changePasswordWithToken = async (token: string, formData: TokenChangePasswordFormData) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/reset-password-with-token`, {
    method: "POST",
    body: JSON.stringify({ token, new_password: formData.new_password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default function ProfileSettings() {
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Use the useCustomerLogout hook
  const { logout, loading: logoutLoading, error: logoutError } = useCustomerLogout();

  // Check for token in URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setActiveTab("change-password"); // Automatically switch to change-password tab
    }
  }, [searchParams]);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const tokenChangePasswordForm = useForm<TokenChangePasswordFormData>({
    resolver: zodResolver(tokenChangePasswordSchema),
    defaultValues: {
      new_password: "",
    },
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}` 

          }        });
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const { data } = await response.json();
        setCustomerId(data.id);
        profileForm.reset({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        });
        resetPasswordForm.setValue("email", data.email);
        setAvatarUrl(data.profile_photo || "");
        toast.success("Profile data loaded successfully!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#f0fdf4",
            color: "#16a34a",
            border: "1px solid #16a34a",
            borderRadius: "8px",
            padding: "12px",
          },
        });
      } catch (error) {
        toast.error("Failed to load profile data", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
      }
    };
    fetchCustomerData();
  }, [profileForm, resetPasswordForm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
      toast.success("Profile photo selected!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #16a34a",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    }
  };

  const handleProfileSubmit = async (values: ProfileFormData) => {
    setIsLoading(true);
    try {
      if (!customerId) {
        toast.error("Customer Id not found...", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      const submissionData: Partial<ProfileFormData & { profile_photo?: File }> = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submissionData[key as keyof ProfileFormData] = value;
        }
      });
      if (file) submissionData.profile_photo = file;

      const response = await updateCustomerProfile(customerId, submissionData);
      const result = await response.json();

      if (!result.success) {
        toast.error(`${result.status} - ${result.message}: ${result.error.details}`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      toast.success(`${result.status} - ${result.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #16a34a",
          borderRadius: "8px",
          padding: "12px",
        },
      });
      router.refresh();
    } catch (error) {
      toast.error("Unexpected error occurred", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (values: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      if (!customerId) {
        toast.error("Customer Id not found...", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      const response = await changeCustomerPassword(customerId, values);
      const result = await response.json();

      if (!result.success) {
        toast.error(`${result.status} - ${result.message}: ${result.error.details}`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      toast.success(`${result.status} - ${result.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #16a34a",
          borderRadius: "8px",
          padding: "12px",
        },
      });
      changePasswordForm.reset();
    } catch (error) {
      toast.error("Unexpected error occurred", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (values: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await resetCustomerPassword(values);
      const result = await response.json();

      if (!result.success) {
        toast.error(`${result.status} - ${result.message}: ${result.error.details}`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      toast.success(`${result.status} - ${result.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #16a34a",
          borderRadius: "8px",
          padding: "12px",
        },
      });
      resetPasswordForm.reset();
    } catch (error) {
      toast.error("Unexpected error occurred", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChangePasswordSubmit = async (values: TokenChangePasswordFormData) => {
    setIsLoading(true);
    try {
      if (!token) {
        toast.error("Invalid or missing token", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      const response = await changePasswordWithToken(token, values);
      const result = await response.json();

      if (!result.success) {
        toast.error(`${result.status} - ${result.message}: ${result.error?.details || "Failed to reset password"}`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            padding: "12px",
          },
        });
        return;
      }

      toast.success(`${result.status} - ${result.message}`, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "1px solid #16a34a",
          borderRadius: "8px",
          padding: "12px",
        },
      });
      tokenChangePasswordForm.reset();
      setToken(null); // Clear token after successful reset
      router.push("/login"); // Redirect to login page after successful reset
    } catch (error) {
      toast.error("Unexpected error occurred", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(logoutError || "Failed to log out", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          padding: "12px",
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Sidebar */}
      {!token && (
        <div className="w-72 bg-white shadow-2xl p-8 flex flex-col justify-between transition-all duration-300">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Settings
            </h2>
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </button>
              {/* <button
                onClick={() => setActiveTab("change-password")}
                className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === "change-password"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Lock className="w-5 h-5 mr-3" />
                Change Password
              </button> */}
              <button
                onClick={() => setActiveTab("reset-password")}
                className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                  activeTab === "reset-password"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Key className="w-5 h-5 mr-3" />
                Reset Password
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogoutClick}
            disabled={logoutLoading}
            className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ${
              logoutLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-10">
        {activeTab === "profile" && !token && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h2>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-400">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        width={112}
                        height={112}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-3xl font-bold">
                        {profileForm.getValues("first_name")?.[0]}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile_photo"
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer transition-all duration-300 hover:bg-blue-700 shadow-md"
                  >
                    <PlusCircle className="w-6 h-6 text-white" />
                  </label>
                  <input
                    id="profile_photo"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {`${profileForm.getValues("first_name")} ${profileForm.getValues("last_name")}`}
                  </h3>
                  <p className="text-gray-500">{profileForm.getValues("email")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="first_name"
                  label="First Name"
                  error={profileForm.formState.errors.first_name?.message}
                />
                <FormField
                  control={profileForm.control}
                  name="last_name"
                  label="Last Name"
                  error={profileForm.formState.errors.last_name?.message}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  label="Email"
                  type="email"
                  error={profileForm.formState.errors.email?.message}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  label="Phone"
                  type="tel"
                  error={profileForm.formState.errors.phone?.message}
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "change-password" && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {!token ?  "Reset Your Password" :"Change Password" }
            </h2>
            {!token ? (
              // UI for changing password with token
              <form onSubmit={tokenChangePasswordForm.handleSubmit(handleTokenChangePasswordSubmit)} className="space-y-6">
                <PasswordField
                  control={tokenChangePasswordForm.control}
                  name="new_password"
                  label="New Password"
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                  error={tokenChangePasswordForm.formState.errors.new_password?.message}
                />
                <div className="flex justify-between pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              // Default change password UI
              <form onSubmit={changePasswordForm.handleSubmit(handleChangePasswordSubmit)} className="space-y-6">
                <PasswordField
                  control={changePasswordForm.control}
                  name="old_password"
                  label="Old Password"
                  show={showOldPassword}
                  onToggle={() => setShowOldPassword(!showOldPassword)}
                  error={changePasswordForm.formState.errors.old_password?.message}
                />
                <PasswordField
                  control={changePasswordForm.control}
                  name="new_password"
                  label="New Password"
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                  error={changePasswordForm.formState.errors.new_password?.message}
                />
                <div className="flex justify-between pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "reset-password" && !token && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Reset Password</h2>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)} className="space-y-6">
              <FormField
                control={resetPasswordForm.control}
                name="email"
                label="Email"
                type="email"
                error={resetPasswordForm.formState.errors.email?.message}
              />
              <div className="flex justify-between pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const FormField: React.FC<{
  control: any;
  name: string;
  label: string;
  type?: string;
  error?: string;
}> = ({ control, name, label, type = "text", error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 ${
            error ? "border-red-400 focus:ring-red-400" : "border-gray-300"
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const PasswordField: React.FC<{
  control: any;
  name: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
}> = ({ control, name, label, show, onToggle, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            type={show ? "text" : "password"}
            className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 ${
              error ? "border-red-400 focus:ring-red-400" : "border-gray-300"
            }`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-all duration-300"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);