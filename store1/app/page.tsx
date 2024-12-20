'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Truck, ShirtIcon, BadgeCheck, PencilRuler, ShoppingCart, PackageCheck, Star, Facebook, Twitter, Instagram } from 'lucide-react';
import {Button} from '@/components/button';
import { useRouter } from 'next/navigation';
import { NEXT_STORE_NAME } from '@/constants/constants';
import { useGetProducts } from './hooks/useGetProducts';
import { log } from 'node:console';
import ProductGallery from './prod/page';
// Custom Designs Data
const customDesigns = [
  {
    side: 'Front',
    image: 'https://motoanimals.com/wp-content/uploads/2024/08/Yamaha-YZF-R1-2007-Charcoal-Silver-on-T-shirt.jpg?auto=format&fit=crop&q=80',
    description: 'Custom graphic art with vibrant colors',
  },
  {
    side: 'Back',
    image: 'https://store.projectexodus.net/cdn/shop/products/RethinkRecovery-Black.png?v=1669623740?auto=format&fit=crop&q=80',
    
    description: 'Bold typography and minimalist design',
  },
  {
    side: 'Left Shoulder',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80',
    description: 'Multiple Color Options',
  },
  {
    side: 'Right Shoulder',
    image: 'https://i0.wp.com/www.the-tshirtshopkingsbay.com/wp-content/uploads/2023/08/mountain5wht.png?auto=format&fit=crop&q=80',
    description: 'Custom Image Uploads',
  },
];

// Features Data
const features = [
  {
    name: 'Full Customization',
    description: 'Design all sides of your t-shirt with our intuitive editor. Add text, images, and SVGs.',
    icon: Palette,
  },
  {
    name: 'Premium Quality',
    description: 'We use high-quality materials and advanced printing technology for vibrant, long-lasting designs.',
    icon: BadgeCheck,
  },
  {
    name: 'Multiple Styles',
    description: 'Choose from various t-shirt styles, colors, and sizes to match your preferences.',
    icon: ShirtIcon,
  },
  {
    name: 'Fast Shipping',
    description: 'Quick processing and worldwide shipping to get your custom t-shirt to you as soon as possible.',
    icon: Truck,
  },
];

// How It Works Steps
const steps = [
  {
    id: 1,
    name: 'Design',
    description: 'Use our easy-to-use designer to create your custom t-shirt. Add text, images, and graphics to all sides.',
    icon: PencilRuler,
  },
  {
    id: 2,
    name: 'Order',
    description: 'Choose your size, quantity, and complete your purchase securely.',
    icon: ShoppingCart,
  },
  {
    id: 3,
    name: 'Receive',
    description: 'We\'ll print your design with premium quality and ship it directly to your door.',
    icon: PackageCheck,
  },
];

// Testimonials Data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Artist',
    content: 'The design interface is incredibly intuitive. I was able to create exactly what I envisioned for my art exhibition merchandise.',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    role: 'Small Business Owner',
    content: 'Outstanding print quality and fast delivery. My team loves their custom uniforms!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Event Planner',
    content: 'Perfect for creating unique event merchandise. The ability to design all sides of the shirt is a game-changer.',
    rating: 5,
  },
];

export default function Home() {
  const router = useRouter();
  const scrollToDesignShowcase = () => {
    const section = document.getElementById('showcase');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const { data: products } = useGetProducts()
   
  return (
    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden ">
        <div className="absolute inset-0 gradient-bg " />
        <div className="relative mx-auto max-w-7xl  px-6 py-24 sm:py-32 lg:px-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="lg:w-1/2 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
              >
                Design Your <span className="text-purple-600">Dream</span> T-shirt
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Unleash your creativity with our advanced t-shirt designer. Create unique designs
                for all sides - front, back, and shoulders. Premium quality guaranteed.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4"
              >
                <Button size="lg" className="group bg-purple-600 text-white" onClick={() => router.push('/dashboard')}>
                  Start Designing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className='bg-white text-gray-800' onClick={scrollToDesignShowcase}>
                  View Gallery
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-2xl opacity-20" />
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80"
                  alt="T-shirt mockup"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Design Showcase Section */}
      <section className="py-24 bg-gray-50" id='showcase'>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
               Design Gallery
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get inspired by these amazing customisable designs
            </p>
          </div>
          <ProductGallery/>
        </div>
      </section>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create your perfect t-shirt
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-indigo-600" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three simple steps to your custom t-shirt
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-3">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <dt className="flex flex-col items-center gap-y-4">
                    <div className="rounded-lg bg-indigo-600 p-4">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-lg font-semibold leading-7 text-gray-900">{step.name}</div>
                  </dt>
                  <dd className="mt-2 text-center text-base leading-7 text-gray-600">{step.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by Creators Worldwide
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-200 rounded-lg"
              >
                <div>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-gray-600">
                    {testimonial.content}
                  </p>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create your custom t-shirt?
              <br />
              Start designing today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of satisfied customers who have brought their creative visions to life.
              Premium quality, fast shipping, and exceptional customer service guaranteed.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="group" onClick={() => router.push('/dashboard')}>
                Start Designing Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={scrollToDesignShowcase}>
                View Gallery
              </Button>
            </div>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-auto px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center justify-center md:justify-start">
              <ShirtIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">{NEXT_STORE_NAME}</span>
            </div>
            <p className="mt-2 text-center text-xs leading-5 text-gray-500 md:text-left">
              &copy; {new Date().getFullYear()} {NEXT_STORE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}