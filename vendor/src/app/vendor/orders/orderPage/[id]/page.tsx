'use client'
import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useGetOrder } from '@/app/hooks/orders/useGetOrder';
import { useGetCustomers } from '@/app/hooks/customer/useGetCustomers';
import { BackButton } from "@/app/utils/backButton";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order } = useGetOrder(id as string);
  const { data: customers} = useGetCustomers()

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <>
          <BackButton name="orders" />

    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Customer Information</h2>
        <p><span className="font-medium">Email:</span> {order.email}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Order Summary</h2>
        <p><span className="font-medium">Status:</span> {order.status}</p>
        <p><span className="font-medium">Fulfillment Status:</span> {order.fulfillment_status}</p>
        <p><span className="font-medium">Payment Status:</span> {order.payment_status}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Items</h2>
        {order.line_items.map((item, index) => (
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
               <p>Quantity: {item.quantity}</p>
              <p>Price: {order.currency_code.toUpperCase()} {item.price.toFixed(2)}</p>
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
          Total: {order.currency_code.toUpperCase()} {parseFloat(order.total_amount).toFixed(2)}
        </p>
      </div>
    </div>
    </>
  );
};

export default OrderDetailsView;
