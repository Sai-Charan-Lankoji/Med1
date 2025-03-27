'use client'

import { useState, useEffect } from 'react'
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

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setPhoneValue('') // Reset phone input when country changes
    setIsValid(true)  // Reset validation state
    onCountryChange(value)
  }

  // Update local phone value when prop changes
  useEffect(() => {
    setPhoneValue(value)
  }, [value])

  return (
    <div className="form-control w-full gap-2">
      <label className="label">
        <span className="label-text">Phone Number</span>
      </label>
      <div className="flex gap-2">
        <select 
          value={countryCode} 
          onChange={handleCountrySelect}
          className="select select-bordered w-[120px]"
        >
          <option disabled value="">☎︎</option>
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneValue}
          onChange={handlePhoneChange}
          className={cn(
            "input input-bordered flex-1",
            !isValid && phoneValue ? "input-error" : ""
          )}
          placeholder={countryCode ? `Enter phone number for ${countryCode}` : "Select country first"}
          disabled={!countryCode}
        />
      </div>
      {error && <div className="label">
        <span className="label-text-alt text-error">{error}</span>
      </div>}
      {!isValid && phoneValue && !error && (
        <div className="label">
          <span className="label-text-alt text-error">Please enter a valid phone number for the selected country</span>
        </div>
      )}
    </div>
  )
}

