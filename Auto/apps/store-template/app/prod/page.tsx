"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetProducts } from "../hooks/useGetProducts";
import { useRouter } from "next/navigation";
import { DesignContext } from "@/context/designcontext";
import { IDesign, IProps } from "@/@types/models";
import styles from "./ProductGallery.module.css";

const ProductGallery = () => {
  const { data: products, isLoading, error } = useGetProducts();
  const router = useRouter();
  const designContext = React.useContext(DesignContext);
  const { dispatchDesign } = designContext || {
    dispatchDesign: () => {},
  };

  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<
    Record<string, number>
  >({});
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }
  }, [products]);

  const handleDesignClick = async (
    designstate: IDesign,
    propstate: IProps,
    productId: string
  ) => {
    localStorage.setItem("savedDesignState", JSON.stringify(designstate));
    localStorage.setItem("savedPropsState", JSON.stringify(propstate));
    localStorage.setItem("product_id", productId);
    dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: designstate });

    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/dashboard");

    const canvasElement = document.querySelector(".canvas-container");
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const addAnimation = () => {
    if (scrollerRef.current) {
      scrollerRef.current.setAttribute("data-animated", "true");
      const scrollerInner = scrollerRef.current.querySelector(`.${styles.scrollerInner}`);
      if (scrollerInner) {
        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute("aria-hidden", "true");
          scrollerInner.appendChild(duplicatedItem);
        });
      }
    }
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Products
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our customizable designs
          </p>
        </div> */}
        <div 
          ref={scrollerRef}
          className={`${styles.scroller}`}
          data-speed="fast"
        >
          <div className={styles.scrollerInner}>
            {products.map((product: { id: string; designs?: { apparel: { url: string; side: string; color?: string }; pngImage: string }[]; designstate: any; propstate: any }, index: number) => {
              if (!product.designs?.length) return null;

              const currentImageIndex = hoveredProduct === product.id 
                ? (currentImageIndices[product.id] || 0)
                : 0;

              const currentDesign = product.designs[currentImageIndex];

              return (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 w-64 mx-2 snap-start"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
                  onClick={() => 
                    handleDesignClick(
                      product.designstate, 
                      product.propstate, 
                      product.id
                    )
                  }
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
                    
                    {/* Design overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm">
                          Current Side: {capitalizeFirstLetter(currentDesign.apparel.side)}
                        </p>
                      </div>
                    </div>

                    {/* Overlaid design image */}
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
      </div>
    </section>
  );
};

export default ProductGallery;

