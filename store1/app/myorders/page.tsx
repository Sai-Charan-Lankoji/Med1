"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the Order interface
interface Order {
  id: string;
  total_amount: string;
  currency_code: string;
  status: string;
  createdAt: string;
  line_items: {
    images?: string[];
    title: string;
    quantity: number;
    price: number;
    selected_size?: string;
    selected_color?: string;
    product_type?: string;
  }[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = sessionStorage.getItem("customerId");
      if (!customerId) {
        setError("Customer ID not found in session storage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/customer/${customerId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrders(data.data); // Assuming 'data' contains the orders array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg transform transition-all duration-300 ease-in-out border border-gray-100 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 animate-fade-in">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent animate-fade-in mt-16 sm:mt-20 lg:mt-24">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg animate-fade-in">
          No orders found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Order #{order.id}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Total: ${order.total_amount} ({order.currency_code})
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Status:{" "}
                  <span
                    className={`capitalize ${
                      order.status === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Line Items */}
              <div className="p-4 space-y-4">
                {order.line_items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 border-t pt-4 first:border-t-0 first:pt-0 animate-fade-in"
                  >
                    {/* Product Image Container */}
                    <div className="w-24 h-24 flex-shrink-0 relative">
                      <div className="grid grid-cols-2 gap-1">
                        {item.images &&
                          item.images.slice(0, 4).map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="w-12 h-12 relative overflow-hidden rounded-md"
                            >
                              {image.startsWith("data:image") ? (
                                // Designable Product (Base64)
                                <Image
                                  src={image}
                                  alt={`${item.title} - Side ${imgIndex + 1}`}
                                  width={48}
                                  height={48}
                                  className="rounded-md object-cover transition-opacity duration-300 hover:opacity-90"
                                />
                              ) : (
                                // Standard Product (URL)
                                <Image
                                  src={image}
                                  alt={`${item.title} - Side ${imgIndex + 1}`}
                                  width={48}
                                  height={48}
                                  className="rounded-md object-cover transition-opacity duration-300 hover:opacity-90"
                                  placeholder="blur"
                                  blurDataURL="/fallback-image.jpg"
                                  onError={(e) => {
                                    e.currentTarget.src = "/fallback-image.jpg";
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        {item.images &&
                          item.images.length < 4 &&
                          Array.from({ length: 4 - item.images.length }).map(
                            (_, idx) => (
                              <div
                                key={`fallback-${idx}`}
                                className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center transition-all duration-300 hover:bg-gray-300"
                              >
                                <span className="text-gray-500 text-xs">
                                  N/A
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${item.price}
                      </p>
                      {item.selected_size && (
                        <p className="text-sm text-gray-600">
                          Size: {item.selected_size}
                        </p>
                      )}
                      {item.selected_color && (
                        <p className="text-sm text-gray-600">
                          Color:{" "}
                          <span
                            className="inline-block w-4 h-4 rounded-full ml-1 border border-gray-300"
                            style={{ backgroundColor: item.selected_color }}
                          ></span>
                        </p>
                      )}
                      {item.product_type && (
                        <p className="text-sm text-gray-600">
                          Type: {item.product_type}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
