"use client";

import { useCart } from "@/context/cartContext";
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { XMarkMini } from "@medusajs/icons";

interface OrderData {
  line_items: Array<{
    product_id: number | string | undefined;
    quantity: number;
    price: number;
    thumbnail_url: any;
    upload_url: any;
    background_image_url: string ;
    background_image_color: string | undefined;
  }>;
  total_amount: number;
  currency_code: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string | null;
  email: string | null;
  region_id: string;
  vendor_id: string | null;
  public_api_key: string | null;
}

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { customerToken } = useUserContext();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createOrder, isLoading, isError } = useCreateOrder();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const openModal = (itemId: number) => {
    setItemToRemove(itemId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  const shippingCost: number = 0;
  const taxRate: number = 0.1;

  const subtotal: number = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const taxAmount: number = subtotal * taxRate;
  const total: number = subtotal + shippingCost + taxAmount;

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    setError(null);

    if (newQuantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (newQuantity > 10) {
      setError("Maximum quantity allowed is 10");
      return;
    }

    setUpdating(true);
    try {
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      setError("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = () => {
    if (itemToRemove !== null) {
      removeFromCart(itemToRemove);
      closeModal();
    }
  };

  const public_api_key = process.env.NEXT_PUBLIC_API_KEY || null;
  const vendorId = process.env.NEXT_PUBLIC_VENDOR_ID || null;

  const handleProceedToOrder = () => {
    if (isProcessingOrder) return;
    setIsProcessingOrder(true);

    const orderData: OrderData = {
      line_items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        thumbnail_url: item.upload ? item.upload : item.thumbnail, // Use upload if available, otherwise fallback to thumbnail
        upload_url: item.upload,
        background_image_url: item.backgroundTShirt.url,
        background_image_color: item.backgroundTShirt.color,
      })),
      total_amount: total,
      currency_code: "usd",
      status: "pending",
      fulfillment_status: "not_fulfilled",
      payment_status: "awaiting",
      customer_id: sessionStorage.getItem("customerId"),
      email: sessionStorage.getItem("customerEmail"),
      region_id: "reg_01J2GRDEGRBXFBD4HZW443AF8K",
      vendor_id: vendorId,
      public_api_key: public_api_key,
    };

    createOrder(orderData, {
      onSuccess: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          router.push("./order-confirmation");
        } catch (err) {
          console.error("Navigation error:", err);
          setError("Failed to navigate to order confirmation page.");
          setIsProcessingOrder(false);
        }
      },
      onError: (err) => {
        console.error("Error placing order:", err);
        setError("Failed to place order. Please try again.");
        setIsProcessingOrder(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-black">
      {!customerToken && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Already have an account?
              </h2>
              <p className="text-gray-600">Sign in for a better experience.</p>
            </div>
            <Link href="/auth">
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven &apos t added any items to your cart yet.
              </p>
              <Link
                href="/"
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Product</th>
                    <th className="text-left py-4">Quantity</th>
                    <th className="text-left py-4">Price</th>
                    <th className="text-left py-4">Total</th>
                    <th className="text-left py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-10 h-20">
                            <Image
                              src={item.backgroundTShirt.url}
                              alt={item.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                              style={{
                                backgroundColor: item.backgroundTShirt.color,
                              }}
                            />
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              layout="fill"
                              objectFit="contain"
                              className="rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex items-center">
                              <p className="text-sm text-gray-500 mr-2">
                                Color:
                              </p>
                              <div
                                className={`w-6 h-6 flex items-center justify-center rounded-full border border-gray-500`}
                                style={{
                                  backgroundColor: item.backgroundTShirt.color,
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Side: {item.side}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={updating || item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={updating || item.quantity >= 10}
                          >
                            +
                          </button>
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                      </td>
                      <td className="py-4">${item.price.toFixed(2)}</td>
                      <td className="py-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => openModal(item.id)}
                          className="text-red-500 hover:text-red-700 transition duration-200"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition duration-200 disabled:bg-gray-400"
                onClick={handleProceedToOrder}
                disabled={isLoading}
              >
                {isLoading && customerToken
                  ? "Processing..."
                  : customerToken
                  ? "Confirm Order"
                  : "Login to proceed order"}
              </button>
              {isError && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-auto max-w-md w-full mx-4">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold">Please confirm</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkMini className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <p className="text-gray-700 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>

            <div className="flex flex-row gap-3 justify-end">
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
                onClick={handleRemoveItem}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
