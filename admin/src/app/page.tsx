// app/page.tsx
"use client"; // Mark as Client Component since we need hooks

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { NEXT_URL } from "@/app/constants"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const router = useRouter();

  // Client-side validation
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          router.push("/admin/vendors");
        } else { 
          const errorData = await response.json();
          setErrors({ server: errorData.error || "Login failed" });
        }
      } catch {
        setErrors({ server: "Something went wrong" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Company Banner */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold animate-pulse">VendorSync</h1>
          <p className="mt-4 text-lg">Empowering Vendors, One Dashboard at a Time</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="card w-full max-w-md bg-white shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          {errors.server && <p className="text-red-500 text-center mb-4">{errors.server}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`input input-bordered w-full pr-12 ${errors.password ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-12 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <span className="text-2xl animate-bounce">🙈</span>
                ) : (
                  <span className="text-2xl animate-bounce">🐵</span>
                )}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}