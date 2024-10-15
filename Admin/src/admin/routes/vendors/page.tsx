import React, { useEffect, useState } from "react";
import {
  CloudArrowDown,
  CloudArrowUp,
  PencilSquare,
  Trash,
  EllipsisHorizontal,
  Plus,
} from "@medusajs/icons";
import {
  Container,
  DropdownMenu,
  IconButton,
  Input,
  Button,
  Table,
  clx,
  usePrompt,
  Heading,
  useToggleState,
} from "@medusajs/ui";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import useNotification from "../../components/cust-hooks/use-notification";
import { getErrorMessage } from "../../components/cust-utils/error-messages";
import { Vendor } from "../../../models/vendor";
import VendorNew from "./createVendor/page";
import CircularLetter from "../../components/cust-utils/circular-letter";
import { RouteConfig } from "@medusajs/admin";

const PAGE_SIZE = 10;
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48;

const Vendors = () => {
  const [vendorData, setVendorData] = useState<Vendor[]>([]);
  const [query, setQuery] = useState("");
  const [openModal, showModal, closeModal] = useToggleState(false);
  const navigate = useNavigate();

  async function getVendors(query: string) {
    const url = `http://localhost:9000/admin/vendors?selector=${query}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch vendors: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      setVendorData(Array.isArray(data.vendors) ? data.vendors : []);
    } catch (error) {
      console.error("Error fetching vendors:", error.message);
      console.error("Full error:", error);
    }
  }

  useEffect(() => {
    getVendors(query);
  }, [query]);

  const table = useReactTable({
    data: vendorData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg overflow-hidden p-0">
        <Container className="overflow-hidden p-0">
          <div className="flex items-center justify-between px-8 pt-6 pb-4">
            <Heading className="text-2xl">Vendors</Heading>
            <div className="flex items-center gap-x-2">
              <Input
                size="small"
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  const filteredVendors = vendorData.filter((vendor) =>
                    vendor.company_name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  );
                  setVendorData(filteredVendors);
                }}
              />
              <Button variant="transparent">
                <CloudArrowDown /> Import Vendor
              </Button>
              <Button variant="transparent">
                <CloudArrowUp /> Export Vendor
              </Button>
              <Button variant="transparent" onClick={showModal}>
                <Plus /> Create Vendor
              </Button>

              {openModal && (
                <VendorNew
                  closeModal={closeModal}
                  openModal={openModal}
                  showModal={showModal}
                />
              )}
            </div>
          </div>
          <div style={{ height: TABLE_HEIGHT }}>
            <Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row
                    key={headerGroup.id}
                    className="[&_th]:w-1/5 [&_th:last-of-type]:w-[1%]"
                  >
                    {headerGroup.headers.map((header) => (
                      <Table.HeaderCell key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body className="border-b-0">
                {table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    className={clx("cursor-pointer [&_td:last-of-type]:w-[1%]")}
                    onClick={() => {
                      navigate(`/a/vendor/${row.original.id}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <Table.Pagination
            className={clx({
              "border-ui-border-base border-t": vendorData.length !== PAGE_SIZE,
            })}
            count={vendorData.length}
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={PAGE_SIZE}
          />
        </Container>
      </div>
      <div className="h-xlarge w-full"></div>
    </div>
  );
};

export default Vendors;

export const config: RouteConfig = {
  link: {
    label: "Vendors",
  },
};

const columnHelper = createColumnHelper<Vendor>();
const columns = [
  columnHelper.display({
    id: "serialNumber",
    header: "S/N",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("created_at", {
    header: "Date Added",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("company_name", {
    header: "Company Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("contact_name", {
    header: "Contact Name",
    cell: (info) => (
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("contact_email", {
    header: "Contact Email",
    cell: (info) => {
      const email = info.getValue();
      const firstLetter = email.charAt(0).toUpperCase();
      return (
        <div className="flex items-center">
          <CircularLetter letter={firstLetter} />
          <span style={{ marginLeft: "8px" }}>{email}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("contact_phone_number", {
    header: "Contact Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => <VendorTableRowActions row={info.row} />,
  }),
];

const VendorTableRowActions = ({ row }: any) => {
  const prompt = usePrompt();
  const notification = useNotification();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await prompt({
      title: "Are you sure?",
      description: "This will permanently delete the vendor",
    });

    if (!response) {
      return;
    }

    try {
      const deleteResponse = await fetch(
        `http://localhost:9000/admin/vendors/${row.original.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete vendor: ${deleteResponse.status}`);
      }
      navigate(0);
    } catch (err) {
      notification("An error occurred", getErrorMessage(err), "error");
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/a/vendors/${row.original.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal className="text-ui-fg-subtle" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleNavigate} className="text-green-700">
          <PencilSquare className="mr-2" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleDelete} className="text-red-700">
          <Trash className="mr-2" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
