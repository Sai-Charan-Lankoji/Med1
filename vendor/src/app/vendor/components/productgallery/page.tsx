"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
const ProductGallery = () => {
  const { data: products, isLoading, error } = useGetProducts();
  //console.log("products",products)
  const router = useRouter();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<
    Record<string, number>
  >({});
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (hoveredProduct) {
      intervalId = setInterval(() => {
        setCurrentImageIndices(prev => {
          const product = products?.find((p: { id: string }) => p.id === hoveredProduct);
          if (!product || !product.designs?.length) return prev;
          const currentIndex = prev[hoveredProduct] ?? 0;
          const nextIndex = (currentIndex + 1) % product.designs.length;
          return {
            ...prev,
            [hoveredProduct]: nextIndex
          };
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [hoveredProduct, products]);
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Error loading products</p>
      </div>
    );
  }
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4 text-gray-900">
            No products available
          </h2>
          <p className="text-gray-500 mb-8">
            Check back later for new products.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <section className="py-24 bg-gray-50" id="showcase">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          Our Products
        </h2>
        <p className="mt-4 text-md sm:text-lg text-gray-600">
          Explore our customizable designs
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product: { id: string; designs?: { apparel: { url: string; side: string; color?: string }; pngImage: string }[]; designstate: any; propstate: any }, index: number) => {
          if (!product.designs?.length) return null;
          const currentImageIndex = hoveredProduct === product.id 
            ? (currentImageIndices[product.id] || 0)
            : 0;
          const currentDesign = product.designs[currentImageIndex];
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-xl shadow-lg overflow-hidden relative"
              onMouseEnter={() => {
                setHoveredProduct(product.id);
              }}
              onMouseLeave={() => {
                setHoveredProduct(null);
                setCurrentImageIndices(prev => ({
                  ...prev,
                  [product.id]: 0
                }));
              }}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <Image
                  src={currentDesign.apparel.url}
                  alt={`Product ${product.id} ${currentDesign.apparel.side}`}
                  fill
                  sizes="100%"
                  className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: currentDesign.apparel?.color,
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm sm:text-base">
                      Current Side: {capitalizeFirstLetter(currentDesign.apparel.side)}
                    </p>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                      top: currentDesign.apparel.side === "leftshoulder" ? "170px" : 
                      currentDesign.apparel.side === "rightshoulder" ? "170px" : "initial", 
                 left: currentDesign.apparel.side === "leftshoulder" ? "130px" : 
                       currentDesign.apparel.side === "rightshoulder" ? "145px" : "initial", 
                 width: currentDesign.apparel.side === "leftshoulder" || currentDesign.apparel.side === "rightshoulder" ? "30%" : "50%", 
                 height: currentDesign.apparel.side === "leftshoulder" || currentDesign.apparel.side === "rightshoulder" ? "30%" : "50%", 
                    transform: "translate(-50%, -50%)",
                    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
                  }}
                >
                  <Image
                    src={currentDesign.pngImage}
                    alt="Design"
                    fill
                    sizes="100%"
                    className="rounded-md transition-opacity duration-300 ease-in-out"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  
  );
};
export default ProductGallery;