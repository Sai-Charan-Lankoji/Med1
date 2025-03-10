"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useGetProducts } from "../hooks/useGetProducts";
import { useRouter } from "next/navigation";
import { DesignContext } from "@/context/designcontext";
import type { IDesign, IProps } from "@/@types/models";
import { useStore } from "@/context/storecontext";
import { useGetStandardProducts } from "../hooks/useGetStandardProducts";
import StandardProducts from "../components/StandardProdcuts";
import ProductDetailModal from "../components/ProductDetailModal";
import axios from "axios";

const InfiniteScrollContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startAnimation = async () => {
      if (!isHovering) {
        await controls.start({
          x: "-50%",
          transition: {
            duration: 30,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          },
        });
      }
    };

    startAnimation();

    return () => {
      controls.stop();
    };
  }, [isHovering, controls]);

  return (
    <motion.div
      className="flex items-center overflow-hidden"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        animate={controls}
        className="flex gap-4 will-change-transform"
      >
        {children}
        {children}
      </motion.div>
    </motion.div>
  );
};

const ProductGallery: React.FC = () => {
  const { store } = useStore();
  const store_id = store?.id;
  const { data: products, isLoading, error } = useGetProducts(store_id);
  const { data: standardProducts } = useGetStandardProducts(store_id);
  const router = useRouter();
  const designContext = React.useContext(DesignContext);
  const { dispatchDesign } = designContext || {
    dispatchDesign: () => {},
  };

  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<
    Record<string, number>
  >({});
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    if (hoveredProduct) {
      const intervalId = setInterval(() => {
        setCurrentImageIndices((prev) => {
          const product = products?.find(
            (p: { id: string }) => p.id === hoveredProduct
          );
          if (!product || !product.designs?.length) return prev;

          const currentIndex = prev[hoveredProduct] ?? 0;
          const nextIndex = (currentIndex + 1) % product.designs.length;

          return {
            ...prev,
            [hoveredProduct]: nextIndex,
          };
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [hoveredProduct, products]);

  const logProductView = async (productId: string, storeId: string) => {
    try {
      await axios.post("http://localhost:5000/api/product-view", {
        product_id: productId,
        store_id: storeId, // Changed to store_id
      });
      console.log(`Product view logged for ${productId}`);
    } catch (error) {
      console.error("Failed to log product view:", error);
    }
  };
  
  const handleProductClick = (product: any) => {
    logProductView(product.id, store_id); // Use store_id from useStore
    setSelectedProduct({
      ...product,
      front_image: product.designs?.[0]?.apparel.url,
      back_image: product.designs?.find((d:any) => d.apparel.side === "back")?.apparel.url,
      left_image: product.designs?.find((d:any) => d.apparel.side === "left")?.apparel.url,
      right_image: product.designs?.find((d:any) => d.apparel.side === "right")?.apparel.url,
      customizable: true,
    });
  };
  const closeModal = () => {
    setSelectedProduct(null);
  };

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

  const renderProducts = () => {
    const productElements = products
      .filter((product: { designs?: IDesign[] }) => product.designs?.length)
      .map(
        (
          product: {
            id: string;
            designs: IDesign[];
            designstate: IDesign;
            propstate: IProps;
          },
          index: number
        ) => {
          const currentImageIndex =
            hoveredProduct === product.id
              ? currentImageIndices[product.id] || 0
              : 0;

          const currentDesign = product.designs[currentImageIndex];

          return (
            <motion.div
              key={product.id}
              className="flex-shrink-0 w-64 mx-2 snap-start cursor-pointer group"
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 500, damping: 30 },
              }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => {
                setHoveredProduct(null);
                setCurrentImageIndices((prev) => ({
                  ...prev,
                  [product.id]: 0,
                }));
              }}
              onClick={() => handleProductClick(product)}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-xl shadow-md">
                <Image
                  src={currentDesign.apparel.url || "/placeholder.svg"}
                  alt={`Product ${product.id} ${currentDesign.apparel.side}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
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
                      Current Side:{" "}
                      {capitalizeFirstLetter(currentDesign.apparel.side)}
                    </p>
                    <p className="text-white text-xs mt-1">
                      Product ID: {product.id.slice(-8)}
                    </p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    top:
                      currentDesign.apparel.side === "leftshoulder"
                        ? "170px"
                        : currentDesign.apparel.side === "rightshoulder"
                        ? "170px"
                        : "initial",
                    left:
                      currentDesign.apparel.side === "leftshoulder"
                        ? "130px"
                        : currentDesign.apparel.side === "rightshoulder"
                        ? "145px"
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
                    transition:
                      "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                  }}
                >
                  {currentDesign.pngImage ? (
                    <Image
                      src={currentDesign.pngImage || "/placeholder.svg"}
                      alt="Design"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md transition-opacity duration-300 ease-in-out"
                    />
                  ) : currentDesign.uploadedImages?.length > 1 ? (
                    <div className="flex overflow-x-auto space-x-2">
                      {currentDesign.uploadedImages.map((imageUrl, idx) => (
                        <Image
                          key={idx}
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Uploaded Image ${idx + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <Image
                      src={
                        currentDesign.uploadedImages[0] || "/placeholder.svg"
                      }
                      alt="Uploaded Image"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md transition-opacity duration-300 ease-in-out"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          );
        }
      );

    return products.length > 4 ? (
      <InfiniteScrollContainer>{productElements}</InfiniteScrollContainer>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {productElements}
      </div>
    );
  };

  return (
    <section className="py-24 bg-gray-50" id="showcase">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Customizable Products
        </h2>
        {products?.length ? (
          renderProducts()
        ) : (
          <p className="text-gray-600">No customizable products found.</p>
        )}

        <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900">
          Standard Products
        </h2>
        {standardProducts?.length ? (
          <StandardProducts products={standardProducts} logProductView={(productId) => logProductView(productId, store_id)} />        ) : (
          <p className="text-gray-600">No standard products found.</p>
        )}
      </div>
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeModal} />
      )}
    </section>
  );
};

export default ProductGallery;