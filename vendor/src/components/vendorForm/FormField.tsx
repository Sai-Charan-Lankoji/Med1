import { Label } from "@medusajs/ui"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "./ErrorMessage"
import { UseFormRegister } from "react-hook-form"
import { VendorFormData } from "./types"

interface FormFieldProps {
  label: string
  id: string
  type?: "text" | "email" | "password" | "select" | "tel" | "number" | "checkbox"
  placeholder: string
  required?: boolean
  register: UseFormRegister<VendorFormData>
  name: any
  error?: string
  options?: { value: string; label: string }[]
  disabled?: boolean
  checked?: boolean
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
  options,
  disabled,
  checked,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="block">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {type === "select" && options ? (
      <select
        id={id}
        {...register(name)}
        className="w-[166px] rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
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
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register(name)}
        className="input-animated"
        disabled={disabled}
        checked={checked}
      />
    )}
    {error && <ErrorMessage message={error} />}
  </div>
)

