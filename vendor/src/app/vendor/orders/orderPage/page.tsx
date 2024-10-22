"use client";
import {
  Badge,
  Button,
  Text,
  Heading,
  IconButton,
  Table,
  DropdownMenu,
  Label,
  Tooltip,
} from "@medusajs/ui";
import withAuth from "@/lib/withAuth";
import React, { useMemo, useState } from "react";
import useSearch from "../../../hooks/useSearch";
import { FiSearch, FiUpload } from "react-icons/fi";
import { getColors } from "../../../utils/dummyData";
import Pagination from "../../../utils/pagination";
import Filter from "../../../utils/filter";
import { Input } from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { format, parseISO } from "date-fns";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useRouter } from "next/navigation";
const Order = () => {
  const { data: OrdersData } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData } = useGetCustomers();
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const router = useRouter();
  const pageSize = 6;
  const [filters, setFilters] = useState({
    status: false,
    paymentStatus: false,
    fulfillmentStatus: false,
    regions: false,
    salesChannel: false,
    date: false,
    filterName: "",
  });

  const getCustomerFirstName = (customerId: any) => {
    const customer = customersData?.find((customer: { id: any; }) => customer.id === customerId);
    return customer ? customer.first_name : 'N/A';
  };

  const storesWithMatchingSalesChannels = OrdersData?.map((order: { vendor_id: any; }) => {
     const matchingSalesChannel = saleschannelsData?.find(
      (salesChannel: { vendor_id: any; }) => salesChannel.vendor_id === order.vendor_id
    );
     return {
      ...order,
      matchingSalesChannel,  
    };
  });

  const handleInputChange = (e: { target: { name: any; checked: any; }; }) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
  };

  const handleNameChange = (e: { target: { value: any; }; }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      filterName: e.target.value,
    }));
  };

  let { searchQuery, setSearchQuery, filteredData } = useSearch({
    data: storesWithMatchingSalesChannels || [],
    searchKeys: ["customer", "paymentStatus"],
  });

  const currentOrders = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredData.length);
    return filteredData.slice(offset, limit);
  }, [currentPage, pageSize, filteredData]);

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy hh:mm a").toLocaleString();
  };

  const formatDate = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0 w-full">
          <div className="flex flex-row items-center space-x-2">
            <div className="flex flex-row justify-center items-center">
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    size="small"
                    className="px-12"
                    variant="transparent"
                  >
                    <Filter
                      count={0}
                      onAddFilter={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                      label={""}
                    />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="status"
                        checked={filters.status}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5 cursor-pointer"
                      />
                      <span className="text-gray-700">Status</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="paymentStatus"
                        checked={filters.paymentStatus}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5"
                      />
                      <span className="text-gray-700">Payment Status</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="fulfillmentStatus"
                        checked={filters.fulfillmentStatus}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5"
                      />
                      <span className="text-gray-700">Fulfillment Status</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="regions"
                        checked={filters.regions}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5"
                      />
                      <span className="text-gray-700">Regions</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="salesChannel"
                        checked={filters.salesChannel}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5"
                      />
                      <span className="text-gray-700">Sales Channel</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <Label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="date"
                        checked={filters.date}
                        onChange={handleInputChange}
                        className="form-checkbox text-indigo-600 h-5 w-5"
                      />
                      <span className="text-gray-700">Date</span>
                    </Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Name your filter..."
                        value={filters.filterName}
                        onChange={handleNameChange}
                        className="border border-gray-300 rounded-md p-2 flex-1"
                      />
                      <Button
                        variant="secondary"
                        className="px-4 py-2  bg-gray-200 text-gray-700 rounded-md"
                      >
                        Save
                      </Button>
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item className="gap-x-2">
                    <div className="flex flex-row justify-between space-x-20">
                      <Button
                        variant="secondary"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                      >
                        Clear
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md"
                      >
                        Apply
                      </Button>
                    </div>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
            <Badge
              size="small"
              className="hover:border-violet-400 hover:text-violet-400 cursor-pointer"
            >
              Completed
            </Badge>
            <Badge
              size="small"
              className="hover:border-violet-400 hover:text-violet-400 cursor-pointer"
            >
              Incompleted
            </Badge>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-[13px] pl-11 py-1 border bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-blue-500 outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              variant="secondary"
              className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100"
              onClick={openModal}
            >
              <FiUpload />
              <span>Export Orders</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {currentOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No Orders placed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full bg-transparent border-collapse">
              <Table.Header className="border-b border-gray-300">
                <Table.Row>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Order
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Date Added
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-2  text-xs md:text-sm font-medium text-gray-700">
                    Customer
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Fulfillment
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Payment Status
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Sales Channel
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Total
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentOrders.map((order: any, index: any) => (
                  <Table.Row
                    key={order.id}
                    onClick={() => {
                      router.push(`/vendor/orders/orderPage/${order.id}`);
                    }}
                    className="hover:bg-gray-50 text-[rgb(17, 24, 39)] hover:cursor-pointer"
                  >
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center hover:text-violet-500">
                      {index+1}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      <Tooltip
                        className="font-semibold text-[rgb(107, 114, 128)] text-[12px] md:text-[14px]"
                        content={formatTimestamp(order.created_at)}
                      >
                        <Button
                          variant="transparent"
                          className="text-[12px] md:text-[14px] text-[rgb(17, 24, 39)] hover:bg-none"
                        >
                          {formatDate(order.created_at)}
                        </Button>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex flex-row space-x-2">
                      <div>
                      <div
                        className={`w-6 h-6 flex items-left justify-center rounded-full text-white ${getColors(
                          index
                        )}`}
                      >
                        {order.email.charAt(0)}
                      </div>
                      </div>
                      <span className="text-gray-700 text-center">
                        {getCustomerFirstName(order.customer_id)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      {order.fulfillment_status}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex items-center justify-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full inline-block ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span>{order.payment_status}</span>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      {order.matchingSalesChannel?.name}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex flex-row justify-center space-x-2">
                      <span className="text-[14px] font-medium text-slate-600">
                        ${order.total_amount}
                      </span>{" "}
                      <span className="text-[12px] font-medium text-gray-400">
                        {order.currency_code.toUpperCase()}
                      </span>
                      <Tooltip
                        className="font-semibold text-[rgb(107, 114, 128)] text-[12px] md:text-[14px]"
                        content={order.currency_code}
                      >
                        <Button variant="transparent">
 
                             {order.currency_code}
                          
                        </Button>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredData.length}
          data={currentOrders}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-[200px] w-[700px]">
            <div className="flex flex-row justify-between border-ui-border-base border-b">
              <Heading level="h2" className="text-xl font-semibold mb-4">
                Export Orders
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeModal} />
              </IconButton>
            </div>
            <Text className="text-[12px] text-gray-400 font-semibold py-4 border-ui-border-base border-b">
              Initialize an export of your data
            </Text>
            <div className="flex justify-end py-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="transparent"
                className="ml-2 px-4   border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Order);
