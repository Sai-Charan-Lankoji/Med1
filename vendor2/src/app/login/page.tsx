"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import useVendorLogin from "../hooks/auth/useVendorLogin";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, error } = useVendorLogin();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required", { duration: 3000 });
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful", { duration: 1000 });
        setIsNavigating(true);
        setTimeout(() => {
          router.push("/vendor/products");
        }, 1200);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to login", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
        {/* Decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-primary/10 filter blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 rounded-full bg-secondary/10 filter blur-3xl -bottom-20 -right-20 animate-pulse"></div>
          <div className="absolute w-72 h-72 rounded-full bg-accent/10 filter blur-2xl top-1/3 left-1/2 animate-pulse"></div>
        </div>
        
        {/* Card container */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-xl max-w-md w-full"
        >
          {/* Card accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="card-body p-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="avatar flex justify-center mb-6"
            >
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src="/medusaLogo.png"
                  alt="Logo"
                  width={96}
                  height={96}
                  priority
                />
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card-title text-2xl font-bold text-center justify-center"
            >
              Welcome Back
            </motion.h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit} method="post" className="space-y-4 mt-6">
              {/* Email Field */}
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
              
              {/* Password Field */}
              <motion.label 
                className="form-control"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="label">
                  <span className="label-text">Password</span>
                  <Link href="/forgot-password" className="label-text-alt link link-hover text-primary">
                    Forgot Password?
                  </Link>
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
              
              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="form-control mt-6"
              >
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </motion.div>
              
              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="alert alert-error mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </form>
            
            {/* Divider and signup option */}
            <div className="divider mt-6">OR</div>
            
            <div className="text-center">
              <p className="text-base-content/70 mb-4">{"Don't have an account?"}</p>
              <Link href="/plans" className="btn btn-outline btn-primary">
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Loading overlay for navigation */}
      <LoadingOverlay isLoading={isNavigating} />
    </>
  );
};

export default LoginForm;