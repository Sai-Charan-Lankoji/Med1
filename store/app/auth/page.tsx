"use client";
import React, { useState } from "react";
import medusaIcon from "../../public/medusaIcon.jpeg"
import Image from "next/image";
// import { EyeMini, EyeSlashMini } from "@medusajs/icons";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useCustomerLogin } from "../hooks/useCustomerLogin";
import { useCustomerSignup } from "../hooks/useCustomerSignup";

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, firstName, lastName, phone, has_account, vendor_id } = formData;

    if (!email || !password) {
      console.log("Email and password are required");
      return;
    }

    if (isSignup) {
      await signup( email, password, firstName, lastName, phone, has_account, vendor_id );
    } else {
      await login(email, password);
    }
  };

  const isLoading = loginLoading || signupLoading;

  return (
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
                required
                className="text-black w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500  "
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="text-black w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Last Name"
              />
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="text-black w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Phone Number"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-black w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Enter Email"
          />

          {/* Password field with eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-black w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter Password"
              aria-label="Enter Password"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <HiEye className="w-5 h-5" />
              ) : (
                <HiEyeOff className="w-5 h-5" />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading} // Disable the button when loading
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
