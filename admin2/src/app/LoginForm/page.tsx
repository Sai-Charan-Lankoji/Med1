'use client';
import React, { useState } from 'react';
import { EyeMini, EyeSlashMini, Loader } from '@medusajs/icons';
import medusaIcon from  "../../../public/medusaIcon.jpeg"
import Image from 'next/image';
import { useAdminLogin } from '@/app/hooks/auth/useAdminLogin';
import { motion } from 'framer-motion';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAdminLogin();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-600 via-gray-400 to-gray-800">
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
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
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
            Admin Login
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Enter Email"
                disabled={loading}
              />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Enter Password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-black hover:text-blue-800 transition duration-200"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeMini className="w-5 h-5" /> : <EyeSlashMini className="w-5 h-5" />}
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
                className="w-full px-6 py-3 rounded-xl bg-white text-gray-800 font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : 'Continue'}
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
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}