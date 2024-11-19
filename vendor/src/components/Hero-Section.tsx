import React from 'react';
import { Layers, ShoppingBag, Palette, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px] pointer-events-none" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-400 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      
      <div className="relative container mx-auto px-4 py-20 sm:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="relative">
            <h1 className="text-white text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Create Your Dream Online Store in Minutes
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
            Launch your e-commerce empire with our powerful store builder. Choose from premium templates or create your custom design.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
            {[
              { icon: ShoppingBag, title: "E-commerce Templates", description: "Ready-to-use designs for quick launch" },
              { icon: Layers, title: "Grocery Store Themes", description: "Specialized layouts for food retail" },
              { icon: Palette, title: "Custom T-Shirt Design", description: "Interactive product customization" }
            ].map((feature, index) => (
              <div key={index} className="group flex flex-col items-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105">
                <feature.icon className="w-12 h-12 mb-4 text-white group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-12 justify-center mt-12">
            {[
              { label: "Active Stores", value: "10,000+" },
              { label: "Templates", value: "50+" },
              { label: "Happy Customers", value: "25,000+" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Link 
              href="/plans"
              className="group inline-flex items-center px-8 py-4 rounded-full bg-white text-purple-600 font-semibold text-lg hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Join Us Today
              <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/80 text-sm font-medium">
            <span className="flex items-center"><span className="mr-2 text-xl">🔒</span> Secure Payments</span>
            <span className="flex items-center"><span className="mr-2 text-xl">⚡</span> Quick Setup</span>
            <span className="flex items-center"><span className="mr-2 text-xl">🛟</span> 24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}