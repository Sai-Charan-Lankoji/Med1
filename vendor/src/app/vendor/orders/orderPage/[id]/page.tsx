'use client'
import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import { useGetOrder } from '@/app/hooks/orders/useGetOrder';


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


const OrderDetailsView = ( ) => {
    const { id } = useParams();
    const { data: order, refetch: refetchProduct } = useGetOrder( id as string );    
    console.log("Order Details Page is: ", order)
      const orderData = {
        line_items: [
          {
            product_id: "prod_123",
            quantity: 2,
            price: 29.99,
            thumbnail_url: "",
            uploadImage_url: ""
          },
         ],
        total_amount: 59.98,
        currency_code: "usd",
        status: "pending",
        fulfillment_status: "not_fulfilled",
        payment_status: "awaiting",
        customer_id: "cust_456",
        email: "customer@example.com",
        region_id: "reg_01J2GRDEGRBXFBD4HZW443AF8K",
        vendor_id: "vendor_789",
        public_api_key: "pk_test_123456",
      };
      
      const customerData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567"
      };
      
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