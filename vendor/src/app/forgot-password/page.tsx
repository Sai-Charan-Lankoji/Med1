"use client";

import React, { useState } from "react";
import { EyeMini, EyeSlashMini, Loader } from "@medusajs/icons";
import medusaIcon from "../../../public/medusaIcon.jpeg";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useResetPassword } from "../hooks/auth/useResetPassword";
import { Toaster, toast } from "@medusajs/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const { mutate, isLoading, isError, isSuccess, error } = useResetPassword();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      toast.info("Info", {
        description: "Please enter all details",
        duration: 5000
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning("Warning", {
        description: "Passwords don't match",
        duration: 5000
      });
      return;
    }
    mutate(
      { email, newPassword },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "Password reset successfully!",
            duration: 5000
          });
        },
        onError: (error) => {
          toast.error("Error", {
            description: error.message || "Failed to reset password",
            duration: 5000
          });
        }
      }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500">
      <Toaster position="top-right" />
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
              src={medusaIcon}
              alt={t("medusaLogo")}
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
            {t("Forgot Password")}
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your email")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder={t("New Password")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-white hover:text-blue-200 transition duration-200"
                aria-label={
                  showPassword ? t("Hide Password") : t("Show Password")
                }
              >
                {showPassword ? <EyeMini /> : <EyeSlashMini />}
              </button>
            </div>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t("Confirm Password")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-xl bg-white text-teal-600 font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {isLoading ? <Loader className="animate-spin mx-auto" /> : t("Reset Password")}
            </button>
          </form>
          <p className="text-white text-sm mt-4 text-center">
            {t("Remembered your password?")}{" "}
            <Link href="/login" className="font-semibold hover:underline">
              {t("Login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

