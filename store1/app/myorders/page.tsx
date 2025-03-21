"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronRight,
  ShoppingBag,
  Calendar,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";

interface Order {
  id: string;
  total_amount: string;
  currency_code: string;
  status: string;
  createdAt: string;
  line_items: {
    images?: string[];
    designs?: { apparel: { url: string }; pngImage: string }[];
    title: string;
    quantity: number;
    price: number;
    selected_size?: string;
    selected_color?: string;
    product_type?: string;
  }[];
}

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-amber-500" />,
  processing: <Package className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-purple-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
};

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
  processing: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
  shipped: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = sessionStorage.getItem("customerId");
      if (!customerId) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/customer/${customerId}`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.data);
        setFilteredOrders(data.data);
        setLoading(false);
      } catch (err) {
        setError("Unable to load orders. Please try again later.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (activeTab !== "all") {
      result = result.filter((order) => order.status === activeTab);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.line_items.some((item) =>
            item.title.toLowerCase().includes(query)
          )
      );
    }
    setFilteredOrders(result);
  }, [activeTab, searchQuery, orders]);

  const getTrackingTimeline = (status: string) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status);
    return [
      {
        status: "Order Placed",
        date: new Date(selectedOrder?.createdAt || "").toLocaleDateString(),
        completed: true,
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        status: "Processing",
        date:
          currentIndex >= 1
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 86400000
              ).toLocaleDateString()
            : "",
        completed: currentIndex >= 1,
        icon: <Package className="w-5 h-5" />,
      },
      {
        status: "Shipped",
        date:
          currentIndex >= 2
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 172800000
              ).toLocaleDateString()
            : "",
        completed: currentIndex >= 2,
        icon: <Truck className="w-5 h-5" />,
      },
      {
        status: "Delivered",
        date:
          currentIndex >= 3
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 259200000
              ).toLocaleDateString()
            : "",
        completed: currentIndex >= 3,
        icon: <CheckCircle className="w-5 h-5" />,
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm animate-pulse border border-gray-200"
              >
                <div className="h-32 w-full bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
          <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-6 py-2"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 mt-12">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto border border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here!
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 rounded-lg px-6 py-2 shadow-md"
            >
              Shop Now
            </Button>
          </div>
        ) : (
          <>
            {/* Filter and Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-1/2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by order ID or product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded-lg"
                  />
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-5 gap-2 bg-gray-200 p-2 rounded-lg">
                    <TabsTrigger
                      value="all"
                      className={`capitalize py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeTab === "all"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      All Orders
                    </TabsTrigger>
                    {["pending", "processing", "shipped", "delivered"].map(
                      (tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className={`capitalize py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === tab
                              ? `${statusColors[
                                  tab as keyof typeof statusColors
                                ].replace("50", "600")} text-gray-900 shadow-md`
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tab}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
                  <p className="text-gray-600 text-lg font-medium">
                    No orders match your search or filter.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge
                          className={`${
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          } border`}
                        >
                          {
                            statusIcons[
                              order.status as keyof typeof statusIcons
                            ]
                          }
                          <span className="ml-1">
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      {order.line_items.slice(0, 1).map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                            {item.designs?.length ? (
                              <>
                                <Image
                                  src={item.designs[0].apparel.url}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                                <Image
                                  src={item.designs[0].pngImage}
                                  alt="Design"
                                  fill
                                  className="object-contain"
                                />
                              </>
                            ) : (
                              <Image
                                src={item.images?.[0] || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.line_items.length > 1 && (
                        <p className="text-xs text-gray-500">
                          +{order.line_items.length - 1} more items
                        </p>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        ${order.total_amount}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 transition-all duration-200"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog
            open={!!selectedOrder}
            onOpenChange={() => setSelectedOrder(null)}
          >
            <DialogContent className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 p-0 transition-all duration-300 ease-in-out">
              <DialogHeader className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Order #{selectedOrder.id.slice(0, 8)}
                </DialogTitle>
                <span
                  className={`text-sm font-medium capitalize px-2 rounded-md ${
                    selectedOrder.status === "pending"
                      ? "text-amber-700 bg-amber-200"
                      : selectedOrder.status === "processing"
                      ? "text-blue-700 bg-blue-200" 
                      : selectedOrder.status === "shipped"
                      ? "text-purple-700 bg-purple-200"
                      : "text-green-700 bg-green-200"
                  }`}
                >
                  {selectedOrder.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogHeader>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">
                        Order ID:
                      </span>{" "}
                      <span className="text-gray-900">{selectedOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Date:</span>{" "}
                      <span className="text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">
                        Payment:
                      </span>{" "}
                      <span className="text-gray-900">Credit Card</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Total:</span>{" "}
                      <span className="text-gray-900">
                        ${selectedOrder.total_amount}{" "}
                        {selectedOrder.currency_code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.line_items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
                          {item.designs?.length ? (
                            <>
                              <Image
                                src={item.designs[0].apparel.url}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                              <Image
                                src={item.designs[0].pngImage}
                                alt="Design"
                                fill
                                className="object-contain"
                              />
                            </>
                          ) : (
                            <Image
                              src={item.images?.[0] || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.title}
                          </h5>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} • ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${selectedOrder.total_amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-gray-900 mt-1">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ${selectedOrder.total_amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-2 shadow-sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
