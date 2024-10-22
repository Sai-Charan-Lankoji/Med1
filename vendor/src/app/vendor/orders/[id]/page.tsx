'use client'

import React from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useGetOrder } from '@/app/hooks/orders/useGetOrder'
import { useGetCustomerByEmail } from '@/app/hooks/customer/useGetCustomerByEmail'
import { BackButton } from "@/app/utils/backButton"
import { FiPackage, FiCreditCard, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const OrderDetailsView = () => {
  const { id } = useParams()
  const { data: order, isLoading } = useGetOrder(id as string)
  const email = order?.email
  const { data: customers } = useGetCustomerByEmail(email) // Fetching customer data by email
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null)

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (!order) {
    return <p className="text-center text-gray-500 mt-8">Order not found</p>
  }

  const toggleItemExpansion = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton name="orders" />
      <div className="bg-white shadow-lg rounded-lg mt-6 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Order Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUser className="mr-2" />
                Customer Information
              </h2>
              
              <p><span className="font-medium">Email:</span> {order.email}</p>
              
              {/* Display additional customer details */}
              {customers && customers.length > 0 && (
                <>
                  <p><span className="font-medium">Name:</span> {`${customers[0].first_name} ${customers[0].last_name}`}</p>
                  <p><span className="font-medium">Phone:</span> {customers[0].phone}</p>
                   {/* You can add more fields as needed */}
                </>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiPackage className="mr-2" />
                Order Summary
              </h2>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p><span className="font-medium">Fulfillment Status:</span> {order.fulfillment_status}</p>
              <p><span className="font-medium">Payment Status:</span> {order.payment_status}</p>
            </div>
          </div>

          <div className="my-8 border-t border-gray-200"></div>

          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {order.line_items.map((item, index) => (
            <div key={index} className="bg-white shadow rounded-lg mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-20 h-20 relative mr-4">
                    <Image
                      src={item.thumbnail_url || '/placeholder.svg'}
                      alt={`Product ${item.product_id}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                  <div className="flex-grow">
                     <p>Quantity: {item.quantity}</p>
                     <p>Tax Price: 10</p>
                    <p>Price: {order.currency_code.toUpperCase()} {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleItemExpansion(index)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={expandedItem === index ? "Collapse item details" : "Expand item details"}
                  >
                    {expandedItem === index ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                  </button>
                </div>
                {expandedItem === index && item.uploadImage_url && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Uploaded Design:</p>
                    <div className="w-full h-48 relative">
                      <Image
                        src={item.uploadImage_url}
                        alt="Uploaded Design"
                        layout="fill"
                        objectFit="contain"
                        className="rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="my-8 border-t border-gray-200"></div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Total</h2>
            <p className="text-2xl font-bold">
              {order.currency_code.toUpperCase()} {parseFloat(order.total_amount).toFixed(2)}
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 flex items-center hover:bg-blue-600 transition-colors">
              <FiPackage className="mr-2" />
              Update Fulfillment
            </button>
            <button className="bg-white text-blue-500 px-4 py-2 rounded-lg border border-blue-500 flex items-center hover:bg-blue-50 transition-colors">
              <FiCreditCard className="mr-2" />
              Update Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white shadow-lg rounded-lg mt-6 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="my-8 border-t border-gray-200"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg mb-4"></div>
        ))}
        <div className="my-8 border-t border-gray-200"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
)

export default OrderDetailsView
