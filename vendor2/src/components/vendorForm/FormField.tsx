import React from "react";
import { UseFormRegister } from "react-hook-form";
import { VendorFormData } from "./types";
import { ErrorMessage } from "./ErrorMessage";

interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "select" | "tel" | "number" | "checkbox";
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<VendorFormData>;
  name: any;
  error?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  checked?: boolean;
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
  <div className="form-control space-y-2">
    <label className="label" htmlFor={id}>
      <span className="label-text">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    </label>
    {type === "select" && options ? (
      <select
        id={id}
        {...register(name)}
        className="select select-bordered w-full max-w-[166px] disabled:cursor-not-allowed disabled:opacity-50"
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
        className="input input-bordered w-full input-animated disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        checked={checked}
      />
    )}
    {error && <ErrorMessage message={error} />}
  </div>
);