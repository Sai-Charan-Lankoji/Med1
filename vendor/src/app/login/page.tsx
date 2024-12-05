'use client'

import React, { useState } from "react"
import { EyeMini, EyeSlashMini, Loader } from "@medusajs/icons"
import medusaIcon from "../../../public/medusaIcon.jpeg"
import Image from "next/image"
import { useVendorLogin } from "../hooks/auth/useVendorLogin"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Component() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useVendorLogin()
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      // Error handling is done in the useVendorLogin hook
    }
  }

  return (
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
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <Image
              src={medusaIcon}
              alt="Medusa Logo"
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
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Enter Email"
              />
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
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Enter Password"
                aria-label="Enter Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-black hover:text-blue-800 transition duration-200"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeMini className="w-5 h-5" />
                ) : (
                  <EyeSlashMini className="w-5 h-5" />
                )}
              </button>
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center space-y-4"
            >
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : "Continue"}
              </button>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-center p-3 rounded-lg bg-red-500/20 border border-red-500/50"
                >
                  <p className="text-red-200">{error}</p>
                </motion.div>
              )}
              <p className="text-white text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/" className="text-white font-semibold hover:underline">
                  Join Us 
                </Link>
              </p>
              <p className="text-white text-sm">
                <Link href="/forgot-password" className="text-white font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}