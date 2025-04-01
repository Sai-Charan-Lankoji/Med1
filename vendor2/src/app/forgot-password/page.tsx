"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import medusaIcon from "../../../public/medusaIcon.jpeg";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error(t("Invalid or missing reset token"), { duration: 4000 });
    }
  }, [token, t]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(t("Please fill in all fields"), { duration: 4000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("Passwords do not match"), { duration: 4000 });
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("Password must be at least 8 characters"), { duration: 4000 });
      return;
    }
    if (!token) {
      toast.error(t("Invalid or missing reset token"), { duration: 4000 });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases from the backend
        const errorMessage = result.error?.details || result.message || t("Failed to reset password");
        switch (result.status) {
          case 400:
            if (result.error?.code === "VALIDATION_ERROR") {
              toast.error(t("Invalid request: ") + errorMessage, { duration: 4000 });
            } else if (result.error?.code === "INVALID_DATA") {
              toast.error(t("Invalid token or password: ") + errorMessage, { duration: 4000 });
            }
            break;
          case 404:
            toast.error(t("Email not found"), { duration: 4000 });
            break;
          case 500:
            toast.error(t("Server error: ") + errorMessage, { duration: 4000 });
            break;
          default:
            toast.error(errorMessage, { duration: 4000 });
        }
        return;
      }

      // Success case
      toast.success(result.message || t("Password reset successfully"), { duration: 4000 });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(t("Unexpected error: ") + (err.message || "Please try again"), { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
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
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
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
              {t("Reset Password")}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">{t("New Password")}</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("New Password")}
                  className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 top-8 flex items-center text-base-content hover:text-primary transition duration-200"
                  aria-label={showPassword ? t("Hide Password") : t("Show Password")}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("Confirm Password")}</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("Confirm Password")}
                  className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
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
    </>
  );
};

export default ForgotPasswordPage;