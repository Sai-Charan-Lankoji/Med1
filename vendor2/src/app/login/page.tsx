"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const router = useRouter();
  const { setVendorId, setAuthEmail, setContactName, setCompanyName, setBusinessType, setPlan } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) setEmailError("Please enter a valid email address");
    else setEmailError("");
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) setPasswordError("Password must be at least 8 characters long");
    else setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Failed to login");
        return;
      }

      const vendorData = await fetchVendorDetails();
      // Update AuthContext directly
      if (vendorData.vendor) {
        setVendorId(vendorData.vendor.id);
        setAuthEmail(vendorData.vendor.contact_email);
        setContactName(vendorData.vendor.contact_name);
        setCompanyName(vendorData.vendor.company_name);
        setBusinessType(vendorData.vendor.business_type);
        setPlan(vendorData.vendor.plan);
      } else if (vendorData.vendorUser) {
        setVendorId(vendorData.vendorUser.vendor_id);
        setAuthEmail(vendorData.vendorUser.email);
        setContactName(vendorData.vendorUser.first_name);
      }
      // Update sessionStorage for persistence
      updateSessionStorage(vendorData);

      toast.success(result.message || "Login successful");
      setIsNavigating(true);
      setTimeout(() => router.push("/vendor"), 1200);
    } catch (err: any) {
      toast.error("Unexpected error: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch vendor details");
    }
    return result.data;
  };

  const updateSessionStorage = (vendorData: any) => {
    if (vendorData.vendor) {
      sessionStorage.setItem("vendor_id", vendorData.vendor.id);
      sessionStorage.setItem("business_type", vendorData.vendor.business_type);
      sessionStorage.setItem("company_name", vendorData.vendor.company_name);
      sessionStorage.setItem("plan", vendorData.vendor.plan);
      sessionStorage.setItem("email", vendorData.vendor.contact_email);
      sessionStorage.setItem("contact_name", vendorData.vendor.contact_name);
      sessionStorage.setItem("plan_id", vendorData.vendor.plan_id);
    } else if (vendorData.vendorUser) {
      sessionStorage.setItem("vendor_id", vendorData.vendorUser.vendor_id);
      sessionStorage.setItem("contact_name", vendorData.vendorUser.first_name);
      sessionStorage.setItem("email", vendorData.vendorUser.email);
    }
  };

  const handleResetPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/send-reset-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Failed to send reset link");
        return;
      }

      toast.success(result.message || "Reset link sent to your email");
      setResetEmail("");
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error("Unexpected error: " + (err.message || "Please try again"));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-primary/10 filter blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 rounded-full bg-secondary/10 filter blur-3xl -bottom-20 -right-20 animate-pulse"></div>
          <div className="absolute w-72 h-72 rounded-full bg-accent/10 filter blur-2xl top-1/3 left-1/2 animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-xl max-w-md w-full relative z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="card-body p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="avatar flex justify-center mb-6"
            >
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image src="/medusaLogo.png" alt="Logo" width={96} height={96} priority />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card-title text-2xl font-bold text-center justify-center"
            >
              Welcome Back
            </motion.h2>

            <form onSubmit={handleSubmit} method="post" className="space-y-6 mt-6">
              <motion.label
                className="form-control"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)}
                  className={`input input-bordered w-full ${emailError ? "input-error" : ""}`}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
                {emailError && (
                  <div className="label">
                    <span className="label-text-alt text-error">{emailError}</span>
                  </div>
              )}
              </motion.label>

              <motion.label
                className="form-control"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="label">
                  <span className="label-text">Password</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDialogOpen(true);
                    }}
                    className="label-text-alt link link-hover text-primary"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validatePassword(password)}
                    className={`input input-bordered w-full pr-10 ${passwordError ? "input-error" : ""}`}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/70 hover:text-primary transition-colors"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <div className="label">
                    <span className="label-text-alt text-error">{passwordError}</span>
                  </div>
                )}
              </motion.label>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="form-control mt-6"
              >
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </motion.div>
            </form>

            <div className="divider mt-6">OR</div>
            <div className="text-center">
              <p className="text-base-content/70 mb-4">{"Don't have an account?"}</p>
              <Link href="/plans" className="btn btn-outline btn-primary">
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>

        {isDialogOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Reset Password</h3>
              <p className="py-4">Enter your email to receive a password reset link.</p>
              <form onSubmit={handleResetPasswordRequest} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                    disabled={resetLoading}
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                    {resetLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={resetLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <LoadingOverlay isLoading={isNavigating} />
    </>
  );
};

export default LoginForm;