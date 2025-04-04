"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Store,
  ShoppingBag,
  BarChart3,
  Package,
  ArrowRight,
  Check,
  Users,
  CreditCard,
  TrendingUp,
  ChevronRight,
  Shirt,
  Truck,
  Palette,
  Layers,
  Globe,
  Clock,
  DollarSign,
  Banknote,
  LayoutGrid,
  Plane,
  Mail,
  PackageOpen,
} from "lucide-react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import DemoRequestModal from "./DemoRequest"

export default function LandingPage() {
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Scroll animation references
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  // Scroll-triggered animation hooks
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [testimonialRef, testimonialInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [designModuleRef, designModuleInView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [integrationsRef, integrationsInView] = useInView({ threshold: 0.2, triggerOnce: true })

  // Add this state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  return (
    <>
      {/* Hero Section */}
      <div className="hero min-h-[90vh] bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="hero-content flex-col gap-12 lg:flex-row-reverse max-w-7xl mx-auto pt-10">
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-base-300  shadow-xl relative">
              <div className="bg-base-100 p-4 border-b border-base-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
              </div>
              <Image
                src="https://media.istockphoto.com/id/1061329140/photo/devices-on-wooden-fllor-creativity-website.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ddlh7wAltdql0GskzDOJUZVzWX7UeQOA-Yy1jd4KkOo="
                alt="Vendor dashboard preview"
                width={800}
                height={500}
                className="w-full h-auto object-cover aspect-[16/10]" // Added aspect ratio and height control
              />
              {/* Floating UI Elements */}
              {/* Monthly Revenue - Top Right */}
              <motion.div
                className="absolute top-0 right-0 md:-top-4 md:-right-10 lg:-top-6 lg:-right-14 p-3 md:p-4 bg-base-100 rounded-xl shadow-lg border border-base-200 rotate-3 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-success/10 text-success rounded-full">
                    <TrendingUp size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs opacity-70">Monthly Revenue</p>
                    <p className="font-bold text-xs md:text-sm">$12,458.50</p>
                  </div>
                </div>
              </motion.div>

              {/* New Orders - Bottom Left */}
              <motion.div
                className="absolute bottom-0 left-0 md:-bottom-4 md:-left-6 lg:-bottom-6 lg:-left-8 p-3 md:p-4 bg-base-100 rounded-xl shadow-lg border border-base-200 rotate-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-primary/10 text-primary rounded-full">
                    <Package size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs opacity-70">New Orders</p>
                    <p className="font-bold text-xs md:text-sm">24 Today</p>
                  </div>
                </div>
              </motion.div>

              {/* Active Customers - Bottom Right */}
              <motion.div
                className="absolute bottom-0 right-0 md:-bottom-4 md:-right-10 lg:-bottom-6 lg:-right-14 p-3 md:p-4 bg-base-100 rounded-xl shadow-lg border border-base-200 -rotate-2 z-30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-secondary/10 text-secondary rounded-full">
                    <Users size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs opacity-70">Active Customers</p>
                    <p className="font-bold text-xs md:text-sm">1,234</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="max-w-2xl" variants={containerVariant} initial="hidden" animate="visible">
            <motion.div variants={itemVariant}>
              <div className="badge badge-primary mb-4">All-in-One Platform</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Effortless 
                <span className="text-primary block">E-commerce</span> Management
              </h1>
              <p className="py-6 text-lg text-base-content/70">
                Empower vendors to create stunning e-commerce websites with custom t-shirt design tools, payment
                gateways, and shipping integrations—all from one intuitive dashboard.
              </p>
            </motion.div>
            <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-4">
              <Link href="/plans" className="btn btn-primary">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button onClick={() => setIsDemoModalOpen(true)} className="btn btn-outline">
                Request Demo
              </button>
            </motion.div>
            <motion.div variants={itemVariant} className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="badge badge-sm p-1 badge-success">
                  <Check size={12} />
                </div>
                <span className="text-sm">Transparent pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-sm p-1 badge-success">
                  <Check size={12} />
                </div>
                <span className="text-sm">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-sm p-1 badge-success">
                  <Check size={12} />
                </div>
                <span className="text-sm">Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-12 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-lg font-medium text-base-content/70 mb-8">Trusted by 1,000+ businesses</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { name: "ShopTrend", icon: <Store className="h-6 w-6" /> },
              { name: "GearZone", icon: <Package className="h-6 w-6" /> },
              { name: "JewelCraft", icon: <Palette className="h-6 w-6" /> },
              { name: "EcoMart", icon: <Globe className="h-6 w-6" /> },
              { name: "TechBit", icon: <Layers className="h-6 w-6" /> },
            ].map((brand, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {brand.icon}
                <span className="font-bold">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* T-Shirt Design Module Section */}
      <div ref={designModuleRef} className="py-20 bg-base-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            animate={designModuleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="lg:w-1/2"
              initial={{ x: -50 }}
              animate={designModuleInView ? { x: 0 } : { x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="badge badge-secondary mb-4">Featured Module</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Custom T-Shirt Design Studio</h2>
              <p className="text-lg text-base-content/70 mb-6">
                Empower your customers with our drag-and-drop t-shirt design tool. Let them create personalized apparel
                with ease, boosting your sales and customer satisfaction.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Intuitive drag-and-drop interface",
                  "Hundreds of pre-made templates and designs",
                  "Text, image, and clipart customization",
                  "Real-time preview of the final product",
                  "Seamless integration with your existing store",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={designModuleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Check className="h-5 w-5 text-success mt-1" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="https://vendorhub.vercel.app/dashboard" className="btn btn-primary">
                See Designer Demo
              </Link>
            </motion.div>
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ x: 50 }}
              animate={designModuleInView ? { x: 0 } : { x: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-base-200 rounded-xl p-4 shadow-xl">
                <div className="bg-base-100 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <div className="ml-4 text-sm opacity-70">T-Shirt Designer</div>
                  </div>
                </div>
                <Image
                  src="/custom.png"
                  alt="T-Shirt Design Module"
                  width={800}
                  height={600}
                  className="rounded-lg w-full"
                />
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-base-100 p-3 rounded-lg shadow-lg border border-base-200"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={designModuleInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <Shirt className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-bold">Design Studio</p>
                      <p className="text-xs opacity-70">Drag & Drop Interface</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Key Features Section */}
      <div ref={featuresRef} className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Streamline your operations with tools designed to save time and boost growth.
            </p>
          </div>
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerVariant}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: <Store className="h-6 w-6" />,
                title: "Multi-Store Management",
                description: "Run multiple storefronts with unique branding and inventory from one central hub.",
              },
              {
                icon: <ShoppingBag className="h-6 w-6" />,
                title: "Product Management",
                description: "Add and organize products effortlessly with bulk uploads and variants.",
              },
              {
                icon: <Package className="h-6 w-6" />,
                title: "Order Processing",
                description: "Automate order tracking and updates for faster fulfillment.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Customer Management",
                description: "Build stronger relationships with detailed customer insights.",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Analytics Dashboard",
                description: "Monitor sales and trends in real-time to optimize performance.",
              },
              {
                icon: <CreditCard className="h-6 w-6" />,
                title: "Payment Integration",
                description: "Offer secure payments with top gateways like Stripe and PayPal.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                whileHover={{ y: -5 }}
                className="card bg-base-100 border border-base-200 hover:shadow-md transition-all"
              >
                <div className="card-body">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">{feature.icon}</div>
                  <h3 className="card-title text-xl">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Integrations Section */}
      <div ref={integrationsRef} className="py-20 bg-base-100 overflow-hidden">
  <div className="container mx-auto px-4">
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={integrationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Integrations</h2>
      <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
        Connect with the tools you already use to create a seamless workflow.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto relative">
      {/* Floating Integration Icons */}
      {/* <motion.div 
        className="absolute -top-12 left-[20%] hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={integrationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div className="avatar avatar-placeholder">
          <div className="bg-primary/10 text-primary rounded-full w-12">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute -top-4 right-[30%] hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={integrationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <div className="avatar placeholder">
          <div className="bg-success/10 text-success rounded-full w-10">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[10%] left-[10%] hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={integrationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <div className="avatar placeholder">
          <div className="bg-warning/10 text-warning rounded-full w-10">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[20%] right-[5%] hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={integrationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        <div className="avatar placeholder">
          <div className="bg-secondary/10 text-secondary rounded-full w-12">
            <Globe className="w-6 h-6" />
          </div>
        </div>
      </motion.div> */}

      {/* Payment Gateways */}
      <motion.div
        className="card card-border bg-base-100 hover:shadow-lg transition-all overflow-hidden"
        initial={{ opacity: 0, x: -30 }}
        animate={integrationsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="card-title text-xl">Payment Gateways</h3>
          </div>
          <p className="mb-6 text-base-content/70">
            Offer your customers flexible payment options with our seamless payment gateway integrations.
          </p>
          
          {/* Payment Gateway Logos */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { name: "Stripe", icon: <CreditCard className="w-8 h-8" />, color: "primary" },
              { name: "PayPal", icon: <DollarSign className="w-8 h-8" />, color: "info" },
              { name: "Razorpay", icon: <Banknote className="w-8 h-8" />, color: "success" },
              { name: "PayU", icon: <LayoutGrid className="w-8 h-8" />, color: "warning" },
              { name: "Paytm", icon: <Globe className="w-8 h-8" />, color: "error" },
              { name: "Cashfree", icon: <CreditCard className="w-8 h-8" />, color: "secondary" }
            ].map((gateway, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={integrationsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`avatar placeholder p-2 bg-${gateway.color}/10 rounded-xl`}>
                  <div className={`text-${gateway.color}`}>
                    {gateway.icon}
                  </div>
                </div>
                <span className="text-xs mt-2">{gateway.name}</span>
              </motion.div>
            ))}
          </div>
          
          {/* <Link href="/payment-integrations" className="btn btn-sm btn-outline">
            View All Payment Options
          </Link> */}
        </div>
      </motion.div>

      {/* Shipping Providers */}
      <motion.div
        className="card card-border bg-base-100 hover:shadow-lg transition-all overflow-hidden"
        initial={{ opacity: 0, x: 30 }}
        animate={integrationsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="card-title text-xl">Shipping Providers</h3>
          </div>
          <p className="mb-6 text-base-content/70">
            Streamline your shipping process with our integrated shipping provider solutions.
          </p>
          
          {/* Shipping Provider Logos */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { name: "DHL", icon: <Truck className="w-8 h-8" />, color: "warning" },
              { name: "Delhivery", icon: <Plane className="w-8 h-8" />, color: "primary" },
              { name: "Shiprocket", icon: <Package className="w-8 h-8" />, color: "error" },
              { name: "DTDC", icon: <Mail className="w-8 h-8" />, color: "info" },
              { name: "FedEx", icon: <BarChart3 className="w-8 h-8" />, color: "success" },
              { name: "Bluedart", icon: <PackageOpen className="w-8 h-8" />, color: "secondary" }
            ].map((shipper, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={integrationsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`avatar placeholder p-2 bg-${shipper.color}/10 rounded-xl`}>
                  <div className={`text-${shipper.color}`}>
                    {shipper.icon}
                  </div>
                </div>
                <span className="text-xs mt-2">{shipper.name}</span>
              </motion.div>
            ))}
          </div>
          
          {/* <Link href="/shipping-integrations" className="btn btn-sm btn-outline">
            View All Shipping Options
          </Link> */}
        </div>
      </motion.div>
    </div>
  </div>
</div>

      {/* Stock Management Section */}
      <div className="py-20 bg-base-200 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row-reverse items-center gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="lg:w-1/2"
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="badge badge-primary mb-4">Inventory Control</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Smart Stock Management</h2>
              <p className="text-lg text-base-content/70 mb-6">
                Take control of your inventory with our advanced stock management system. Track products, manage
                variants, and never oversell again.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Real-time inventory tracking across all channels",
                  "Automated low-stock alerts and reordering",
                  "Batch inventory updates and stock adjustments",
                  "Barcode scanning for quick stock counts",
                  "Detailed inventory reports and forecasting",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Check className="h-5 w-5 text-success mt-1" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
              {/* <Link href="/inventory-management" className="btn btn-primary">
                Explore Inventory Tools
              </Link> */}
            </motion.div>
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-base-100 rounded-xl p-4 shadow-xl">
                <div className="bg-base-200 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <div className="ml-4 text-sm opacity-70">Inventory Dashboard</div>
                  </div>
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydCUyMGRlc2lnbmluZyUyMHdlYnNpdGV8ZW58MHx8MHx8fDA%3D"
                  alt="Inventory Management Dashboard"
                  width={800}
                  height={600}
                  className="rounded-lg w-full"
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-base-100 p-3 rounded-lg shadow-lg border border-base-200"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-bold">Stock Tracker</p>
                      <p className="text-xs opacity-70">Real-time Updates</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Vendor Analytics Section */}
      <div className="py-20 bg-base-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="badge badge-secondary mx-auto mb-4">Data-Driven Decisions</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Vendor Analytics</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Gain valuable insights into your business performance with comprehensive analytics and reporting tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="card bg-base-100 border border-base-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-body">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="card-title text-xl">Sales Analytics</h3>
                <p className="text-base-content/70">
                  Track revenue, order volume, and product performance across all your sales channels.
                </p>
                <div className="mt-4">
                  <Image
                    src="https://picsum.photos/300/150?random=3"
                    alt="Sales Analytics Chart"
                    width={300}
                    height={150}
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card bg-base-100 border border-base-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-body">
                <div className="p-3 rounded-lg bg-secondary/10 w-fit mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="card-title text-xl">Customer Insights</h3>
                <p className="text-base-content/70">
                  Understand your customers better with detailed demographics and purchasing behavior.
                </p>
                <div className="mt-4">
                  <Image
                    src="https://picsum.photos/300/150?random=4"
                    alt="Customer Insights Chart"
                    width={300}
                    height={150}
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card bg-base-100 border border-base-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-body">
                <div className="p-3 rounded-lg bg-success/10 w-fit mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="card-title text-xl">Growth Metrics</h3>
                <p className="text-base-content/70">
                  Monitor your business growth with key performance indicators and trend analysis.
                </p>
                <div className="mt-4">
                  <Image
                    src="https://picsum.photos/300/150?random=5"
                    alt="Growth Metrics Chart"
                    width={300}
                    height={150}
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-12">
            {/* <Link href="/analytics" className="btn btn-outline btn-wide">
              Explore Analytics Features
            </Link> */}
          </div>
        </div>
      </div>

      
      {/* Stats Section */}
<div ref={statsRef} className="py-16 bg-base-200">
  <div className="container mx-auto px-4">
    <motion.h2
      className="text-3xl font-bold text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      Results That Speak for Themselves
    </motion.h2>
    
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="stats stats-vertical md:stats-horizontal shadow bg-base-100">
        <div className="stat place-items-center">
          <div className="stat-figure text-primary">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Sales Growth</div>
          <div className="stat-value text-primary">
            {statsInView && <CountUp end={42} suffix="%" duration={2} />}
          </div>
          <div className="stat-desc">In the first year</div>
        </div>
        
        <div className="stat place-items-center">
          <div className="stat-figure text-secondary">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-title">Time Saved</div>
          <div className="stat-value text-secondary">
            {statsInView && <CountUp end={15} suffix="hrs" duration={2} />}
          </div>
          <div className="stat-desc">Per week</div>
        </div>
        
        <div className="stat place-items-center">
          <div className="stat-figure text-accent">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Customer Retention</div>
          <div className="stat-value text-accent">
            {statsInView && <CountUp end={89} suffix="%" duration={2} />}
          </div>
          <div className="stat-desc">After 3 months</div>
        </div>
      </div>
    </motion.div>
  </div>
</div>

      {/* Testimonials Section */}
      <div ref={testimonialRef} className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            What Vendors Are Saying
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Retailer",
                image: "https://picsum.photos/100/100?random=6",
                quote:
                  "Vendor Hub boosted our sales by 35% and cut inventory time in half. The t-shirt designer is a game-changer for our business.",
              },
              {
                name: "Michael Chen",
                role: "Electronics Vendor",
                image: "https://picsum.photos/100/100?random=7",
                quote:
                  "The analytics helped us double our margins in just months. Stripe integration was seamless and saved us weeks of development.",
              },
              {
                name: "Priya Patel",
                role: "Jewelry Designer",
                image: "https://picsum.photos/100/100?random=8",
                quote:
                  "Managing two stores has never been this easy. The shipping integrations with DHL have streamlined our entire fulfillment process.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="card card-border bg-base-100 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="card-body">
                <div className="rating rating-sm mb-4">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-warning" defaultChecked />
                    ))}
                  </div>
                  <p className="mb-6 italic">&ldquo;{testimonial.quote}&ldquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-base-content/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div ref={targetRef} className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div className="card max-w-3xl mx-auto bg-base-100 shadow-xl" >
            <div className="card-body p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Start Growing Today</h2>
              <p className="text-lg mb-6 text-base-content/70">
                Pick a plan and unlock the tools to scale your e-commerce business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/plans" className="btn btn-primary btn-lg">
                  Grow with Us <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
                <button onClick={() => setIsDemoModalOpen(true)} className="btn btn-outline btn-lg">
                  Request Demo
                </button>
              </div>
              <p className="mt-4 text-sm text-base-content/50">30-day money-back guarantee</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer lg:footer-horizontal  p-10 bg-neutral text-neutral-content">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Store className="h-8 w-8" />
            <span className="text-xl font-bold">Vendor Hub</span>
          </div>
          <p>Simplifying e-commerce since 2022</p>
          <p>© 2025 Vendor Hub. All rights reserved.</p>
          <div className="mt-4 flex gap-4">
            <a href="#" className="btn btn-circle btn-outline btn-sm">
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
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="btn btn-circle btn-outline btn-sm">
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
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="btn btn-circle btn-outline btn-sm">
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
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <span className="footer-title">Platform</span>
          <Link href="/features" className="link link-hover">
            Features
          </Link>
          <Link href="/pricing" className="link link-hover">
            Pricing
          </Link>
          <Link href="/integrations" className="link link-hover">
            Integrations
          </Link>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <Link href="/about" className="link link-hover">
            About
          </Link>
          <Link href="/team" className="link link-hover">
            Team
          </Link>
          <Link href="/careers" className="link link-hover">
            Careers
          </Link>
        </div>
        <div>
          <span className="footer-title">Support</span>
          <Link href="/help" className="link link-hover">
            Help Center
          </Link>
          <Link href="/contact" className="link link-hover">
            Contact
          </Link>
          <Link href="/documentation" className="link link-hover">
            Documentation
          </Link>
        </div>
      </footer>

      <DemoRequestModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  )
}

