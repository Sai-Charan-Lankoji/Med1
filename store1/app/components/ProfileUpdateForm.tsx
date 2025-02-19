"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Loader2, PlusCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// Form schema with optional fields to allow partial updates
const formSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone: z.string().min(10).max(15).optional(),
  old_password: z.string().min(6).optional(),
  new_password: z.string().min(6).optional(),
});

type FormData = z.infer<typeof formSchema>;

// API service for profile updates
const updateCustomerProfile = async (
  id: string,
  formData: FormData & { profile_photo?: File }
): Promise<Response> => {
  const form = new FormData();

  // Only append fields that have values
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, value);
    }
  });

  return fetch(`http://localhost:5000/api/customer/${id}`, {
    method: "PUT",
    body: form,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
};

export default function ProfileUpdateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      old_password: "",
      new_password: "",
    },
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerId = sessionStorage.getItem("customerId");
        if (!customerId) {
          throw new Error("Customer ID not found");
        }

        const response = await fetch(
          `http://localhost:5000/api/customer/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        reset(data);
        setAvatarUrl(data.profile_photo || "");
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchCustomerData();
  }, [reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    try {
      const customerId = sessionStorage.getItem("customerId");
      if (!customerId) throw new Error("Customer ID not found");

      console.log("🟡 Captured Form Values:", values); // ✅ Debugging log

      const submissionData: Partial<FormData & { profile_photo?: File }> = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submissionData[key as keyof FormData] = value;
        }
      });

      if (file) {
        submissionData.profile_photo = file;
      }

      console.log("🔹 Submission Data:", submissionData); // ✅ Debugging log

      const response = await updateCustomerProfile(customerId, submissionData);

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Error While Updating Profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
      <div className="flex items-center space-x-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                width={100}
                height={100}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-xl font-semibold text-gray-600">
                  {getValues("first_name")?.[0]}
                </span>
              </div>
            )}
          </div>
          <label
            htmlFor="profile_photo"
            className="absolute bottom-0 right-0 cursor-pointer"
          >
            <PlusCircle className="w-6 h-6 text-primary" />
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
          <h2 className="text-2xl font-semibold">
            {`${getValues("first_name")} ${getValues("last_name")}`}
          </h2>
          <p className="text-gray-500">{getValues("email")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form fields */}
        <FormField
          control={control}
          name="first_name"
          label="First Name"
          error={errors.first_name?.message}
        />
        <FormField
          control={control}
          name="last_name"
          label="Last Name"
          error={errors.last_name?.message}
        />
        <FormField
          control={control}
          name="email"
          label="Email"
          type="email"
          error={errors.email?.message}
        />
        <FormField
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          error={errors.phone?.message}
        />
        <PasswordField
          control={control}
          name="old_password"
          label="Old Password"
          show={showOldPassword}
          onToggle={() => setShowOldPassword(!showOldPassword)}
          error={errors.old_password?.message}
        />
        <PasswordField
          control={control}
          name="new_password"
          label="New Password"
          show={showNewPassword}
          onToggle={() => setShowNewPassword(!showNewPassword)}
          error={errors.new_password?.message}
        />
      </div>

      <div className="flex justify-between">
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-dark bg-gray-100 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Updating...
        </>
      ) : (
        "Update Profile"
      )}
    </button>

    <button
      type="button"
      className="flex flex-row items-end justify-end py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-dark bg-gray-100 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => router.push('/dashboard')}
    >
      Back To Dashboard
    </button>
  </div>
    </form>
  );
}

// Reusable form field component
interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  type?: string;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  type = "text",
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      )}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

// Reusable password field component
interface PasswordFieldProps {
  control: any;
  name: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  control,
  name,
  label,
  show,
  onToggle,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            type={show ? "text" : "password"}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        )}
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={onToggle}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </div>
    </div>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);
