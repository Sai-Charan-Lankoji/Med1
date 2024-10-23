"use client";
import React, { useState } from "react";
import medusaIcon from "../../public/medusaIcon.jpeg"
import Image from "next/image";
// import { EyeMini, EyeSlashMini } from "@medusajs/icons";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useCustomerLogin } from "../hooks/useCustomerLogin";
import { useCustomerSignup } from "../hooks/useCustomerSignup";

type Errors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  password?: string;
};
export default function SignIn() {
  const vendorId = process.env.NEXT_PUBLIC_VENDOR_ID  || null;

  const { login, loading: loginLoading, error: loginError } = useCustomerLogin();
  const { signup, loading: signupLoading, error: signupError } = useCustomerSignup();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    has_account: true,
    vendor_id: vendorId
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",  
    }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.email) {
      newErrors.email = "Please enter your email.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    if (isSignup) {
      if (!formData.firstName) {
        newErrors.firstName = "Please enter your first name.";
      }

      if (!formData.lastName) {
        newErrors.lastName = "Please enter your last name.";
      }

      if (!formData.phone) {
        newErrors.phone = "Please enter your phone number.";
      }
    }

    return newErrors;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, firstName, lastName, phone, has_account, vendor_id } = formData;

     const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    if (isSignup) {
      await signup( email, password, firstName, lastName, phone, has_account, vendor_id );
    } else {
      await login(email, password, vendorId);
    }
  };

  const isLoading = loginLoading || signupLoading;

<<<<<<< HEAD
  return (
=======
 return (
>>>>>>> f3bb79d91a094e6774ec3c8d3e83f50845532c55
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[400px] p-10 bg-white rounded-xl shadow-lg">
        <Image
          src={medusaIcon}
          alt="Medusa Logo"
          className="h-[80px] w-[80px] mx-auto mb-6"
          width={80}
          height={80}
          priority
        />
        <h2 className="text-[20px] font-bold text-center text-gray-800 mb-6">
          {isSignup ? "Create an Account" : "Welcome.."}
        </h2>
        <form onSubmit={handleSubmit} method="post" className="flex flex-col space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`text-black w-full border-2 py-2 px-4 rounded-lg text-[14px] focus:outline-none ${
                  errors.firstName ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`text-black w-full border-2 py-2 px-4 rounded-lg text-[14px] focus:outline-none ${
                  errors.lastName ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`text-black w-full border-2 py-2 px-4 rounded-lg text-[14px] focus:outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`text-black w-full border-2 py-2 px-4 rounded-lg text-[14px] focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
            }`}
            placeholder="Enter Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Password field with eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`text-black w-full border-2 py-2 px-4 rounded-lg text-[14px] focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-indigo-500"
              }`}
              placeholder="Enter Password"
              aria-label="Enter Password"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <HiEye className="w-5 h-5" /> : <HiEyeOff className="w-5 h-5" />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-[13px] py-2 rounded-lg font-semibold border-2 border-gray-200 ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-transparent text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}
          </button>

          {/* Show error message if there's any */}
          {(loginError || signupError) && (
            <div className="text-red-500 text-center text-sm mt-2">
              {loginError || signupError}
            </div>
          )}
        </form>

        {/* Toggle between login and signup */}
        <div className="mt-4 text-center">
          <p className="text-[12px] text-gray-600">
            {isSignup ? "Already have an account?" : " Don't have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-indigo-500 ml-2"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
