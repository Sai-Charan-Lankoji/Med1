import { z } from "zod";

export const BusinessTypes = [
  { value: "Apparel Design", label: "Apparel Design" },
  { value: "Grocery Store", label: "Grocery Store" },
  { value: "Paper Design Printing", label: "Paper Design Printing" },
] as const;

export const VendorFormSchema = z.object({
  company_name: z.string().nonempty("Company name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  contact_name: z.string().nonempty("Contact name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone_number: z.string().nonempty("Contact number is required"),
  registered_number: z.string().optional(),
  tax_number: z.string().optional(),
  business_type: z.string().nonempty("Business type is required"),
  vendorAddressData: z.object({
    address_1: z.string().nonempty("Address 1 is required"),
    address_2: z.string().optional(),
    city: z.string().nonempty("City is required"),
    postal_code: z.string().nonempty("Postal code is required"),
    first_name: z.string().nonempty("First name is required"),
    last_name: z.string().optional(),
    phone: z.string().nonempty("Phone is required"),
    province: z.string().nonempty("Province is required"),
  }),
  registrationAddressData: z.object({
    address_1: z.string().nonempty("Address 1 is required"),
    address_2: z.string().optional(),
    city: z.string().nonempty("City is required"),
    postal_code: z.string().nonempty("Postal code is required"),
    province: z.string().nonempty("Province is required"),
    phone: z.string().nonempty("Phone is required"),
  }),
});

export type VendorFormData = z.infer<typeof VendorFormSchema>;