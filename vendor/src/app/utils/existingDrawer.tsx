"use client";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { ArrowUturnLeft, MagnifyingGlassMini, XMark } from "@medusajs/icons";
import { Text, Button, Heading, IconButton, Input, Label } from "@medusajs/ui";
import Image from "next/image";
const ExistingDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const handleSubmit = (event:any) => {
    event.preventDefault();
    onClose();
  };

  const { data: productsData, error, isLoading } = useGetProducts();
   return (
    <div
      className={`absolute top-20 rounded-lg right-0 h-[578px] w-[670px] bg-white shadow-lg z-50 transform ${
        isOpen ? "-translate-x-[468px]" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-row justify-center">
            <IconButton onClick={onClose}>
              <ArrowUturnLeft className="h-6 w-6" />
            </IconButton>
            <Heading className="text-[24px] font-semibold text-left px-2">
              Add Products
            </Heading>
          </div>
          <IconButton onClick={onClose}>
            <XMark className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="p-6">
          <div className="flex flex-row justify-end">
            <div className="relative ">
              <Input
                type="text"
                placeholder="Search Products" 
                className="text-[13px] pl-11 py-1 border bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-blue-500 outline-none"
              />
              <MagnifyingGlassMini className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <ul>
            {productsData?.map((product : any) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between border-b py-2 space-x-4"
              >
                {/* Checkbox */}
                <Label className="inline-flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded-lg" />
                </Label>

                {/* Image */}
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.thumbnail || ""}
                    alt={product.title}
                    className="rounded-md object-cover"
                    width={32}
                    height={32  }
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-start flex-grow">
                  <Text className="text-[12px] text-gray-700 sm:text-[12px] md:text-[14px]">
                    {product.title}
                  </Text>
                  <Text className="text-[12px] text-gray-500 sm:text-[12px] md:text-[14px]">
                    {product.size}
                  </Text>
                </div>

                {/* Status and Code */}
                <div className="flex items-center">
                  <p className="text-gray-500 text-[12px] sm:text-[14px] md:text-[16px]">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 inline-block ${
                        product.status === "published"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {product.status || "Status"}
                  </p>
                  <p className="text-[12px] sm:text-[14px] md:text-[16px] text-gray-500 ml-4">
                    {product.mid_code}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex justify-between gap-4">
          <Button
            variant="transparent"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="transparent"
            className="bg-violet-500 text-slate-100 px-12"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExistingDrawer;
