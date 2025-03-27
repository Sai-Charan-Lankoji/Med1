"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { AlertCircle, Tag, Eye } from "lucide-react";

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

interface StandardProduct {
  id: string;
  store_id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  front_image: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  category: string;
  sku: string;
  sale: boolean;
  customizable: boolean;
  stock_id?: string;
  Stock?: {
    StockVariants: Array<{
      variantId: string;
      size: string;
      color: string;
      availableQuantity: number;
    }>;
  };
}

interface Store {
  id: string;
  name: string;
}

// ProductDetail modal component
const ProductDetailModal = ({ product, onClose }: { product: StandardProduct; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(product.front_image);
  
  // Get available sizes and colors
  const getSizesForProduct = (product: StandardProduct): string[] => {
    const variants = product.Stock?.StockVariants;
    if (!variants || variants.length === 0) return [];
    return [...new Set(variants.filter(v => v.availableQuantity > 0).map(v => v.size))];
  };
  
  const getColorsForProduct = (product: StandardProduct): string[] => {
    const variants = product.Stock?.StockVariants;
    if (!variants || variants.length === 0) return [];
    return [...new Set(variants.filter(v => v.availableQuantity > 0).map(v => v.color))];
  };
  
  const availableSizes = getSizesForProduct(product);
  const availableColors = getColorsForProduct(product);
  
  return (
    <dialog id="product_modal" className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square bg-base-200 rounded-lg overflow-hidden">
              <Image
                src={activeImage || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.front_image && (
                <button 
                  className={`w-16 h-16 rounded-md border-2 ${activeImage === product.front_image ? 'border-primary' : 'border-base-200'}`}
                  onClick={() => setActiveImage(product.front_image)}
                >
                  <div className="relative w-full h-full">
                    <Image src={product.front_image} alt="Front" fill className="object-cover rounded" />
                  </div>
                </button>
              )}
              {product.back_image && (
                <button 
                  className={`w-16 h-16 rounded-md border-2 ${activeImage === product.back_image ? 'border-primary' : 'border-base-200'}`}
                  onClick={() => setActiveImage(product.back_image)}
                >
                  <div className="relative w-full h-full">
                    <Image src={product.back_image} alt="Back" fill className="object-cover rounded" />
                  </div>
                </button>
              )}
              {product.left_image && (
                <button 
                  className={`w-16 h-16 rounded-md border-2 ${activeImage === product.left_image ? 'border-primary' : 'border-base-200'}`}
                  onClick={() => setActiveImage(product.left_image)}
                >
                  <div className="relative w-full h-full">
                    <Image src={product.left_image} alt="Left" fill className="object-cover rounded" />
                  </div>
                </button>
              )}
              {product.right_image && (
                <button 
                  className={`w-16 h-16 rounded-md border-2 ${activeImage === product.right_image ? 'border-primary' : 'border-base-200'}`}
                  onClick={() => setActiveImage(product.right_image)}
                >
                  <div className="relative w-full h-full">
                    <Image src={product.right_image} alt="Right" fill className="object-cover rounded" />
                  </div>
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">{product.title}</h3>
            <p className="text-base-content/80">{product.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 my-3">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.sale && (
                <span className="badge badge-accent">On Sale</span>
              )}
              {product.category && (
                <span className="badge badge-outline">{product.category}</span>
              )}
            </div>
            
            <div className="divider my-2"></div>
            
            <div className="space-y-3">
              <p className="font-medium">Product Details:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-base-content/70">Brand:</span>
                  <span className="font-medium ml-1">{product.brand}</span>
                </div>
                <div>
                  <span className="text-base-content/70">SKU:</span>
                  <span className="font-medium ml-1">{product.sku}</span>
                </div>
                <div>
                  <span className="text-base-content/70">Type:</span>
                  <span className="font-medium ml-1">{product.customizable ? 'Customizable' : 'Standard'}</span>
                </div>
              </div>
            </div>
            
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Available Sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <span key={size} className="badge badge-outline">{size}</span>
                  ))}
                </div>
              </div>
            )}
            
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Available Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-base-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-action">
          <button className="btn btn-primary">Edit Product</button>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>Close</button>
      </form>
    </dialog>
  );
};

