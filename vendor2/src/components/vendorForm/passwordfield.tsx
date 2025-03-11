'use client'

import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'


interface PasswordRequirement {
  text: string
  regex: RegExp
}

const passwordRequirements: PasswordRequirement[] = [
  { text: "At least 8 characters", regex: /.{8,}/ },
  { text: "One uppercase letter", regex: /[A-Z]/ },
  { text: "One lowercase letter", regex: /[a-z]/ },
  { text: "One number", regex: /\d/ },
  { text: "One special character", regex: /[@$!%*?&#]/ }
]

export interface PasswordFieldProps {
  label: string
  id: string
  placeholder: string
  required?: boolean
  register: any
  name: string
  error?: string
  isConfirm?: boolean
  mainPassword?: string
}

export function PasswordField({
  label,
  id,
  placeholder,
  required,
  register,
  name,
  error,
  isConfirm = false,
  mainPassword = ''
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const checkRequirement = (requirement: PasswordRequirement) => {
    return requirement.regex.test(value)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isConfirm) {
      e.preventDefault()
      //toast.info('You cannot paste into confirm password field')
     
    }
  }

  const isPasswordValid = !isConfirm && passwordRequirements.every(checkRequirement)
  const isConfirmValid = isConfirm && value === mainPassword && mainPassword !== ''

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          {...register(name, {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value)
            }
          })}
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          onPaste={handlePaste}
          className={cn(
            'pr-10',
            (isPasswordValid || isConfirmValid) && 'border-green-500 focus-visible:ring-green-500',
            error && 'border-red-500 focus-visible:ring-red-500'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </button>
      </div>

      {/* Password requirements list */}
      {!isConfirm && isFocused && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">Password must contain:</p>
          <ul className="space-y-1">
            {passwordRequirements.map((requirement, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center space-x-2",
                  checkRequirement(requirement) ? "text-green-600" : "text-gray-500"
                )}
              >
                {checkRequirement(requirement) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <span>{requirement.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirmation message for confirm password */}
      {isConfirm && value && (
        <p className={cn(
          "text-sm",
          isConfirmValid ? "text-green-600" : "text-red-500"
        )}>
          {isConfirmValid ? (
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Passwords match
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Passwords do not match
            </span>
          )}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}