"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import useVendorLogin from "../hooks/auth/useVendorLogin";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
        toast.success("Vendor login successful", { duration: 1000 });
        setTimeout(() => {
          router.push("/vendor/orders");
        }, 1200);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to Login", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500">
        {/* Animated Wave Background */}
        <div className="absolute inset-0 z-0">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

        {/* Subtle Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

        <div className="relative flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="mb-8"
            >
              <Image
                src="/medusaLogo.png"
                alt="Logo"
                className="h-20 w-20 mx-auto rounded-full shadow-lg"
                width={80}
                height={80}
                priority
              />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-white mb-6"
            >
              Login
            </motion.h2>
            <form onSubmit={handleSubmit} method="post" className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)}
                  required
                  className="input input-ghost w-full text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-white rounded-xl"
                  placeholder="Enter Email"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validatePassword(password)}
                  required
                  className="input input-ghost w-full pr-10 text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-white rounded-xl"
                  placeholder="Enter Password"
                  aria-label="Enter Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-gray-200 transition duration-200"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center space-y-4"
              >
                <button
                  type="submit"
                  className="btn w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Continue"
                  )}
                </button>
                {error && (
                  <div className="alert alert-error w-full text-center">
                    <p>{error}</p>
                  </div>
                )}
                <p className="text-white text-sm">
                {"Don't have an account?"}{" "}
                  <Link href="/" className="link hover:underline">
                    Join Us
                  </Link>
                </p>
                <p className="text-white text-sm">
                  <Link href="/forgot-password" className="link hover:underline">
                    Forgot Password?
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;