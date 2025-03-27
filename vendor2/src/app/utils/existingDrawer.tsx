"use client";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { CornerUpLeft, Search, X } from "lucide-react";
import Image from "next/image";

const ExistingDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { allProducts, error, isLoading } = useGetProducts();
  const productsData = [...allProducts.custom, ...allProducts.standard];

  return (
    <div
      className={`fixed top-20 right-0 h-[578px] w-[670px] bg-white shadow-lg z-50 transform ${
        isOpen ? "-translate-x-[468px]" : "translate-x-full"
      } transition-transform duration-300 rounded-lg`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <button onClick={onClose} className="btn btn-ghost btn-circle">
              <CornerUpLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold ml-2">Add Products</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Products"
              className="input input-bordered w-full pl-10 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          {isLoading.any ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error.any ? (
            <p className="text-red-500 text-center">Error loading products</p>
          ) : (
            <ul>
              {productsData?.map((product: any) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b space-x-4"
                >
                  {/* Checkbox */}
                  <label className="flex items-center">
                    <input type="checkbox" className="checkbox checkbox-sm" />
                  </label>

                  {/* Image */}
                  <div className="w-12 h-12 shrink-0 ml-4">
                    <Image
                      src={product.thumbnail || ""}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 ml-4">
                    <p className="text-xs md:text-sm text-gray-700">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.size}</p>
                  </div>

                  {/* Status and Code */}
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <span
                        className={`w-2 h-2 rounded-full mr-1 ${
                          product.status === "published" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <p className="text-xs md:text-sm text-gray-500">
                        {product.status || "Status"}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{product.mid_code}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-between gap-4">
          <button onClick={onClose} className="btn btn-ghost px-4 py-2">Back</button>
          <button onClick={onClose} className="btn btn-primary px-12">Add</button>
        </div>
      </div>
    </div>
  );
};

export default ExistingDrawer;