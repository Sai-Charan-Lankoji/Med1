"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NEXT_URL } from "@/app/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${NEXT_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Password reset link sent to your email!" });
        setEmail("");
        setTimeout(() => router.push("/"), 3000); // Fixed redirect path
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send reset link" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Forgot Password</h2>
          <p className="text-center text-base-content/70 mb-6">
            Enter your email to receive a password reset link
          </p>

          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6`}>
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input input-bordered w-full"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-base-content/70">Remembered your password?</span>{" "}
            <Link href="/" className="btn btn-link p-0 h-auto">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}