"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/context/storecontext";
import { useUserContext } from "@/context/userContext";
import medusaIcon from "../../public/medusaIcon.jpeg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define form schemas using Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  has_account: z.boolean().default(true),
  vendor_id: z.string().nullable(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  error?: { code: string; details: string };
}

const BASE_URL = "http://localhost:5000";

export default function SignIn() {
  const { store } = useStore();
  const { setUser, setIsLogin } = useUserContext();
  const vendorId = store?.vendor_id || null;
  const router = useRouter();

  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize react-hook-form for login
  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize react-hook-form for signup
  const signupForm = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      has_account: true,
      vendor_id: vendorId,
    },
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission for login
  const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const loginResponse = await fetch(`${BASE_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      });

      const loginResult: ApiResponse<{ message: string }> = await loginResponse.json();

      if (!loginResponse.ok || !loginResult.success) {
        throw new Error(loginResult.error?.details || loginResult.message || "Login failed");
      }

      // Fetch current user to get customer details
      const userResponse = await fetch(`${BASE_URL}/api/customer/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const userResult: ApiResponse<{ id: string; email: string; first_name: string; profile_photo?: string }> = await userResponse.json();

      if (!userResponse.ok || !userResult.success) {
        throw new Error(userResult.error?.details || userResult.message || "Failed to fetch user details");
      }

      // Update UserContext with user details
      if (userResult.data) {
        setUser({
          firstName: userResult.data.first_name,
          email: userResult.data.email,
          profilePhoto: userResult.data.profile_photo || null,
        });
        setIsLogin(true);

        // Store customer ID in sessionStorage
        sessionStorage.setItem("customerId", userResult.data.id);
        sessionStorage.setItem("customerEmail", userResult.data.email);

        // Show success toast
        toast.update(toastId, {
          render: "Login successful!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        // Redirect to homepage or dashboard
        router.push("/");
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for signup
  const onSubmitSignup: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Signing up...");

    try {
      const signupResponse = await fetch(`${BASE_URL}/api/customer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          password: data.password,
          phone: data.phone,
          has_account: data.has_account,
          vendor_id: data.vendor_id,
        }),
        credentials: "include",
      });

      const signupResult: ApiResponse<{ id: string; email: string; first_name: string }> = await signupResponse.json();

      if (!signupResponse.ok || !signupResult.success) {
        throw new Error(signupResult.error?.details || signupResult.message || "Signup failed");
      }

      // Fetch current user to get customer details
      const userResponse = await fetch(`${BASE_URL}/api/customer/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const userResult: ApiResponse<{ id: string; email: string; first_name: string; profile_photo?: string }> = await userResponse.json();

      if (!userResponse.ok || !userResult.success) {
        throw new Error(userResult.error?.details || userResult.message || "Failed to fetch user details");
      }

      // Update UserContext with user details
      if (userResult.data) {
        setUser({
          firstName: userResult.data.first_name,
          email: userResult.data.email,
          profilePhoto: userResult.data.profile_photo || null,
        });
        setIsLogin(true);

        // Store customer ID in sessionStorage
        sessionStorage.setItem("customerId", userResult.data.id);
        sessionStorage.setItem("customerEmail", userResult.data.email);

        // Show success toast
        toast.update(toastId, {
          render: "Signup successful!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        // Redirect to homepage or dashboard
        router.push("/");
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when toggling between signup and login
  useEffect(() => {
    loginForm.reset();
    signupForm.reset();
  }, [isSignup, loginForm, signupForm]);

  // Show toast when toggling between signup and login
  const handleToggleForm = () => {
    setIsSignup((prev) => {
      toast.info(`Switched to ${prev ? "Login" : "Signup"} form`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return !prev;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
        <Image
          src={medusaIcon}
          alt="Medusa Logo"
          className="h-20 w-20 mx-auto mb-6 rounded-full border-2 border-indigo-100"
          width={80}
          height={80}
          priority
        />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>
        {isSignup ? (
          <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-5">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${signupForm.formState.errors.firstName ? "border-red-500" : "border-gray-200"}`}
                {...signupForm.register("firstName")}
                aria-invalid={signupForm.formState.errors.firstName ? "true" : "false"}
              />
              {signupForm.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${signupForm.formState.errors.lastName ? "border-red-500" : "border-gray-200"}`}
                {...signupForm.register("lastName")}
                aria-invalid={signupForm.formState.errors.lastName ? "true" : "false"}
              />
              {signupForm.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.lastName.message}</p>
              )}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone Number"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${signupForm.formState.errors.phone ? "border-red-500" : "border-gray-200"}`}
                {...signupForm.register("phone")}
                aria-invalid={signupForm.formState.errors.phone ? "true" : "false"}
              />
              {signupForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${signupForm.formState.errors.email ? "border-red-500" : "border-gray-200"}`}
                {...signupForm.register("email")}
                aria-invalid={signupForm.formState.errors.email ? "true" : "false"}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${signupForm.formState.errors.password ? "border-red-500" : "border-gray-200"}`}
                {...signupForm.register("password")}
                aria-invalid={signupForm.formState.errors.password ? "true" : "false"}
                aria-label="Enter Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-300"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing Up...
                </span>
              ) : "Sign Up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${loginForm.formState.errors.email ? "border-red-500" : "border-gray-200"}`}
                {...loginForm.register("email")}
                aria-invalid={loginForm.formState.errors.email ? "true" : "false"}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${loginForm.formState.errors.password ? "border-red-500" : "border-gray-200"}`}
                {...loginForm.register("password")}
                aria-invalid={loginForm.formState.errors.password ? "true" : "false"}
                aria-label="Enter Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-300"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging In...
                </span>
              ) : "Log In"}
            </Button>
          </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={handleToggleForm}
              className="text-indigo-600 hover:text-indigo-800 font-medium ml-2 transition-colors duration-300"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}