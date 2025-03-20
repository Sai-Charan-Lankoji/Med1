"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { X } from "lucide-react"; // Importing the X icon from lucide-react

interface Order {
  id: string;
  total_amount: string;
  currency_code: string;
  status: string;
  createdAt: string;
  line_items: {
    images?: string[];
    designs?: {
      apparel: { url: string };
      pngImage: string;
    }[];
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        const response = await fetch(`http://localhost:5000/api/orders/customer/${customerId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setOrders(data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getTrackingTimeline = (status: string) => {
    return [
      { status: "Order Placed", date: new Date().toLocaleString(), completed: true },
      { status: "Processing", date: "", completed: status !== "pending" },
      { status: "Shipped", date: "", completed: status === "shipped" || status === "delivered" },
      { status: "Delivered", date: "", completed: status === "delivered" },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="h-56 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white text-red-600 p-6 rounded-xl shadow-md border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-gray-600">
              No orders found yet. Start shopping now!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="relative h-56">
                  {order.line_items[0]?.designs?.length > 0 ? (
                    <>
                      <Image
                        src={order.line_items[0].designs[0].apparel.url}
                        alt={`Order ${order.id} background`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL="/fallback-image.jpg"
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                      />
                      <Image
                        src={order.line_items[0].designs[0].pngImage}
                        alt={`Order ${order.id} design`}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL="/fallback-image.jpg"
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                      />
                    </>
                  ) : order.line_items[0]?.images?.[0] ? (
                    <Image
                      src={order.line_items[0].images[0].startsWith("data:image") ? order.line_items[0].images[0] : order.line_items[0].images[0]}
                      alt={`Order ${order.id} preview`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL="/fallback-image.jpg"
                      onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                    />
                  ) : (
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Preview</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm ${
                      order.status === "pending" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      Order #{order.id.slice(0, 8)}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {order.line_items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate max-w-[70%]">{item.title}</span>
                        <span>x{item.quantity} - ${item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Total:</span>
                    <span className="text-base font-bold text-indigo-600">
                      ${order.total_amount} {order.currency_code}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking Dialog */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="sm:max-w-xl w-full bg-white rounded-2xl shadow-xl p-0">
              <DialogHeader className="p-6 pb-0 flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Track Order #{selectedOrder.id.slice(0, 8)}
                </DialogTitle>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Close dialog"
                >
                  <X className="w-6 h-6" />
                </button>
              </DialogHeader>
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {selectedOrder.line_items[0]?.designs?.length > 0 ? (
                      <>
                        <Image
                          src={selectedOrder.line_items[0].designs[0].apparel.url}
                          alt="Background"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Image
                          src={selectedOrder.line_items[0].designs[0].pngImage}
                          alt="Design"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </>
                    ) : selectedOrder.line_items[0]?.images?.[0] ? (
                      <Image
                        src={selectedOrder.line_items[0].images[0]}
                        alt="Product"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {selectedOrder.line_items[0].title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Qty: {selectedOrder.line_items[0].quantity} • ${selectedOrder.line_items[0].price}
                    </p>
                    <p className="text-sm font-medium text-indigo-600">
                      Total: ${selectedOrder.total_amount} {selectedOrder.currency_code}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Order Status</h4>
                  <div className="relative pl-8">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-indigo-100"></div>
                    {getTrackingTimeline(selectedOrder.status).map((step, index) => (
                      <div key={index} className="relative mb-8 last:mb-0">
                        <div className="flex items-center">
                          <div className="absolute -left-5 w-4 h-4 rounded-full bg-white border-2 z-10 flex items-center justify-center">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                step.completed ? "bg-indigo-600" : "bg-gray-300"
                              }`}
                            ></div>
                          </div>
                          <div className="ml-4">
                            <h5 className={`text-sm font-medium ${step.completed ? "text-indigo-600" : "text-gray-500"}`}>
                              {step.status}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {step.completed && step.date ? step.date : "Awaiting"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Orders;