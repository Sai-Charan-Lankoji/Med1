"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader2,
  PlusCircle,
  Eye,
  EyeOff,
  User,
  Lock,
  Key,
  LogOut,
  MapPin,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCustomerLogout } from "../hooks/useCustomerLogout";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

// Zod Schemas
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

const addressSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{5,10}$/, "Pincode must be 5-10 digits"),
  country: z.string().min(1, "Country is required"),
  address_type: z.enum(["billing", "shipping"], { message: "Address type must be billing or shipping" }),
  is_default: z.boolean().optional(),
  email: z.string().email().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type TokenChangePasswordFormData = z.infer<typeof tokenChangePasswordSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

// API Functions
const updateCustomerProfile = async (
  id: string,
  formData: ProfileFormData & { profile_photo?: File }
) => {
  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, value);
    }
  });

  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/${id}`, {
    method: "PUT",
    body: form,
    credentials: "include",
  });
};

const changeCustomerPassword = async (
  id: string,
  formData: ChangePasswordFormData
) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/${id}/change-password`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

const resetCustomerPassword = async (formData: ResetPasswordFormData) => {
  const origin = window.location.origin;
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/reset-password`, {
    method: "POST",
    body: JSON.stringify({ ...formData, origin }),
    headers: { "Content-Type": "application/json" },
  });
};

const changePasswordWithToken = async (
  token: string,
  formData: TokenChangePasswordFormData
) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/customer/reset-password-with-token`, {
    method: "POST",
    body: JSON.stringify({ token, new_password: formData.new_password }),
    headers: { "Content-Type": "application/json" },
  });
};

const fetchCustomerAddresses = async (customerId: string) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/address/customer/${customerId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

const createCustomerAddress = async (customerId: string, email: string, formData: AddressFormData) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/address/create`, {
    method: "POST",
    body: JSON.stringify({ ...formData, customer_id: customerId, customer_email: email }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

const updateCustomerAddress = async (addressId: string, formData: AddressFormData) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/address/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

const deleteCustomerAddress = async (addressId: string) => {
  return fetch(`${NEXT_PUBLIC_API_URL}/api/address/${addressId}`, {
    method: "DELETE",
    credentials: "include",
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
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, loading: logoutLoading, error: logoutError } = useCustomerLogout();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: "", first_name: "", last_name: "", phone: "" },
  });

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const tokenChangePasswordForm = useForm<TokenChangePasswordFormData>({
    resolver: zodResolver(tokenChangePasswordSchema),
    defaultValues: { new_password: "" },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      address_type: "shipping",
      is_default: false,
    },
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setActiveTab("change-password");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCustomerDataAndAddresses = async () => {
      // Fetch customer data only once on mount
      if (!customerId) {
        try {
          const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch profile data");
          const { data } = await response.json();
          setCustomerId(data.id);
          setEmail(data.email);
          profileForm.reset({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
          });
          resetPasswordForm.setValue("email", data.email);
          setAvatarUrl(data.profile_photo || "");
          toast.success("Profile data loaded successfully!", { autoClose: 3000 });
        } catch (error) {
          toast.error("Failed to load profile data", { autoClose: 3000 });
          return; // Exit if profile fetch fails
        }
      }

      // Fetch addresses only after customerId is set
      if (customerId) {
        try {
          const response = await fetchCustomerAddresses(customerId);
          const result = await response.json();
          if (result.success) {
            setAddresses(result.data);
          } else {
            toast.error(result.message || "Failed to load addresses", { autoClose: 3000 });
          }
        } catch (error) {
          toast.error("Error fetching addresses", { autoClose: 3000 });
        }
      }
    };

    fetchCustomerDataAndAddresses();
  }, [customerId, profileForm, resetPasswordForm]); // Dependency array includes customerId to trigger address fetch once set

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
      toast.success("Profile photo selected!", { autoClose: 3000 });
    }
  };

  const handleProfileSubmit = async (values: ProfileFormData) => {
    setIsLoading(true);
    try {
      if (!customerId) throw new Error("Customer ID not found");
      const submissionData: Partial<ProfileFormData & { profile_photo?: File }> = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submissionData[key as keyof ProfileFormData] = value;
        }
      });
      if (file) submissionData.profile_photo = file;

      const response = await updateCustomerProfile(customerId, submissionData);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to update profile");
      toast.success(result.message || "Profile updated successfully!", { autoClose: 3000 });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (values: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      if (!customerId) throw new Error("Customer ID not found");
      const response = await changeCustomerPassword(customerId, values);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to change password");
      toast.success(result.message || "Password changed successfully!", { autoClose: 3000 });
      changePasswordForm.reset();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (values: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await resetCustomerPassword(values);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to send reset link");
      toast.success(result.message || "Reset link sent successfully!", { autoClose: 3000 });
      resetPasswordForm.reset();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChangePasswordSubmit = async (values: TokenChangePasswordFormData) => {
    setIsLoading(true);
    try {
      if (!token) throw new Error("Invalid or missing token");
      const response = await changePasswordWithToken(token, values);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to reset password");
      toast.success(result.message || "Password reset successfully!", { autoClose: 3000 });
      tokenChangePasswordForm.reset();
      setToken(null);
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (values: AddressFormData) => {
    setIsLoading(true);
    try {
      if (!customerId) throw new Error("Customer ID not found");
      const response = editingAddress
        ? await updateCustomerAddress(editingAddress.id, values)
        : await createCustomerAddress(customerId, email, values);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to save address");
      toast.success(result.message || `${editingAddress ? "Address updated" : "Address added"} successfully!`, { autoClose: 3000 });
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      addressForm.reset();
      const addressesResponse = await fetchCustomerAddresses(customerId);
      const addressesResult = await addressesResponse.json();
      if (addressesResult.success) setAddresses(addressesResult.data);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    setIsLoading(true);
    try {
      const response = await deleteCustomerAddress(addressToDelete);
      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to delete address");
      toast.success(result.message || "Address deleted successfully!", { autoClose: 3000 });
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!", { autoClose: 3000 });
    } catch (error) {
      toast.error(logoutError || "Failed to log out", { autoClose: 3000 });
    }
  };

  const openEditAddressDialog = (address: any) => {
    setEditingAddress(address);
    addressForm.reset({
      first_name: address.first_name,
      last_name: address.last_name,
      phone_number: address.phone_number,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      address_type: address.address_type,
      is_default: address.is_default,
    });
    setIsAddressDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {!token && (
        <div className="w-72 bg-white shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-indigo-600" /> Settings
            </h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"}`}
              >
                <User className="inline w-5 h-5 mr-2" /> Profile
              </button>
              <button
                onClick={() => setActiveTab("change-password")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "change-password" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"}`}
              >
                <Lock className="inline w-5 h-5 mr-2" /> Change Password
              </button>
              <button
                onClick={() => setActiveTab("reset-password")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "reset-password" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"}`}
              >
                <Key className="inline w-5 h-5 mr-2" /> Reset Password
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "addresses" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"}`}
              >
                <MapPin className="inline w-5 h-5 mr-2" /> Addresses
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogoutClick}
            disabled={logoutLoading}
            className={`w-full text-left px-4 py-2 rounded-lg ${logoutLoading ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-100"}`}
          >
            <LogOut className="inline w-5 h-5 mr-2" /> {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <div className="flex-1 p-8">
        {activeTab === "profile" && !token && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-200">
                    {avatarUrl ? (
                      <Image src={avatarUrl} width={96} height={96} alt="Profile" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl font-bold">
                        {profileForm.getValues("first_name")?.[0]}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile_photo"
                    className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 cursor-pointer hover:bg-indigo-700"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
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
                  <h3 className="text-xl font-semibold text-gray-800">
                    {`${profileForm.getValues("first_name")} ${profileForm.getValues("last_name")}`}
                  </h3>
                  <p className="text-gray-600">{profileForm.getValues("email")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={profileForm.control} name="first_name" label="First Name" error={profileForm.formState.errors.first_name?.message} />
                <FormField control={profileForm.control} name="last_name" label="Last Name" error={profileForm.formState.errors.last_name?.message} />
                <FormField control={profileForm.control} name="email" label="Email" type="email" error={profileForm.formState.errors.email?.message} />
                <FormField control={profileForm.control} name="phone" label="Phone" type="tel" error={profileForm.formState.errors.phone?.message} />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "change-password" && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{token ? "Reset Password" : "Change Password"}</h2>
            {token ? (
              <form onSubmit={tokenChangePasswordForm.handleSubmit(handleTokenChangePasswordSubmit)} className="space-y-6">
                <PasswordField
                  control={tokenChangePasswordForm.control}
                  name="new_password"
                  label="New Password"
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                  error={tokenChangePasswordForm.formState.errors.new_password?.message}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : "Reset Password"}
                  </button>
                </div>
              </form>
            ) : (
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
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : "Change Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "reset-password" && !token && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)} className="space-y-6">
              <FormField
                control={resetPasswordForm.control}
                name="email"
                label="Email"
                type="email"
                error={resetPasswordForm.formState.errors.email?.message}
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "addresses" && !token && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Addresses</h2>
              <button
                onClick={() => { setEditingAddress(null); setIsAddressDialogOpen(true); addressForm.reset(); }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add Address
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{`${address.first_name} ${address.last_name}`}</h3>
                      <p className="text-gray-600">{address.street}, {address.city}, {address.state} {address.pincode}, {address.country}</p>
                      <p className="text-gray-600">Phone: {address.phone_number}</p>
                      <p className="text-sm text-gray-500">{address.address_type} {address.is_default && "(Default)"}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditAddressDialog(address)}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setAddressToDelete(address.id); setIsDeleteDialogOpen(true); }}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Dialog */}
        {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h2>
            <button
              onClick={() => setIsAddressDialogOpen(false)}
              className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
      
          {/* Scrollable Form Body */}
          <div className="overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={addressForm.control} name="first_name" label="First Name" error={addressForm.formState.errors.first_name?.message} />
                <FormField control={addressForm.control} name="last_name" label="Last Name" error={addressForm.formState.errors.last_name?.message} />
                <FormField control={addressForm.control} name="phone_number" label="Phone Number" type="tel" error={addressForm.formState.errors.phone_number?.message} />
                <FormField control={addressForm.control} name="street" label="Street" error={addressForm.formState.errors.street?.message} />
                <FormField control={addressForm.control} name="city" label="City" error={addressForm.formState.errors.city?.message} />
                <FormField control={addressForm.control} name="state" label="State" error={addressForm.formState.errors.state?.message} />
                <FormField control={addressForm.control} name="pincode" label="Pincode" error={addressForm.formState.errors.pincode?.message} />
                <FormField control={addressForm.control} name="country" label="Country" error={addressForm.formState.errors.country?.message} />
              </div>
      
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <Controller
                  control={addressForm.control}
                  name="address_type"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="shipping">Shipping</option>
                      <option value="billing">Billing</option>
                    </select>
                  )}
                />
                {addressForm.formState.errors.address_type && (
                  <p className="text-sm text-red-500 mt-1">{addressForm.formState.errors.address_type.message}</p>
                )}
              </div>
      
              {/* Default Checkbox */}
              <div className="flex items-center space-x-2">
                <Controller
                  control={addressForm.control}
                  name="is_default"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      value={field.value ? "true" : "false"}
                    />
                  )}
                />
                <label className="text-sm font-medium text-gray-700">Set as Default</label>
              </div>
            </form>
          </div>
      
          {/* Footer */}
          <div className="flex justify-end items-center gap-4 px-6 py-4 border-t bg-white sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => setIsAddressDialogOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="address-form"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {isLoading ? <Loader2 className="animate-spin inline w-4 h-4 mr-2" /> : editingAddress ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
      
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this address?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAddress}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isLoading ? <Loader2 className="animate-spin inline mr-2" /> : "Confirm"}
                </button>
              </div>
            </div>
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
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          className={`w-full px-3 py-2 border rounded-lg text-black ${error ? "border-red-500" : "border-gray-300"}`}
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
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            type={show ? "text" : "password"}
            className={`w-full px-3 py-2 border rounded-lg text-black ${error ? "border-red-500" : "border-gray-300"}`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);