"use client";
import React, { useState, useEffect } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { CountryCode, phoneRegexMap } from "@/app/@types/phonevalidation";
import { Next_server } from "@/constant";

// Schema Definitions
const BusinessTypes = [
  { value: "Apparel Design", label: "Apparel Design" },
  { value: "Grocery Store", label: "Grocery Store" },
  { value: "Paper Design Printing", label: "Paper Design Printing" },
];

// Address schema for reuse in vendor and registration addresses
const AddressSchema = z.object({
  address_1: z.string().nonempty("Address 1 is required"),
  address_2: z.string().optional(),
  city: z.string().nonempty("City is required"),
  postal_code: z.string().nonempty("Postal code is required"),
  province: z.string().nonempty("Province is required"),
  phone: z.string().nonempty("Phone is required"),
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().optional(),
});

// Vendor form schema
const VendorFormSchema = z
  .object({
    company_name: z.string().nonempty("Company name is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    contact_name: z.string().nonempty("Contact name is required"),
    contact_email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    contact_phone_number: z.string()
      .nonempty("Phone number is required"),
    country_code: z.nativeEnum(CountryCode, {
      errorMap: () => ({ message: "Please select a country code" }),
    }),    
    registered_number: z.string().optional(),
    tax_number: z.string().optional(),
    business_type: z.string().nonempty("Business type is required"),
    plan: z.string().optional(),
    plan_id: z.string().optional(), 
    plan_name: z.string().optional(),
    vendorAddressData: AddressSchema,
    registrationAddressData: AddressSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (!data.contact_phone_number || !data.country_code) return false;
    const validation = phoneRegexMap[data.country_code];
    if (!validation) return false;
    return validation.reg.test(data.contact_phone_number.replace(/\D/g, ''));
  }, {
    message: "Invalid phone number for the selected country",
    path: ["contact_phone_number"],
  });

type VendorFormData = z.infer<typeof VendorFormSchema>;

// Utility Components
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center mt-1 space-x-1 text-error text-sm">
    <AlertCircle className="h-3 w-3" />
    <span>{message}</span>
  </div>
);

// Main Component
const VendorForm = ({ plan }: { plan: { name: string; id: string } }) => {
  const router = useRouter();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [sameAsVendorAddress, setSameAsVendorAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const baseUrl = Next_server;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  const currentPassword = watch("password") || "";

  const passwordRequirements = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "One uppercase letter", regex: /[A-Z]/ },
    { text: "One lowercase letter", regex: /[a-z]/ },
    { text: "One number", regex: /\d/ },
    { text: "One special character", regex: /[@$!%*?&#]/ }
  ];

  const checkRequirement = (requirement: { regex: RegExp }) => {
    return requirement.regex.test(currentPassword);
  };

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    
    if (countryCode && newValue) {
      const valid = phoneRegexMap[countryCode]?.reg.test(newValue.replace(/\D/g, ''));
      setIsPhoneValid(valid);
      setValue("contact_phone_number", newValue, { shouldValidate: true });
    } else {
      setIsPhoneValid(false);
      setValue("contact_phone_number", "", { shouldValidate: true });
    }
    await trigger(["contact_phone_number"]);
  };

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountryCode(value);
    setPhoneNumber("");
    setValue("country_code", value as CountryCode, { shouldValidate: true });
    setValue("contact_phone_number", "", { shouldValidate: true });
    await trigger(["country_code", "contact_phone_number"]);
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsVendorAddress(e.target.checked);
    if (e.target.checked) {
      const vendorAddress = watch("vendorAddressData");
      setValue("registrationAddressData", vendorAddress);
    }
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
      const value = field.split(".").reduce((obj, key) => obj?.[key], data as any);
      return !value;
    });

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields", { duration: 3000 });
      return;
    }

    try {
      const submissionData = { ...data, plan_id: plan.id };
      const response = await fetch(`${baseUrl}/api/vendors`, {
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

  // Component for form fields
  const FormField = ({
    label,
    id,
    type = "text",
    placeholder,
    required,
    name,
    error,
    options,
    disabled,
  }: {
    label: string;
    id: string;
    type?: "text" | "email" | "password" | "select" | "tel" | "number" | "checkbox";
    placeholder: string;
    required?: boolean;
    name: Path<VendorFormData>;
    error?: string;
    options?: { value: string; label: string }[];
    disabled?: boolean;
  }) => (
    <div className="form-control">
      <label className="label" htmlFor={id}>
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </span>
      </label>
      {type === "select" && options ? (
        <select
          id={id}
          {...register(name)}
          className="select select-bordered w-full"
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          {...register(name)}
          className="input input-bordered w-full"
          disabled={disabled}
        />
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );

  // Password field component
  const PasswordField = ({
    label,
    id,
    placeholder,
    required,
    name,
    error,
    isConfirm = false,
  }: {
    label: string;
    id: string;
    placeholder: string;
    required?: boolean;
    name: Path<VendorFormData>;
    error?: string;
    isConfirm?: boolean;
  }) => {
    const isShowPassword = isConfirm ? showConfirmPassword : showPassword;
    const toggleShow = () => {
      if (isConfirm) {
        setShowConfirmPassword(!showConfirmPassword);
      } else {
        setShowPassword(!showPassword);
      }
    };

    return (
      <div className="form-control">
        <label className="label" htmlFor={id}>
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </span>
        </label>
        <div className="relative">
          <input
            type={isShowPassword ? "text" : "password"}
            id={id}
            placeholder={placeholder}
            {...register(name)}
            className="input input-bordered w-full pr-10"
            onFocus={() => !isConfirm && setPasswordFocus(true)}
            onBlur={() => !isConfirm && setPasswordFocus(false)}
            onPaste={(e) => isConfirm && e.preventDefault()}
          />
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
          >
            {isShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {!isConfirm && passwordFocus && (
          <div className="mt-2 p-3 bg-base-200 rounded-lg text-sm">
            <p className="font-medium mb-2">Password must contain:</p>
            <ul className="space-y-1">
              {passwordRequirements.map((requirement, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-2 ${
                    checkRequirement(requirement) ? "text-success" : "text-base-content/60"
                  }`}
                >
                  {checkRequirement(requirement) ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span>{requirement.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isConfirm && currentPassword && watch("confirmPassword") && (
          <div className={`mt-1 flex items-center space-x-1 ${
            currentPassword === watch("confirmPassword") ? "text-success" : "text-error"
          }`}>
            {currentPassword === watch("confirmPassword") ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="text-sm">Passwords match</span>
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" />
                <span className="text-sm">{"Passwords don't match"}</span>
              </>
            )}
          </div>
        )}
        
        {error && <ErrorMessage message={error} />}
      </div>
    );
  };

  // Address section component
  const AddressSection = ({
    title,
    prefix,
    addressType,
  }: {
    title: string;
    prefix: string;
    addressType: "vendorAddressData" | "registrationAddressData";
  }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h4 className="text-lg font-medium text-primary">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Address 1"
          id={`${prefix}_address_1`}
          placeholder="Enter address line 1"
          type="text"
          required
          name={`${addressType}.address_1`}
          error={errors?.[addressType]?.address_1?.message}
        />
        <FormField
          label="Address 2"
          id={`${prefix}_address_2`}
          type="text"
          placeholder="Enter address line 2 (optional)"
          name={`${addressType}.address_2`}
          error={errors?.[addressType]?.address_2?.message}
        />
        <FormField
          label="City"
          id={`${prefix}_city`}
          type="text"
          placeholder="Enter city"
          required
          name={`${addressType}.city`}
          error={errors?.[addressType]?.city?.message}
        />
        <FormField
          label="Postal Code"
          id={`${prefix}_postal_code`}
          type="text"
          placeholder="Enter postal code"
          required
          name={`${addressType}.postal_code`}
          error={errors?.[addressType]?.postal_code?.message}
        />
        <FormField
          label="Province"
          id={`${prefix}_province`}
          type="text"
          placeholder="Enter province"
          required
          name={`${addressType}.province`}
          error={errors?.[addressType]?.province?.message}
        />
        <FormField
          label="Phone"
          id={`${prefix}_phone`}
          type="tel"
          placeholder="Enter phone number"
          required
          name={`${addressType}.phone`}
          error={errors?.[addressType]?.phone?.message}
        />
        <FormField
          label="First Name"
          id={`${prefix}_first_name`}
          type="text"
          placeholder="Enter first name"
          required
          name={`${addressType}.first_name`}
          error={errors?.[addressType]?.first_name?.message}
        />
        <FormField
          label="Last Name"
          id={`${prefix}_last_name`}
          type="text"
          placeholder="Enter last name (optional)"
          name={`${addressType}.last_name`}
          error={errors?.[addressType]?.last_name?.message}
        />
      </div>
    </div>
  );

  // Phone input component
  const PhoneInputField = () => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">
          Phone Number
          <span className="text-error ml-0.5">*</span>
        </span>
      </label>
      <div className="flex gap-2">
        <select 
          value={countryCode} 
          onChange={handleCountryChange}
          className="select select-bordered w-[120px]"
        >
          <option disabled value="">☎︎</option>
          {Object.entries(CountryCode).map(([key, value]) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={`input input-bordered flex-1 ${
            !isPhoneValid && phoneNumber ? "input-error" : ""
          }`}
          placeholder={countryCode ? `Enter phone number for ${countryCode}` : "Select country first"}
          disabled={!countryCode}
        />
      </div>
      {errors.contact_phone_number && (
        <ErrorMessage message={errors.contact_phone_number.message || ""} />
      )}
      {!isPhoneValid && phoneNumber && !errors.contact_phone_number && (
        <div className="text-sm text-error mt-1">
          Please enter a valid phone number for the selected country
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/10 to-secondary/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-primary">
              Create Vendor
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              You selected the{" "}
              <span className="font-medium text-primary">{plan.name}</span> plan
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="card-title">Vendor Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    label="Company Name"
                    id="company_name"
                    type="text"
                    placeholder="Enter company name"
                    required
                    name="company_name"
                    error={errors.company_name?.message}
                  />
                  <PasswordField
                    label="Password"
                    id="password"
                    placeholder="Enter password"
                    required
                    name="password"
                    error={errors.password?.message}
                  />
                  <PasswordField
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    required
                    name="confirmPassword"
                    error={errors.confirmPassword?.message}
                    isConfirm={true}
                  />
                  <FormField
                    label="Contact Name"
                    id="contact_name"
                    type="text"
                    placeholder="Enter contact name"
                    required
                    name="contact_name"
                    error={errors.contact_name?.message}
                  />
                  <FormField
                    label="Contact Email"
                    id="contact_email"
                    type="email"
                    placeholder="Enter contact email"
                    required
                    name="contact_email"
                    error={errors.contact_email?.message}
                  />
                  <PhoneInputField />
                  <FormField
                    label="Registered Number"
                    id="registered_number"
                    type="text"
                    placeholder="Enter registered number (optional)"
                    name="registered_number"
                    error={errors.registered_number?.message}
                  />
                  <FormField
                    label="Tax Number"
                    id="tax_number"
                    type="text"
                    placeholder="Enter tax number (optional)"
                    name="tax_number"
                    error={errors.tax_number?.message}
                  />
                  <FormField
                    label="Plan"
                    id="plan"
                    type="text"
                    placeholder={plan.name}
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
                    name="business_type"
                    options={BusinessTypes}
                    error={errors.business_type?.message}
                  />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="card-title">Address Information</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="pr-0 lg:pr-6 lg:border-r border-base-200">
                    <AddressSection
                      title="Vendor Address"
                      prefix="vendor_address"
                      addressType="vendorAddressData"
                    />
                  </div>
                  <div className="pl-0 lg:pl-4">
                    <div className="mb-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsVendorAddress}
                          onChange={handleSameAddressChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Same as Vendor Address</span>
                      </label>
                    </div>
                    <AddressSection
                      title="Registration Address"
                      prefix="registration_address"
                      addressType="registrationAddressData"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating...
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