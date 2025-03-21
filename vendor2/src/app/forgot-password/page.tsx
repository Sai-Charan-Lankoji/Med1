"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import medusaIcon from "../../../public/medusaIcon.jpeg";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useResetPassword } from "../hooks/auth/useResetPassword";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const { resetPassword, isLoading, data, error } = useResetPassword();

  // Handle success and error feedback
  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || t("Failed to reset password"));
      setSuccessMessage(null);
    }
    if (data) {
      setSuccessMessage(data.message || t("Password reset successfully"));
      setErrorMessage(null);
      // Reset form fields on success
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [data, error, t]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage(t("Please fill in all fields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(t("Passwords do not match"));
      return;
    }

    resetPassword({ email, newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mb-6"
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
            className="text-3xl font-bold text-center text-base-content mb-6"
          >
            {t("Forgot Password")}
          </motion.h2>

          {/* Error and Success Messages */}
          {errorMessage && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success shadow-lg mb-4">
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your email")}
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
              />
            </div>
            <div className="form-control relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder={t("New Password")}
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-base-content hover:text-primary transition duration-200"
                aria-label={showPassword ? t("Hide Password") : t("Show Password")}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            <div className="form-control">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t("Confirm Password")}
                className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t("Reset Password")}
            </button>
          </form>
          <p className="text-base-content text-sm mt-4 text-center">
            {t("Remembered your password?")}{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t("Login")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;