const ProductGallery = () => {
  const {
    customProducts,
    standardProducts,
    isLoading: { any: isLoading },
    error: { any: error },
    refetch: { all: refetchAll }
  } = useGetProducts();
  
  const {
    data: stores,
    isLoading: isStoresLoading,
    error: storesError,
  } = useGetStores();
  
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});
  const [selectedStandardProduct, setSelectedStandardProduct] = useState<StandardProduct | null>(null);

  // Create a map of store IDs to store names
  const storeNameMap = React.useMemo(() => {
    if (!stores) return {};
    return stores.reduce((acc, store: Store) => {
      acc[store.id] = store.name;
      return acc;
    }, {} as Record<string, string>);
  }, [stores]);

  // Group custom products by store ID
  const groupedCustomProducts: Record<string, Product[]> = React.useMemo(() => {
    if (!customProducts) return {};
    return customProducts.reduce(
      (acc, product: Product) => {
        if (!product.designs?.length) return acc;
        const storeId = product.store_id || "Unknown Store";
        if (!acc[storeId]) acc[storeId] = [];
        acc[storeId].push(product);
        return acc;
      },
      {} as Record<string, Product[]>
    );
  }, [customProducts]);

  // Group standard products by store ID
  const groupedStandardProducts: Record<string, StandardProduct[]> = React.useMemo(() => {
    if (!standardProducts) return {};
    return standardProducts.reduce(
      (acc, product: StandardProduct) => {
        const storeId = product.store_id || "Unknown Store";
        if (!acc[storeId]) acc[storeId] = [];
        acc[storeId].push(product);
        return acc;
      },
      {} as Record<string, StandardProduct[]>
    );
  }, [standardProducts]);

  // Get all unique store IDs from both product types
  const allStoreIds = React.useMemo(() => {
    const customStoreIds = Object.keys(groupedCustomProducts);
    const standardStoreIds = Object.keys(groupedStandardProducts);
    return [...new Set([...customStoreIds, ...standardStoreIds])];
  }, [groupedCustomProducts, groupedStandardProducts]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (hoveredProduct) {
      intervalId = setInterval(() => {
        setCurrentImageIndices((prev) => {
          const product = customProducts?.find((p: Product) => p.id === hoveredProduct);
          if (!product || !product.designs?.length) return prev;
          const currentIndex = prev[hoveredProduct] ?? 0;
          const nextIndex = (currentIndex + 1) % product.designs.length;
          return { ...prev, [hoveredProduct]: nextIndex };
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [hoveredProduct, customProducts]);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const handleQuickView = (product: StandardProduct) => {
    setSelectedStandardProduct(product);
  };

  const closeModal = () => {
    setSelectedStandardProduct(null);
  };

  if (isLoading || isStoresLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || storesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <AlertCircle className="h-6 w-6" />
          <span>Error loading products or stores</span>
        </div>
      </div>
    );
  }

  if ((!customProducts || customProducts.length === 0) && 
      (!standardProducts || standardProducts.length === 0)) {
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
            className="btn btn-primary"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="w-full">
        {allStoreIds.map((storeId) => {
          const hasCustomProducts = groupedCustomProducts[storeId]?.length > 0;
          const hasStandardProducts = groupedStandardProducts[storeId]?.length > 0;
          
          if (!hasCustomProducts && !hasStandardProducts) return null;

          const customProductCount = groupedCustomProducts[storeId]?.length || 0;
          const standardProductCount = groupedStandardProducts[storeId]?.length || 0;
          const totalProductCount = customProductCount + standardProductCount;

          return (
            <div
              key={storeId}
              className="card bg-base-200 shadow-md rounded-lg mb-8 p-4 border border-base-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Store: {storeNameMap[storeId] || `${storeId}`}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-base-content font-medium">
                    Total Products: {totalProductCount}
                  </p>
                  <div className="badge badge-neutral badge-sm">{customProductCount} Custom</div>
                  <div className="badge badge-accent badge-sm">{standardProductCount} Standard</div>
                </div>
              </div>

              {/* Display custom products if available */}
              {hasCustomProducts && (
                <div className="mb-4">
                  <div className="divider text-xs text-base-content/70">Custom Products</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedCustomProducts[storeId].map((product: Product) => {
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
              )}

              {/* Display standard products if available */}
              {hasStandardProducts && (
                <div>
                  <div className="divider text-xs text-base-content/70">Standard Products</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedStandardProducts[storeId].map((product: StandardProduct) => (
                      <div
                        key={product.id}
                        className="card bg-base-100 shadow-sm rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="relative aspect-square bg-base-200">
                          <Image
                            src={product.front_image }
                            alt={product.title}
                            fill
                            sizes="100%"
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-transparent  transition-all duration-300 flex items-center justify-center hover:cursor-auto">
                            <button
                              className="btn btn-sm btn-ghost bg-base-100 opacity-0 hover:opacity-100"
                              onClick={() => handleQuickView(product)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Quick View
                            </button>
                          </div>
                          {product.sale && (
                            <div className="absolute top-2 right-2">
                              <span className="badge badge-secondary">Sale</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-semibold text-primary truncate">{product.title}</h4>
                            {product.category && (
                              <span className="text-xs bg-base-200 text-base-content/70 px-2 py-0.5 rounded-full flex items-center">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-base-content font-medium mt-1">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-base-content/70 mt-1">Brand: {product.brand}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Standard Product Detail Modal */}
      {selectedStandardProduct && (
        <ProductDetailModal product={selectedStandardProduct} onClose={closeModal} />
      )}
    </section>
  );
};

export default ProductGallery;