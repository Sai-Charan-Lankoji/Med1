"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserContext } from "@/context/userContext";
import medusaIcon from "../../public/medusaIcon.jpeg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

// Zod schemas for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(2, "First name too short").max(50).regex(/^[A-Za-z\s]+$/, "Letters only"),
  lastName: z.string().min(2, "Last name too short").max(50).regex(/^[A-Za-z\s]+$/, "Letters only"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Password too short").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Strong password required"
  ),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;

const BASE_URL = `${NEXT_PUBLIC_API_URL}`;

export default function SignIn() {
  const { setUser, setIsLogin } = useUserContext();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const signupForm = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "" },
    mode: "onChange",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.details || result.message || "Login failed");
      }

      const userData = result.data.user;
      setUser({
        firstName: userData.first_name,
        email: userData.email,
        profilePhoto: userData.profile_photo || null,
      });
      setIsLogin(true); // Set only after successful login
      sessionStorage.setItem("customerId", userData.id);
      sessionStorage.setItem("customerEmail", userData.email);

      toast.success(result.message || "Login successful!");
      setTimeout(() => router.push("/"), 3000);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSignup: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/customer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          password: data.password,
          phone: data.phone,
          has_account: true,
          vendor_id: null,
        }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.details || result.message || "Signup failed");
      }

      // Do not set user or isLogin here; prompt login
      toast.success(result.message || "Signup successful! Please log in.");
      setIsSignup(false);
      signupForm.reset();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loginForm.reset();
    signupForm.reset();
    setShowPassword(false);
  }, [isSignup, loginForm, signupForm]);

  const handleToggleForm = () => {
    setIsSignup((prev) => !prev);
    toast.info(`Switched to ${isSignup ? "Login" : "Signup"}`, { autoClose: 1500 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <Image
          src={medusaIcon}
          alt="Medusa Logo"
          className="h-16 w-16 mx-auto mb-6 rounded-full"
          width={64}
          height={64}
          priority
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>
        {isSignup ? (
          <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  signupForm.formState.errors.firstName ? "border-red-500" : "border-gray-200"
                }`}
                {...signupForm.register("firstName")}
              />
              {signupForm.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  signupForm.formState.errors.lastName ? "border-red-500" : "border-gray-200"
                }`}
                {...signupForm.register("lastName")}
              />
              {signupForm.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.lastName.message}</p>
              )}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone (e.g., +1234567890)"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  signupForm.formState.errors.phone ? "border-red-500" : "border-gray-200"
                }`}
                {...signupForm.register("phone")}
              />
              {signupForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  signupForm.formState.errors.email ? "border-red-500" : "border-gray-200"
                }`}
                {...signupForm.register("email")}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  signupForm.formState.errors.password ? "border-red-500" : "border-gray-200"
                }`}
                {...signupForm.register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <HiEye className="w-5 h-5" /> : <HiEyeOff className="w-5 h-5" />}
              </button>
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-60" : ""
              }`}
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  loginForm.formState.errors.email ? "border-red-500" : "border-gray-200"
                }`}
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 ${
                  loginForm.formState.errors.password ? "border-red-500" : "border-gray-200"
                }`}
                {...loginForm.register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <HiEye className="w-5 h-5" /> : <HiEyeOff className="w-5 h-5" />}
              </button>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-60" : ""
              }`}
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "Log In"}
            </Button>
          </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={handleToggleForm}
              className="text-blue-600 hover:text-blue-700 ml-2 transition-colors"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}