import React from 'react';
import Image from 'next/image';

interface LineItem {
  product_id: string;
  quantity: number;
  price: number;
  thumbnail_url: string;
  uploadImage_url: string;
}

interface OrderData {
  line_items: LineItem[];
  total_amount: number;
  currency_code: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string | null;
  email: string | null;
  region_id: string;
  vendor_id: string;
  public_api_key: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface OrderDetailsViewProps {
  orderData: OrderData;
  customerData: CustomerData;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ orderData, customerData }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Customer Information</h2>
        <p><span className="font-medium">Name:</span> {customerData.name}</p>
        <p><span className="font-medium">Email:</span> {customerData.email}</p>
        <p><span className="font-medium">Phone:</span> {customerData.phone}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Order Summary</h2>
        <p><span className="font-medium">Status:</span> {orderData.status}</p>
        <p><span className="font-medium">Fulfillment Status:</span> {orderData.fulfillment_status}</p>
        <p><span className="font-medium">Payment Status:</span> {orderData.payment_status}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Items</h2>
        {orderData.line_items.map((item, index) => (
          <div key={index} className="flex items-center mb-4 pb-4 border-b border-gray-200">
            <div className="w-16 h-16 relative mr-4">
              <Image
                src={item.thumbnail_url}
                alt={`Product ${item.product_id}`}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium">Product ID: {item.product_id}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {orderData.currency_code.toUpperCase()} {item.price.toFixed(2)}</p>
            </div>
            {item.uploadImage_url && (
              <div className="w-16 h-16 relative ml-4">
                <Image
                  src={item.uploadImage_url}
                  alt="Uploaded Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-right">
        <p className="text-xl font-bold">
          Total: {orderData.currency_code.toUpperCase()} {orderData.total_amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsView;