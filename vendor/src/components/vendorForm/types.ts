import { CountryCode, phoneRegexMap } from "@/app/@types/phonevalidation";
import { z } from "zod";

export const BusinessTypes = [
  { value: "Apparel Design", label: "Apparel Design" },
  { value: "Grocery Store", label: "Grocery Store" },
  { value: "Paper Design Printing", label: "Paper Design Printing" },
] as const;

// Address schema for reuse in vendor and registration addresses
const AddressSchema = z.object({
  address_1: z.string().nonempty("Address 1 is required"),
  address_2: z.string().optional(),
  city: z.string().nonempty("City is required"),
  postal_code: z.string().nonempty("Postal code is required"),
  province: z.string().nonempty("Province is required"),
  phone: z.string().nonempty("Phone is required"),
});

// Vendor address extends base address with additional fields
const VendorAddressSchema = AddressSchema.extend({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().optional(),
});

export const VendorFormSchema = z
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
    plan_id : z.string().optional(), 
    plan_name : z.string().optional(),
    vendorAddressData: VendorAddressSchema,
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
  })

export type VendorFormData = z.infer<typeof VendorFormSchema>;

export type AddressData = z.infer<typeof AddressSchema>;
export type VendorAddressData = z.infer<typeof VendorAddressSchema>;

// Type for form field props
export interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  required?: boolean;
  register: any;
  name: string;
  error?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
}

// Type for address section props
export interface AddressSectionProps {
  title: string;
  prefix: string;
  addressType: "vendorAddressData" | "registrationAddressData";
  register: any;
  errors: any;
}

// Type for password field props
export interface PasswordFieldProps {
  label: string;
  id: string;
  placeholder: string;
  required?: boolean;
  register: any;
  name: string;
  error?: string;
}

// Type for phone input props
export interface PhoneInputProps {
  value: string;
  countryCode: string;
  onChange: (value: string, isValid: boolean) => void;
  onCountryChange: (value: string) => void;
  error?: string;
  register?: any;
}

