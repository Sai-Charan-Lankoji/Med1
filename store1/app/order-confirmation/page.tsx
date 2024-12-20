"use client";
import React, { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation"; 
import { useSvgContext } from "@/context/svgcontext";

const OrderConform = () => {
  const router = useRouter(); 
  const {clearSvgItems} = useSvgContext();

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <DotLottieReact
        src="https://lottie.host/fae955e9-14a7-4d7b-8167-d2873c03b5b7/Dn0j5Numpf.json"
        loop
        autoplay
        style={{ width: 500, height: "auto" }}
      />
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div> 

<div>
  <button
    onClick={() => router.push("/")}
    className="mt-4 w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition duration-200 flex items-center justify-center space-x-2 shadow-md"
  >
    <span>Return to Home</span>
  </button>
</div>

    </div>
  );
};

export default OrderConform;
