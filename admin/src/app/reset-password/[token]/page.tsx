//sec/app/reset-password/[token]/page.tsx';

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; server?: string }>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  const passwordCriteria = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  useEffect(() => {
    if (touched.password || touched.confirmPassword) {
      validateForm(false);
    }
  }, [password, confirmPassword, touched]);

  const validateForm = (isSubmitting = true) => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (isSubmitting && !passwordCriteria.hasUppercase) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (isSubmitting && !passwordCriteria.hasNumber) {
      newErrors.password = "Password must contain at least one number";
    } else if (isSubmitting && !passwordCriteria.hasSpecialChar) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    setLoading(true);
    setMessage(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Password reset successfully! Redirecting to login..." });
        setTimeout(() => router.push("/"), 3000);
      } else {
        setErrors({ server: data.error || "Failed to reset password" });
      }
    } catch {
      setErrors({ server: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-center text-base-content/70 mb-6">Enter your new password</p>

          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6`}>
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{message.text}</span>
            </div>
          )}
          {errors.server && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  className={`input input-bordered w-full ${touched.password && errors.password ? "input-error" : ""}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-base-content/50" /> : <Eye className="h-4 w-4 text-base-content/50" />}
                </button>
              </div>
              {touched.password && errors.password && <span className="text-error text-sm mt-1">{errors.password}</span>}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm">
                    <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${passwordCriteria.minLength ? "bg-success" : "bg-neutral"}`}>
                      {passwordCriteria.minLength && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordCriteria.minLength ? "text-success" : "text-base-content/50"}>At least 6 characters</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${passwordCriteria.hasUppercase ? "bg-success" : "bg-neutral"}`}>
                      {passwordCriteria.hasUppercase && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordCriteria.hasUppercase ? "text-success" : "text-base-content/50"}>At least one uppercase letter</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${passwordCriteria.hasNumber ? "bg-success" : "bg-neutral"}`}>
                      {passwordCriteria.hasNumber && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordCriteria.hasNumber ? "text-success" : "text-base-content/50"}>At least one number</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${passwordCriteria.hasSpecialChar ? "bg-success" : "bg-neutral"}`}>
                      {passwordCriteria.hasSpecialChar && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordCriteria.hasSpecialChar ? "text-success" : "text-base-content/50"}>At least one special character</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="confirm-password" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••"
                  className={`input input-bordered w-full ${touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}`}
                  disabled={loading}
                  required
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="text-error text-sm mt-1">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="btn btn-link p-0 h-auto">Back to Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}