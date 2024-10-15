"use client";

import React, { useMemo, useState } from "react";
import { useAdminCustomer, useAdminOrders } from "medusa-react";
import { useParams } from "next/navigation";
import { Button, Container, DropdownMenu, IconButton, Table } from "@medusajs/ui";
import { ChevronDownMini, ChevronUpMini, EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import Image from "next/image";
import Pagination from "@/app/utils/pagination";
import { BackButton } from "@/app/utils/backButton";

const Customer = () => {
  const [currentPage, setCurrentPage] = useState(0); 
  const [showRawData, setShowRawData] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);


  const params = useParams();
  const customerId = params?.id as string | undefined;
  const { isLoading, customer } = useAdminCustomer(customerId!, {
    enabled: !!customerId,
  });
  const { orders } = useAdminOrders();

  const getOrderCountForCustomer = (customerId: string) => {
    if (!orders) return 0;
    return orders.filter((order) => order.customer_id === customerId).length;
  };

  const pageSize = 5;

  const currentOrders = useMemo(() => {
    if (!orders) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, orders.length);
    return orders.slice(offset, limit);
  }, [currentPage, orders, pageSize]);

  return (
    <div> 
        <BackButton name = "Customers"/>
      {isLoading && <span>Loading...</span>}
      {!customerId && <span>Customer ID not provided in the URL</span>}
      {customer && (
        <>
          <Container className="bg-white shadow-none border border-gray-300 mb-2">
            <div className="flex flex-col">
              <div className="flex items-center ">
                <div className="bg-purple-600 text-white text-2xl w-16 h-16 rounded-full flex items-center justify-center mr-3">
                  {customer.first_name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  <p className="text-gray-500 text-sm">{customer.email}</p>
                </div>
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton
                        variant="transparent"
                        className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                      >
                        <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className=" bg-white ">
                      <DropdownMenu.Label>Actions</DropdownMenu.Label>
                      <DropdownMenu.Item
                        className="bg-white text-gray-500  hover:text-white"
                        // onClick={() => {
                        //   router.push(`/vendor/customers/cusomerPage/${customer.id}`);
                        // }}
                      >
                        <PencilSquare className="mr-2" />
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        // onClick={() => {
                        //   handleDelete(product.id);
                        // }}
                        className="bg-white text-gray-500  hover:text-white"
                      >
                        <Trash className="mr-2" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex mt-8">
                <div className="">
                  <p className="text-sm text-gray-400">First seen</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="border border-r-gray-300 mx-4"></div>

                <div className="">
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-gray-600 text-sm">
                    {" "}
                    {customer.phone || "N/A"}
                  </p>
                </div>
                <div className="border border-r-gray-300 mx-4"></div>

                <div className="">
                  <p className="text-sm text-gray-400">Orders</p>
                  <p className="text-gray-600 text-sm">
                    {" "}
                    {getOrderCountForCustomer(customer.id)}
                  </p>
                </div>
                <div className="border border-r-gray-300 mx-4"></div>

                <div className="">
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-gray-600 flex items-center text-sm">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        customer.has_account ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {customer.has_account ? "Registered" : "No Account"}
                  </p>
                </div>
              </div>
            </div>
          </Container>
          <Container className="bg-white">
            <div className="mb-2">
              <h1 className="text-2xl font-semibold">
                Orders {orders?.length}
              </h1>
              <p className="text-[12px] text-gray-500">
                An overview of Customer Orders
              </p>
            </div>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>#</Table.HeaderCell>
                  <Table.HeaderCell>Image</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Fulfillment</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders?.map((order) => {
                  return (
                    <Table.Row
                      key={order.id}
                      className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                    >
                      <Table.Cell>{order.display_id}</Table.Cell>

                      <Table.Cell className="text-ui-fg-muted">
                        {order?.items?.length > 0 && (
                          <div className="flex items-center">
                            <div className="mr-2">
                            <Image
                                src={
                                  order.items[0]?.thumbnail ||
                                  "/path-to-fallback-image.jpg"
                                }
                                width={40}
                                height={40}
                                alt="Item Thumbnail"
                              />
                            </div>

                            {order.items.length > 1 && (
                              <span className="text-gray-500">
                                +{order.items.length - 1}
                              </span>
                            )}
                          </div>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </Table.Cell>
                      <Table.Cell className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full mr-2 ${
                            order.fulfillment_status === "not_fulfilled"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        ></span>
                        {order.fulfillment_status}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${
                              order.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></span>
                          {order.status}

                        </div>
                      </Table.Cell>

                      <Table.Cell>{order.paid_total || "N/A"}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table> 

            <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={orders?.length ?? 0}
        data={currentOrders}
      />
          </Container> 


          <Container className=" mt-4 bg-white shadow-none rounded-lg ">
        <h1 className="text-[24px] mb-2">Raw Product</h1>
        <div className="flex flex-row justify-between ">
          <Button
            variant="transparent"
            onClick={() => setShowRawData(!showRawData)}
            className="mt-4 px-4 py-2 text-slate-900 rounded-md "
          >
            <p className="text-[14px] text-gray-400">
              .... ({Object.keys(customer).length} items)
            </p>
            {showRawData ? <ChevronUpMini /> : <ChevronDownMini />}
          </Button>
        </div>
        {showRawData && (
           <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm text-blue-800">
                {JSON.stringify(customer, null, 2)}
              </pre>
        )}
      </Container>
        </>
      )}

      
    </div>
  );
};

export default Customer;
