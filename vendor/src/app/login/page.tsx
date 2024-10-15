"use client";
import React, { useState } from "react";
import { EyeMini, EyeSlashMini, Loader } from "@medusajs/icons";
import medusaIcon from "../../../public/medusaIcon.jpeg";
import Image from "next/image";
import { useVendorLogin } from "../hooks/auth/useVendorLogin";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useVendorLogin();
  const router = useRouter(); 

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password); 

      // const redirectPath = router.query.redirect || '/';
      // router.push(redirectPath as string);
    } catch (err) {
    }
  };

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
          Log in to Vendor
        </h2>
        <form onSubmit={handleSubmit} method="post" className="flex flex-col space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter Email"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter Password"
              aria-label="Enter Password"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeMini className="w-5 h-5" />
              ) : (
                <EyeSlashMini className="w-5 h-5" />
              )}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <button
              type="submit"
              className="w-full text-[13px] bg-transparent text-gray-900 py-2 rounded-lg font-semibold border-2 border-gray-200 hover:bg-gray-100 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader /> : "Continue"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
