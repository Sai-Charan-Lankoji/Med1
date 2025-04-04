"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NEXT_URL } from "@/app/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    server?: string;
    forgotPassword?: string;
  }>({});
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const router = useRouter();

  // Validate email format
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Simplified validation without password criteria
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isEmailValid(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm(); // Validate on blur
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (validateForm()) {
      try {
        const response = await fetch(`${NEXT_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("auth_token", data.token);
          toast.success("Login Successful!");
          setTimeout(() => {
            router.push("/admin/vendors");
          }, 1500);
        } else {
          toast.error(data.error || "Login Failed");
          setErrors({ server: data.error || "Login Failed" });
        }
      } catch {
        toast.error("Something went wrong. Please try again later.");
        setErrors({ server: "Something went wrong. Please try again later." });
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage(null);
    setErrors((prev) => ({ ...prev, forgotPassword: undefined }));

    if (!forgotEmail) {
      setErrors({ forgotPassword: "Email is required" });
      setForgotPasswordLoading(false);
      return;
    }
    if (!isEmailValid(forgotEmail)) {
      setErrors({ forgotPassword: "Please enter a valid email address" });
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(`${NEXT_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setForgotPasswordMessage({ type: "success", text: "Password reset link sent to your email!" });
        setForgotEmail("");
        setTimeout(() => {
          setIsForgotPasswordModalOpen(false);
          setForgotPasswordMessage(null);
        }, 3000);
      } else {
        setErrors({ forgotPassword: data.error || "Failed to send reset link" });
      }
    } catch {
      setErrors({ forgotPassword: "Something went wrong. Please try again later." });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer />
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <h1 className="text-5xl font-bold mb-6">Vendor Hub</h1>
          <p className="text-xl">Empowering Vendors, One Dashboard at a Time</p>
          <div className="mt-12 space-y-4 opacity-85">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <p className="text-left">Streamlined vendor management</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <p className="text-left">Secure and reliable platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-left">24/7 support and assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-base-100 p-4 md:p-8">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center">Welcome back</h2>
            <p className="text-center text-base-content/70 mb-6">Enter your credentials to access your account</p>

            {errors.server && (
              <div className="alert alert-error mb-6">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.server}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  {touched.email && !errors.email && email && (
                    <div className="flex items-center text-success text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span>Valid email</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="name@example.com"
                    className={`input input-bordered w-full ${touched.email && errors.email ? "input-error" : ""}`}
                    aria-invalid={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="h-4 w-4 text-error" />
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <span className="text-error text-sm mt-1">{errors.email}</span>
                )}
              </div>

              <div className="form-control">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <button
                    type="button"
                    className="btn btn-link btn-xs p-0 h-auto"
                    onClick={() => setIsForgotPasswordModalOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="••••••••"
                    className={`input input-bordered w-full ${touched.password && errors.password ? "input-error" : ""}`}
                    aria-invalid={touched.password && !!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-base-content/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-base-content/50" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="text-error text-sm mt-1">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Sign in
              </button>
            </form>

           
          </div>
        </div>
      </div>

      {isForgotPasswordModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Forgot Password</h3>
            <p className="py-4">Enter your email to receive a password reset link</p>

            {forgotPasswordMessage && (
              <div className={`alert ${forgotPasswordMessage.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
                {forgotPasswordMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{forgotPasswordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="forgot-email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`input input-bordered w-full ${errors.forgotPassword ? "input-error" : ""}`}
                  disabled={forgotPasswordLoading}
                />
                {errors.forgotPassword && (
                  <span className="text-error text-sm mt-1">{errors.forgotPassword}</span>
                )}
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsForgotPasswordModalOpen(false)}
                  disabled={forgotPasswordLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}