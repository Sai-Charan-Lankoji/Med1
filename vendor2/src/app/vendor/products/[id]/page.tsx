"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import { BackButton } from "@/app/utils/backButton";
import GeneralInformation from "@/app/vendor/components/generalInformation/page";
import Thumbnail from "@/app/vendor/components/thumbnail/page";
import Attributes from "@/app/vendor/components/attributes/page";

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
      <div className="flex flex-col lg:flex-row gap-4">
        {/* General Information Component */}
        <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-[800px]">
          <GeneralInformation />
        </div>

        {/* Thumbnail Component */}
        <div className="w-full lg:w-2/6 rounded-lg">
          <Thumbnail />
        </div>
      </div>
      <Attributes />
      <div className="mt-4 bg-white shadow-md rounded-lg p-6 w-full lg:w-[800px]">
        <h2 className="text-2xl font-semibold mb-2">Raw Product</h2>
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="btn btn-ghost flex items-center space-x-2"
          >
            <span className="text-sm text-gray-400">
              .... ({Object.keys(productFormData).length} items)
            </span>
            {showRawData ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {showRawData && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm overflow-auto">
            {JSON.stringify(productFormData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Editproducts;