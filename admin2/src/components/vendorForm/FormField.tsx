import { Label } from "@medusajs/ui";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "./ErrorMessage";
import { UseFormRegister } from "react-hook-form";
import { VendorFormData } from "./types";

interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "select"; // Added "select" type
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<VendorFormData>;
  name: any;
  error?: string;
  options?: { value: string; label: string }[]; // Added options for select
  disabled?: boolean;
}

export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  required,
  register,
  name,
  error,
  options, // Added options prop
}: FormFieldProps) => (
  <div className="space-y-2 group">
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {type === "select" && options ? (
      <select
        id={id}
        {...register(name)}
        className="input-animated bg-white border border-gray-300 rounded-md p-2"
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
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register(name)}
        className="input-animated"
      />
    )}
    {error && <ErrorMessage message={error} />}
  </div>
);
