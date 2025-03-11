"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Building2, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { VendorFormSchema, VendorFormData } from "./types";
import { FormField } from "./FormField";
import { AddressSection } from "./AddressSection";
import { PasswordField } from "./passwordfield";
import { PhoneInput } from "./phoneinput";
import { CountryCode } from "@/app/@types/phonevalidation";

const VendorForm = ({ plan }: { plan: { name: string; id: string } }) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const router = useRouter();
  const [sameAsVendorAddress, setSameAsVendorAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<VendorFormData>({
    resolver: zodResolver(VendorFormSchema),
    defaultValues: {
      plan: plan.name,
      plan_id: plan.id,
      country_code: undefined,
      contact_phone_number: "",
    },
    mode: "onChange",
  });
  const password = watch("password");

  const handlePhoneChange = async (value: string, isValid: boolean) => {
    setPhoneNumber(value);
    const phoneNumberOnly = value.split(" ").slice(1).join(" ");
    setValue("contact_phone_number", phoneNumberOnly, { shouldValidate: true });
    await trigger(["contact_phone_number"]);
  };

  const handleCountryChange = async (value: string) => {
    setCountryCode(value);
    setPhoneNumber("");
    setValue("country_code", value as CountryCode, { shouldValidate: true });
    setValue("contact_phone_number", "", { shouldValidate: true });
    await trigger(["country_code", "contact_phone_number"]);
  };

  const onSubmit = async (data: VendorFormData) => {
    const requiredFields = [
      "company_name",
      "password",
      "confirmPassword",
      "contact_name",
      "contact_email",
      "contact_phone_number",
      "business_type",
      "country_code",
      "vendorAddressData.address_1",
      "vendorAddressData.city",
      "vendorAddressData.postal_code",
      "vendorAddressData.province",
      "vendorAddressData.phone",
      "registrationAddressData.address_1",
      "registrationAddressData.city",
      "registrationAddressData.postal_code",
      "registrationAddressData.province",
      "registrationAddressData.phone",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = field.split(".").reduce((obj, key) => obj?.[key], data);
      return !value;
    });

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields", { duration: 3000 });
      return;
    }

    try {
      const submissionData = { ...data, plan_id: plan.id };
      const response = await fetch("http://localhost:5000/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create vendor: ${response.status}`);
      }

      toast.success("Vendor Created Successfully", { duration: 1000 });
      router.push("/login");
    } catch (error: any) {
      toast.error("Error while creating vendor: " + error.message, { duration: 1000 });
    }
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsVendorAddress(e.target.checked);
    if (e.target.checked) {
      const vendorAddress = watch("vendorAddressData");
      setValue("registrationAddressData", vendorAddress);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Vendor
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              You selected the{" "}
              <span className="font-medium text-blue-600">{plan.name}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="card bg-white shadow-md rounded-lg">
              <div className="card-header border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Vendor Details</h3>
                </div>
              </div>
              <div className="card-body p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    label="Company Name"
                    id="company_name"
                    type="text"
                    placeholder="Enter company name"
                    required
                    register={register}
                    name="company_name"
                    error={errors.company_name?.message}
                  />
                  <PasswordField
                    label="Password"
                    id="password"
                    placeholder="Enter password"
                    required
                    register={register}
                    name="password"
                    error={errors.password?.message}
                  />
                  <PasswordField
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    required
                    register={register}
                    name="confirmPassword"
                    error={errors.confirmPassword?.message}
                    isConfirm={true}
                    mainPassword={password}
                  />
                  <FormField
                    label="Contact Name"
                    id="contact_name"
                    type="text"
                    placeholder="Enter contact name"
                    required
                    register={register}
                    name="contact_name"
                    error={errors.contact_name?.message}
                  />
                  <FormField
                    label="Contact Email"
                    id="contact_email"
                    type="email"
                    placeholder="Enter contact email"
                    required
                    register={register}
                    name="contact_email"
                    error={errors.contact_email?.message}
                  />
                  <PhoneInput
                    value={phoneNumber.split(" ").slice(1).join(" ")}
                    countryCode={countryCode}
                    onChange={handlePhoneChange}
                    onCountryChange={handleCountryChange}
                    error={errors.contact_phone_number?.message}
                  />
                  <FormField
                    label="Registered Number"
                    id="registered_number"
                    type="text"
                    placeholder="Enter registered number (optional)"
                    register={register}
                    name="registered_number"
                    error={errors.registered_number?.message}
                  />
                  <FormField
                    label="Tax Number"
                    id="tax_number"
                    type="text"
                    placeholder="Enter tax number (optional)"
                    register={register}
                    name="tax_number"
                    error={errors.tax_number?.message}
                  />
                  <FormField
                    label="Plan"
                    id="plan"
                    type="text"
                    placeholder={plan.name}
                    register={register}
                    name="plan"
                    error={errors.plan?.message}
                    disabled
                  />
                  <FormField
                    label="Business Type"
                    id="business_type"
                    type="select"
                    placeholder="Select business type"
                    required
                    register={register}
                    name="business_type"
                    options={[
                      { value: "Apparel Design", label: "Apparel Design" },
                      { value: "Grocery Store", label: "Grocery Store" },
                      { value: "Paper Design Printing", label: "Paper Design Printing" },
                    ]}
                    error={errors.business_type?.message}
                  />
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-md rounded-lg">
              <div className="card-header border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
              </div>
              <div className="card-body p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="pr-0 lg:pr-4 lg:border-r lg:border-gray-200">
                    <AddressSection
                      title="Vendor Address"
                      prefix="vendor_address"
                      addressType="vendorAddressData"
                      register={register}
                      errors={errors}
                    />
                  </div>
                  <div className="pl-0 lg:pl-4">
                    <div className="mb-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsVendorAddress}
                          onChange={handleSameAddressChange}
                          className="checkbox checkbox-primary h-5 w-5"
                        />
                        <span className="text-md font-medium">Same as Vendor Address</span>
                      </label>
                    </div>
                    <AddressSection
                      title="Registration Address"
                      prefix="registration_address"
                      addressType="registrationAddressData"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Vendor"
                )}
              </button>
            </div>
            <input type="hidden" {...register("plan_id")} value={plan.id} />
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default VendorForm;