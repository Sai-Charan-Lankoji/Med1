"use client";
import React, { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation"; 
import { useCart } from "@/context/cartContext";

const OrderConform = () => {
  const router = useRouter(); 
  const {clearCart} = useCart();

  useEffect(() => {
    const timer = setTimeout(() => { 
      clearCart();
      router.push("/"); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
    </div>
  );
};

export default OrderConform;
