"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { useGetStores } from "@/app/hooks/store/useGetStores"; // Import the useGetStores hook

// Define interfaces for type safety
interface Design {
  apparel: {
    url: string;
    side: string;
    color?: string;
  };
  pngImage: string;
}

interface Product {
  id: string;
  store_id: string;
  designs?: Design[];
}

interface Store {
  id: string;
  name: string;
}

const ProductGallery = () => {
  const { data: products, isLoading: isProductsLoading, error: productsError } = useGetProducts();
  const { data: stores, isLoading: isStoresLoading, error: storesError } = useGetStores();
  const router = useRouter();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<
    Record<string, number>
  >({});

  // Create a map of store IDs to store names
  const storeNameMap = React.useMemo(() => {
    if (!stores) return {};
    return stores.reduce((acc, store: Store) => {
      acc[store.id] = store.name;
      return acc;
    }, {} as Record<string, string>);
  }, [stores]);

  // Group products by store ID
  const groupedProducts: Record<string, Product[]> = products?.reduce((acc, product: Product) => {
    if (!product.designs?.length) return acc;
    
    const storeId = product.store_id || 'Unknown Store';
    if (!acc[storeId]) {
      acc[storeId] = [];
    }
    acc[storeId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (hoveredProduct) {
      intervalId = setInterval(() => {
        setCurrentImageIndices(prev => {
          const product = products?.find((p: Product) => p.id === hoveredProduct);
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

  if (isProductsLoading || isStoresLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (productsError || storesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Error loading products or stores</p>
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
            href="/vendor/orders"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50" id="showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Product management
          </h2>
        </div>

        {Object.entries(groupedProducts || {}).map(([storeId, storeProducts]) => (
          <div key={storeId} className="mb-12 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                 Store: {storeNameMap[storeId] ||  `${storeId}`}
              </h3>
              <p className="text-sm text-gray-600">
                Total Products: {storeProducts.length}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {storeProducts.map((product: Product, index: number) => {
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
                    {/* Rest of the component remains the same */}
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
                          <p className="text-white text-xs mt-1">
                            Product ID: {product.id.slice(-8)}
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
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;