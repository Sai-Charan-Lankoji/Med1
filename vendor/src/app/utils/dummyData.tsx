export const ordersdata = [
    {
      id: 1,
      dateAdded: "2024-08-01",
      customer: "John Doe",
      fulfillment: "Shipped",
      paymentStatus: "Paid",
      salesChannel: "Online Store",
      total: "$120.00",
    },
    {
      id: 2,
      dateAdded: "2024-08-02",
      customer: "Jane Smith",
      fulfillment: "Pending",
      paymentStatus: "Awaiting",
      salesChannel: "Retail Store",
      total: "$85.50",
    },
    {
      id: 3,
      dateAdded: "2024-08-03",
      customer: "Alice Johnson",
      fulfillment: "Delivered",
      paymentStatus: "Paid",
      salesChannel: "Mobile App",
      total: "$50.75",
    },
    {
      id: 4,
      dateAdded: "2024-08-04",
      customer: "Bob Brown",
      fulfillment: "Shipped",
      paymentStatus: "Awaiting",
      salesChannel: "Marketplace",
      total: "$150.20",
    },
    {
      id: 5,
      dateAdded: "2024-08-05",
      customer: "Charlie Davis",
      fulfillment: "Delivered",
      paymentStatus: "Paid",
      salesChannel: "Online Store",
      total: "$230.00",
    },
  ];
  
  export const getColors = (index: number) => {
    const colors = [
      "bg-gray-700",
      "bg-red-700",
      "bg-blue-700",
      "bg-green-700",
      "bg-yellow-700",
      "bg-purple-700",
    ];
    return colors[index % colors.length];
  };
  