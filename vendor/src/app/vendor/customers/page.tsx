"use client";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { DropdownMenu, Heading, Input, Table } from "@medusajs/ui";
import withAuth from "@/lib/withAuth";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { getColors } from "@/app/utils/dummyData";
import { useRouter } from "next/navigation";

const Customer = () => {
  const { data: customers, error, isLoading } = useGetCustomers();
  const { data: orders } = useGetOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const getOrderCountForCustomer = (customerId) => {
    if (!orders) return 0;
    return orders.filter((order) => order.customer_id === customerId).length;
  };

  const formatDate = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy");
  };

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    const searchLower = searchQuery.toLowerCase();

    return customers.filter((customer) => {
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-ui-border-base">
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-ui-border-base">
        <Heading className="text-ui-fg-base text-xl leading-6 font-medium mb-4 sm:mb-0">
          Customers
        </Heading>
        <div className="w-full sm:w-72">
          <Input
            size="base"
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row className="border-t-0">
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Date added
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Email
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle text-right">
                Orders
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <Table.Row
                  key={customer.id}
                  onClick={() => router.push(`/vendor/customers/${customer.id}`)}
                  className="cursor-pointer transition-colors hover:bg-ui-bg-base-hover"
                >
                  <Table.Cell className="w-1/4 px-6 py-4 text-sm text-ui-fg-subtle">
                    {formatDate(customer.created_at)}
                  </Table.Cell>
                  
                  <Table.Cell className="w-1/4 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-medium ${getColors(index)}`}
                      >
                        {customer.first_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-ui-fg-base whitespace-nowrap">
                        {customer.first_name} {customer.last_name}
                      </span>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="w-1/4 px-6 py-4">
                    <span className="text-sm text-ui-fg-subtle">
                      {customer.email}
                    </span>
                  </Table.Cell>
                  
                  <Table.Cell className="w-1/4 px-6 py-4 text-right">
                    <span className="text-sm font-medium text-ui-fg-base">
                      {getOrderCountForCustomer(customer.id)}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} className="py-10 text-center">
                  <span className="text-[28px] text-black">No customers found</span>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default withAuth(Customer);
