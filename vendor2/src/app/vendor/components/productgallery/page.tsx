"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { AlertCircle } from "lucide-react";

// Define interfaces for type safety
interface Design {
  apparel: {
    url: string;
    side: string;
    color?: string;
  };
  pngImage: string;
  uploadedImages: string[];
}

interface Product {
  id: string;
  store_id: string;
  designs?: Design[];
  title?: string;
  sku?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: string;
}

interface Store {
  id: string;
  name: string;
}

const ProductGallery = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetProducts();
  const {
    data: stores,
    isLoading: isStoresLoading,
    error: storesError,
  } = useGetStores();
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
  const groupedProducts: Record<string, Product[]> = products?.reduce(
    (acc, product: Product) => {
      if (!product.designs?.length) return acc;
      const storeId = product.store_id || "Unknown Store";
      if (!acc[storeId]) acc[storeId] = [];
      acc[storeId].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (hoveredProduct) {
      intervalId = setInterval(() => {
        setCurrentImageIndices((prev) => {
          const product = products?.find((p: Product) => p.id === hoveredProduct);
          if (!product || !product.designs?.length) return prev;
          const currentIndex = prev[hoveredProduct] ?? 0;
          const nextIndex = (currentIndex + 1) % product.designs.length;
          return { ...prev, [hoveredProduct]: nextIndex };
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [hoveredProduct, products]);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  if (isProductsLoading || isStoresLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (productsError || storesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <AlertCircle className="h-6 w-6" />
          <span>Error loading products or stores</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4 text-base-content">
            No products available
          </h2>
          <p className="text-base-content opacity-70 mb-8">
            Check back later for new products.
          </p>
          <Link
            href="/vendor/orders"
            className="btn btn-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="max-w-full mx-auto">
        {Object.entries(groupedProducts || {}).map(([storeId, storeProducts]) => (
          <div
            key={storeId}
            className="card bg-base-200 shadow-md rounded-lg mb-8 p-4 border border-base-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">
                Store: {storeNameMap[storeId] || `${storeId}`}
              </h3>
              <p className="text-sm text-base-content font-medium">
                Total Products: {storeProducts.length}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {storeProducts.map((product: Product) => {
                if (!product.designs?.length) return null;
                const currentImageIndex =
                  hoveredProduct === product.id
                    ? currentImageIndices[product.id] || 0
                    : 0;
                const currentDesign = product.designs[currentImageIndex];
                return (
                  <div
                    key={product.id}
                    className="card bg-base-100 shadow-sm rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => {
                      setHoveredProduct(null);
                      setCurrentImageIndices((prev) => ({
                        ...prev,
                        [product.id]: 0,
                      }));
                    }}
                  >
                    <div className="relative aspect-square bg-base-200">
                      <Image
                        src={currentDesign.apparel.url}
                        alt={`Product ${product.id} ${currentDesign.apparel.side}`}
                        fill
                        sizes="100%"
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                        style={{
                          backgroundColor: currentDesign.apparel?.color,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white text-xs font-medium">
                            Side: {capitalizeFirstLetter(currentDesign.apparel.side)}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                        style={{
                          top:
                            currentDesign.apparel.side === "leftshoulder"
                              ? "120px"
                              : currentDesign.apparel.side === "rightshoulder"
                              ? "120px"
                              : "initial",
                          left:
                            currentDesign.apparel.side === "leftshoulder"
                              ? "90px"
                              : currentDesign.apparel.side === "rightshoulder"
                              ? "100px"
                              : "initial",
                          width:
                            currentDesign.apparel.side === "leftshoulder" ||
                            currentDesign.apparel.side === "rightshoulder"
                              ? "30%"
                              : "50%",
                          height:
                            currentDesign.apparel.side === "leftshoulder" ||
                            currentDesign.apparel.side === "rightshoulder"
                              ? "30%"
                              : "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {currentDesign.pngImage ? (
                          <Image
                            src={currentDesign.pngImage}
                            alt="Design"
                            fill
                            sizes="100%"
                            className="rounded-md object-contain transition-opacity duration-300"
                          />
                        ) : currentDesign.uploadedImages?.length > 1 ? (
                          <div className="flex overflow-x-auto space-x-2 p-2 bg-base-100 rounded-lg shadow-md">
                            {currentDesign.uploadedImages.map((imageUrl, idx) => (
                              <Image
                                key={idx}
                                src={imageUrl}
                                alt={`Uploaded Image ${idx + 1}`}
                                width={60}
                                height={60}
                                className="object-cover rounded-md"
                              />
                            ))}
                          </div>
                        ) : currentDesign.uploadedImages?.[0] ? (
                          <Image
                            src={currentDesign.uploadedImages[0]}
                            alt="Uploaded Image"
                            fill
                            className="rounded-md object-contain transition-opacity duration-300"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="p-3">
                      {product.title && (
                        <h4 className="text-sm font-semibold text-primary truncate">
                          {product.title}
                        </h4>
                      )}
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-base-content font-medium">
                          ID: {product.id.slice(-8)}
                        </p>
                        {product.price && (
                          <p className="text-xs text-base-content font-medium">
                            Price: ${product.price}
                          </p>
                        )}
                        
                      </div>
                    </div>
                  </div>
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