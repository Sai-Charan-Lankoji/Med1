"use client";
import { useEffect, useState } from "react";
import { ChevronDownMini, ChevronUpMini } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import { BackButton } from "@/app/utils/backButton";
import GeneralInformation from "@/app/vendor/components/generalInformation/page";
import Thumbnail from "@/app/vendor/components/thumbnail/page";
import Attributes from "@/app/vendor/components/attributes/page";
import { useParams } from "next/navigation";

const Editproducts = () => {
  const { id: productId } = useParams();
  const [showRawData, setShowRawData] = useState(false);
  const [productFormData, setProductFormData] = useState<any>({});
  const [isReady, setIsReady] = useState(false);

  // Wait until the client-side is ready to prevent hydration mismatch
  useEffect(() => {
    if (productId) {
      setIsReady(true);
    }
  }, [productId]);

  if (!isReady) return null; // Avoid rendering until client-side hook is available

  return (
    <div className="px-12 pb-12">
      <BackButton name="products" />
      <div className="flex sm:flex-col flex-row lg:flex-row gap-2">
        {/* General Information Component */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:w-[398px] md:w-[532px] lg:w-[800px]">
          <GeneralInformation />
        </div>

        {/* Thumbnail Component */}
        <div className="w-2/6 rounded-lg">
          <Thumbnail />
        </div>
      </div>
      <Attributes />
      <div className="p-6 mt-4 bg-white shadow-md rounded-lg sm:w-[398px] md:w-[532px] lg:w-[800px]">
        <Heading className="text-[24px] mb-2">Raw Product</Heading>
        <div className="flex flex-row justify-between">
          <Button
            variant="transparent"
            onClick={() => setShowRawData(!showRawData)}
            className="mt-4 px-4 py-2 text-slate-900 rounded-md"
          >
            <p className="text-[14px] text-gray-400">
              .... ({Object.keys(productFormData).length} items)
            </p>
            {showRawData ? <ChevronUpMini /> : <ChevronDownMini />}
          </Button>
        </div>
        {showRawData && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-md">
            {JSON.stringify(productFormData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Editproducts;
