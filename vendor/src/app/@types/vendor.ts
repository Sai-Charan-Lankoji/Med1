

import { z } from 'zod';
export interface AddressData {
    address_1: string;
    address_2?: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
  }
  
  export interface VendorAddressData extends AddressData {
    first_name: string;
    last_name?: string;
  }
  
  export interface VendorFormData {
    company_name: string;
    password: string;
    contact_name: string;
    contact_email: string;
    contact_phone_number: string;
    registered_number?: string;
    tax_number?: string;
    business_type: string;
    vendorAddressData: VendorAddressData;
    registrationAddressData: AddressData;
  }
  
  export interface BusinessType {
    value: string;
    label: string;
  }

const phoneRegex = /^\+?[\d\s-]{10,}$/;
const postalCodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;

const addressSchema = z.object({
  address_1: z.string().min(1, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postal_code: z.string().regex(postalCodeRegex, 'Invalid postal code'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
});

const vendorAddressSchema = addressSchema.extend({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
});

export const vendorFormSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  contact_name: z.string().min(2, 'Contact name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone_number: z.string().regex(phoneRegex, 'Invalid phone number'),
  registered_number: z.string().optional(),
  tax_number: z.string().optional(),
  business_type: z.string().min(1, 'Please select a business type'),
  vendorAddressData: vendorAddressSchema,
  registrationAddressData: addressSchema,
});
