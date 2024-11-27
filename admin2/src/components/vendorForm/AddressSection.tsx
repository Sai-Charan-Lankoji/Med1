import { Label, Textarea } from "@medusajs/ui";
import { FormField } from "./FormField";
import { BadgeCheck } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";
import { VendorFormData } from "./types";
import { UseFormRegister } from "react-hook-form";

interface AddressSectionProps {
  title: string;
  prefix: string;
  register: UseFormRegister<VendorFormData>;
  errors: any;
  addressType: "vendorAddressData" | "registrationAddressData";
}

export const AddressSection = ({
  title,
  prefix,
  register,
  errors,
  addressType,
}: AddressSectionProps) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-2">
      <BadgeCheck className="h-5 w-5 text-primary animate-pulse" />
      <h4 className="font-semibold">{title}</h4>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Address 1"
        id={`${prefix}_address_1`}
        placeholder="Enter address line 1"
        required
        register={register}
        name={`${addressType}.address_1`}
        error={errors?.[addressType]?.address_1?.message}
      />
      <FormField
        label="Address 2"
        id={`${prefix}_address_2`}
        placeholder="Enter address line 2 (optional)"
        register={register}
        name={`${addressType}.address_2`}
        error={errors?.[addressType]?.address_2?.message}
      />
      <FormField
        label="City"
        id={`${prefix}_city`}
        placeholder="Enter city"
        required
        register={register}
        name={`${addressType}.city`}
        error={errors?.[addressType]?.city?.message}
      />
      <FormField
        label="Postal Code"
        id={`${prefix}_postal_code`}
        placeholder="Enter postal code"
        required
        register={register}
        name={`${addressType}.postal_code`}
        error={errors?.[addressType]?.postal_code?.message}
      />
      <FormField
        label="Province"
        id={`${prefix}_province`}
        placeholder="Enter province"
        required
        register={register}
        name={`${addressType}.province`}
        error={errors?.[addressType]?.province?.message}
      />
      <FormField
        label="Phone"
        id={`${prefix}_phone`}
        placeholder="Enter phone number"
        required
        register={register}
        name={`${addressType}.phone`}
        error={errors?.[addressType]?.phone?.message}
      />
      <FormField
        label="First Name"
        id={`${prefix}_first_name`}
        placeholder="Enter first name"
        required
        register={register}
        name={`${addressType}.first_name`}
        error={errors?.[addressType]?.first_name?.message}
      />
      <FormField
        label="Last Name"
        id={`${prefix}_last_name`}
        placeholder="Enter last name (optional)"
        register={register}
        name={`${addressType}.last_name`}
        error={errors?.[addressType]?.last_name?.message}
      />
    </div>
  </div>
);
