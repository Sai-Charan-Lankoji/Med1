'use client'

import { useState, useEffect } from 'react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CountryCode, phoneRegexMap } from "@/app/@types/phonevalidation"

interface PhoneInputProps {
  value: string
  countryCode: string
  onChange: (value: string, isValid: boolean) => void
  onCountryChange: (value: string) => void
  error?: string
  register?: any
}

export function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryChange,
  error,
  register
}: PhoneInputProps) {
  const [isValid, setIsValid] = useState(true)
  const [phoneValue, setPhoneValue] = useState(value)

  // Create country options array from CountryCode enum
  const countryOptions = Object.entries(CountryCode).map(([key, value]) => ({
    label: `${key.replace(/([A-Z])/g, ' $1').trim()} (${value})`,
    value: value
  }))

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setPhoneValue(newValue)
    
    // Only validate if we have both country code and phone number
    if (countryCode && newValue) {
      const valid = phoneRegexMap[countryCode]?.reg.test(newValue.replace(/\D/g, ''))
      setIsValid(valid)
      onChange(`${countryCode} ${newValue}`, valid)
    } else {
      setIsValid(true)
      onChange('', false)
    }
  }

  const handleCountrySelect = (value: string) => {
    setPhoneValue('') // Reset phone input when country changes
    setIsValid(true)  // Reset validation state
    onCountryChange(value)
  }

  // Update local phone value when prop changes
  useEffect(() => {
    setPhoneValue(value)
  }, [value])

  return (
    <div className="space-y-2">
      <Label>Phone Number</Label>
      <div className="flex gap-2">
        <Select 
          value={countryCode} 
          onValueChange={handleCountrySelect}
        >
          <SelectTrigger className="w-[68px]">
            <SelectValue placeholder="+91">
              {countryCode ? countryOptions.find(opt => opt.value === countryCode)?.value : "+91"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent  className="max-h-[300px] overflow-y-auto">
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={phoneValue}
          onChange={handlePhoneChange}
          className={cn(
            "flex-1",
            !isValid && phoneValue && "border-red-500 focus-visible:ring-red-500"
          )}
          placeholder={countryCode ? `Enter phone number for ${countryCode}` : "Select country first"}
          disabled={!countryCode}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!isValid && phoneValue && !error && (
        <p className="text-sm text-red-500">Please enter a valid phone number for the selected country</p>
      )}
    </div>
  )
}

