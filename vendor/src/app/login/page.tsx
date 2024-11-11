"use client";
import React, { useState } from "react";
import { EyeMini, EyeSlashMini, Loader } from "@medusajs/icons";
import medusaIcon from "../../../public/medusaIcon.jpeg";
import Image from "next/image";
import { useVendorLogin } from "../hooks/auth/useVendorLogin";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";
import { useUserLogin } from "../hooks/auth/useUserLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("vendor"); // Add role state
  const { login: vendorLogin, loading: vendorLoading, error: vendorError } = useVendorLogin();
  const { login: userLogin, loading: userLoading, error: userError } = useUserLogin();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (role === "vendor") {
        await vendorLogin(email, password);
      } else {
        await userLogin(email, password);
      }
    } catch (err) {
      // Handle error
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[400px] p-10 bg-white rounded-xl shadow-lg">
        <Image
          src={medusaIcon}
          alt="Medusa Logo"
          className="h-[80px] w-[80px] mx-auto mb-2"
          width={80}
          height={80}
          priority
        />
        <h2 className="text-[20px] font-bold text-center text-gray-800 mb-2">
          Log in {role}
        </h2>
        <form onSubmit={handleSubmit} method="post" className="flex flex-col space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-1">
              Select your role:
            </label>
            <div className="flex items-center space-x-4">
              <div>
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={role === "vendor"}
                  onChange={handleRoleChange}
                  className="form-radio text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-[14px] text-gray-700">Vendor</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={handleRoleChange}
                  className="form-radio text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-[14px] text-gray-700">User</label>
              </div>
            </div>
          </div>

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
              disabled={role === "vendor" ? vendorLoading : userLoading}
            >
              {role === "vendor" ? (
                vendorLoading ? (
                  <Loader />
                ) : (
                  "Continue as Vendor"
                )
              ) : userLoading ? (
                <Loader />
              ) : (
                "Continue as User"
              )}
            </button>

            {(role === "vendor" && vendorError) || (role === "user" && userError) ? (
              <p className="text-red-500">{role === "vendor" ? vendorError : userError}</p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;