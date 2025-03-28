"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
  AlertCircle,
  RotateCcw,
  Ban,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define interfaces for type safety
interface CustomerData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_photo: string | null;
  vendor_id: string;
}

interface Order {
  id: string;
  total_amount: string;
  currency_code: string;
  fulfillment_status: string;
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

// Map fulfillment_status to simplified UI statuses
const statusMapping = {
  not_fulfilled: "pending",
  partially_fulfilled: "processing",
  fulfilled: "processing",
  partially_shipped: "shipped",
  shipped: "shipped",
  partially_returned: "delivered",
  returned: "delivered",
  canceled: "canceled",
  requires_action: "pending",
};

// Define status icons and colors based on the simplified UI statuses
const statusIcons = {
  pending: <Clock className="w-5 h-5 text-amber-500" />,
  processing: <Package className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-purple-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  canceled: <Ban className="w-5 h-5 text-red-500" />,
};

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
  processing: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
  shipped: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
  canceled: "bg-red-50 text-red-700 border-red-100 hover:bg-red-100",
};

const statusBadgeColors = {
  pending: "text-amber-700 bg-amber-200",
  processing: "text-blue-700 bg-blue-200",
  shipped: "text-purple-700 bg-purple-200",
  delivered: "text-green-700 bg-green-200",
  canceled: "text-red-700 bg-red-200",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customer/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch customer data");
      const { data } = await response.json();
      setCustomerData({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        profile_photo: data.profile_photo,
        vendor_id: data.vendor_id,
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setCustomerData(null);
      setError("Failed to fetch customer data. Please log in.");
      toast.error("Please log in to view your orders.");
      setLoading(false);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!customerData?.id) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/customer/${customerData.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.data);
      setFilteredOrders(data.data);
      setLoading(false);
    } catch (error) {
      setError("Unable to load orders. Please try again later.");
      toast.error("Unable to load orders. Please try again later.");
      setLoading(false);
    }
  }, [customerData?.id]);

  // Fetch customer data on mount
  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // Fetch orders once customer data is available
  useEffect(() => {
    if (customerData?.id) fetchOrders();
  }, [customerData, fetchOrders]);

  // Filter orders based on tab and search query
  useEffect(() => {
    let result = [...orders];
    if (activeTab !== "all") {
      result = result.filter(
        (order) =>
          statusMapping[
            order.fulfillment_status as keyof typeof statusMapping
          ] === activeTab
      );
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

  // Map fulfillment_status to tracking timeline steps
  const getTrackingTimeline = (fulfillmentStatus: string) => {
    const statuses = [
      "not_fulfilled",
      "partially_fulfilled",
      "fulfilled",
      "partially_shipped",
      "shipped",
      "partially_returned",
      "returned",
    ];
    const canceledStatuses = ["canceled", "requires_action"];
    const currentIndex = statuses.indexOf(fulfillmentStatus);
    const isCanceled = canceledStatuses.includes(fulfillmentStatus);

    const timeline = [
      {
        status: "Order Placed",
        date: new Date(selectedOrder?.createdAt || "").toLocaleDateString(),
        completed: true,
        icon: <ShoppingBag className="w-5 h-5 text-gray-600" />,
      },
      {
        status: "Processing",
        date:
          currentIndex >= 1
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 86400000
              ).toLocaleDateString()
            : "Pending",
        completed: currentIndex >= 1,
        icon: <Package className="w-5 h-5 text-gray-600" />,
      },
      {
        status: "Shipped",
        date:
          currentIndex >= 3
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 172800000
              ).toLocaleDateString()
            : "Pending",
        completed: currentIndex >= 3,
        icon: <Truck className="w-5 h-5 text-gray-600" />,
      },
      {
        status: "Delivered",
        date:
          currentIndex >= 5
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 259200000
              ).toLocaleDateString()
            : "Pending",
        completed: currentIndex >= 5,
        icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
      },
    ];

    if (isCanceled) {
      timeline.push({
        status: "Canceled",
        date: new Date(selectedOrder?.createdAt || "").toLocaleDateString(),
        completed: true,
        icon: <Ban className="w-5 h-5 text-red-600" />,
      });
    }

    if (fulfillmentStatus === "requires_action") {
      timeline.push({
        status: "Requires Action",
        date: "Pending",
        completed: false,
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      });
    }

    if (fulfillmentStatus === "partially_returned" || fulfillmentStatus === "returned") {
      timeline.push({
        status: "Returned",
        date:
          currentIndex >= 5
            ? new Date(
                new Date(selectedOrder?.createdAt || "").getTime() + 345600000
              ).toLocaleDateString()
            : "Pending",
        completed: currentIndex >= 5,
        icon: <RotateCcw className="w-5 h-5 text-gray-600" />,
      });
    }

    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-6 py-2"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:w-1/2 lg:w-1/3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <Input
                    type="text"
                    placeholder="Search by order ID or product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    aria-label="Search orders by ID or product name"
                  />
                </div>

                {/* Tabs for Filtering */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="flex flex-nowrap overflow-x-auto sm:overflow-x-hidden gap-2 bg-transparent p-0">
                    <TabsTrigger
                      value="all"
                      className={`capitalize py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === "all"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } whitespace-nowrap`}
                      aria-label="View all orders"
                    >
                      All Orders
                    </TabsTrigger>
                    {["pending", "processing", "shipped", "delivered", "canceled"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`capitalize py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeTab === tab
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } whitespace-nowrap`}
                        aria-label={`View ${tab} orders`}
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
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
                filteredOrders.map((order) => {
                  const uiStatus =
                    statusMapping[
                      order.fulfillment_status as keyof typeof statusMapping
                    ];
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                    >
                      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">
                            #{order.id.slice(0, 8)}
                          </span>
                          <Badge
                            className={`${
                              statusColors[uiStatus as keyof typeof statusColors]
                            } border text-sm py-1 px-2`}
                          >
                            {statusIcons[uiStatus as keyof typeof statusIcons]}
                            <span className="ml-1">
                              {uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1)}
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
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 p-0 transition-all duration-300 ease-in-out">
              <DialogHeader className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Order #{selectedOrder.id.slice(0, 8)}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium capitalize px-2 rounded-md ${
                      statusBadgeColors[
                        statusMapping[
                          selectedOrder.fulfillment_status as keyof typeof statusMapping
                        ] as keyof typeof statusBadgeColors
                      ]
                    }`}
                  >
                    {statusMapping[
                      selectedOrder.fulfillment_status as keyof typeof statusMapping
                    ]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </DialogHeader>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Order Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Order ID:</span>{" "}
                      <span className="text-gray-900">{selectedOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Date:</span>{" "}
                      <span className="text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Payment:</span>{" "}
                      <span className="text-gray-900">Credit Card</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Total:</span>{" "}
                      <span className="text-gray-900">
                        ${selectedOrder.total_amount} {selectedOrder.currency_code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Tracking Status
                  </h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                    {getTrackingTimeline(selectedOrder.fulfillment_status).map(
                      (step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 mb-4 relative"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              step.completed
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                step.completed ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {step.status}
                            </p>
                            <p
                              className={`text-xs ${
                                step.completed ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {step.date}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Items
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.line_items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
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
                          {item.selected_size && item.selected_color && (
                            <p className="text-xs text-gray-600">
                              Size: {item.selected_size} • Color: {item.selected_color}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${selectedOrder.total_amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-gray-900 mt-2">
                      <span>Total</span>
                      <span className="text-blue-600">${selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  {statusMapping[
                    selectedOrder.fulfillment_status as keyof typeof statusMapping
                  ] === "delivered" && (
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/orders/${selectedOrder.id}/review`)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-6 py-2 shadow-sm"
                    >
                      Write a Review
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-2 shadow-sm"
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