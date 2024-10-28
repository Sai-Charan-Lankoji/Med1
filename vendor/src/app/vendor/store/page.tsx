"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Label,
  Table,
  Text,
  toast,
} from "@medusajs/ui";
import {
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
  XMarkMini,
} from "@medusajs/icons";
import withAuth from "@/lib/withAuth";
import { SalesChannelResponse, StoreResponse } from "@/app/@types/store";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useRouter } from "next/navigation";
import { useCreateStore } from "@/app/hooks/store/useCreateStore";
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel";
import Link from "next/link";

const Store = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSalesChannelCreated, setIsSalesChannelCreated] = useState(false); // Track if sales channel is created
  const [loading, setLoading] = useState(false); // To handle loading state
  const [currentPage, setCurrentPage] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSalesChannelCreated(false); // Reset state when closing the modal
  };
  const PAGE_SIZE = 10;
  const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const vendorId = sessionStorage.getItem("vendor_id");
  const { data: storesData, error, isLoading } = useGetStores();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { mutate: createStore } = useCreateStore();
  const { mutate: createSalesChannel } = useCreateSalesChannel();

  // Filter stores based on salesChannelId
  const storesWithMatchingSalesChannels = storesData?.map(
    (store: { default_sales_channel_id: any }) => {
      const matchingSalesChannel = saleschannelsData?.find(
        (salesChannel: { id: any }) =>
          salesChannel.id === store.default_sales_channel_id
      );

      return {
        ...store,
        matchingSalesChannel, // Attach the matching sales channel details to the store
      };
    }
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salesChannelId: "",
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
    vendor_id: vendorId ?? "",
  });

  const filteredStores = useMemo(() => {
    if (!storesWithMatchingSalesChannels) return [];
  
    const searchLower = searchQuery.toLowerCase();
  
    return storesWithMatchingSalesChannels.filter((store) => {
      const storeNameMatch = store.name?.toLowerCase().includes(searchLower);
      const createdDateMatch = store.created_at?.toLowerCase().includes(searchLower);
      const salesChannelNameMatch = store.matchingSalesChannel?.name?.toLowerCase().includes(searchLower);
  
      return storeNameMatch || createdDateMatch || salesChannelNameMatch;
    });
  }, [storesWithMatchingSalesChannels, searchQuery]);
  
  const pageSize = 6;
  const currentStores = useMemo(() => {
    if (!Array.isArray(storesWithMatchingSalesChannels)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(
      offset + pageSize,
      storesWithMatchingSalesChannels.length
    );
    return storesWithMatchingSalesChannels.slice(offset, limit);
  }, [currentPage, storesWithMatchingSalesChannels]);

  const formatDate = (isoDate: string | number | Date) => {
    const date = new Date(isoDate);

    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  // Handle form changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Common handleSubmit function for both forms
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    try {
      let salesChannelResponseData: SalesChannelResponse;
      let storeResponseData: StoreResponse | null = null;

      if (!isSalesChannelCreated) {
        createSalesChannel(
          {
            name: formData.title,
            description: formData.description,
            vendor_id: formData.vendor_id,
          },
          {
            onSuccess: (response) => {
              toast.success("Success", {
                description: "Sales Channel Created Successfully",
                duration: 1000,
              });
              salesChannelResponseData = response;
              if (salesChannelResponseData && salesChannelResponseData.id) {
                setFormData((prevData) => ({
                  ...prevData,
                  salesChannelId: salesChannelResponseData.id,
                }));
              } else {
                throw new Error("Failed to retrieve sales channel ID.");
              }

              // Proceed to store creation after sales channel is created
              setIsSalesChannelCreated(true);
            },
            onError: (error) => {
              console.error("Error while creating sales channel:", error);
              toast.error("Error", {
                description: "Error while creating sales channel",
                duration: 1000,
              });
            },
          }
        );
        setLoading(false); // Stop loading state for sales channel creation
      }

      // Handle store creation after sales channel
      else {
        createStore(
          {
            name: formData.storeName,
            default_sales_channel_id: formData.salesChannelId, // Use updated salesChannelId
            swap_link_template: formData.swapLinkTemplate,
            payment_link_template: formData.paymentLinkTemplate,
            invite_link_template: formData.inviteLinkTemplate,
            vendor_id: formData.vendor_id,
          },
          {
            onSuccess: () => {
              toast.success("Success", {
                description: "Store Created Successfully",
                duration: 1000,
              });
              setTimeout(() => {
                closeModal();
                router.refresh();
              }, 2000);
            },
            onError: (error) => {
              console.error("Error while creating store:", error);
              toast.error("Error", {
                description: "Error while creating store",
                duration: 1000,
              });
            },
          }
        );
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const getStoreUrl = (storeName: string) => {
    const storeUrls: { [key: string]: string } = {
      "Baseball Franchise": "http://localhost:8004/",
      "Football Franchise": "http://localhost:8003/",
      // Add more store mappings here
    };

    // Return the matching URL or a default URL
    return storeUrls[storeName] || "http://localhost:8004/";
  };

  return (
    <>
      <div className="flex items-center justify-end gap-x-2"></div>
      <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg overflow-hidden p-0">
        <Container className="overflow-hidden p-0">
          <div className="flex items-center justify-between px-8 pt-6 pb-4">
            <Heading className="text-2xl">Store</Heading>
            <div className="flex items-center gap-x-2">
              <Input
                size="small"
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="secondary" onClick={openModal}>
                <Plus /> New Store
              </Button>
            </div>
          </div>
          <Table className="min-w-full m-2">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="py-2 px-4 border-b text-left">
                  S/N
                </Table.HeaderCell>
                <Table.HeaderCell className="py-2 px-4 border-b text-left">
                  Date Added
                </Table.HeaderCell>
                <Table.HeaderCell className="py-2 px-4 border-b text-left">
                  Store Name
                </Table.HeaderCell>
                <Table.HeaderCell className="py-2 px-4 border-b text-left">
                  Sales Channel Name
                </Table.HeaderCell>
                <Table.HeaderCell className="py-2 px-4 border-b text-left">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredStores?.map(
                (
                  store: {
                    created_at: any;
                    name: any;
                    matchingSalesChannel: { name: any };
                    id: any;
                  },
                  index: number
                ) => (
                  <Table.Row key={store.id} className="hover:bg-gray-100">
                    <Link
                      href={getStoreUrl(store?.name)}
                      target="_blank"
                      className="contents"
                    >
                      <Table.Cell className="py-2 px-4 border-b">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="py-2 px-4 border-b">
                        {formatDate(store?.created_at) || "N/A"}
                      </Table.Cell>
                      <Table.Cell className="py-2 px-4 border-b">
                        {store?.name || "N/A"}
                      </Table.Cell>
                      <Table.Cell className="py-2 px-4 border-b">
                        {store?.matchingSalesChannel?.name || "N/A"}
                      </Table.Cell>
                    </Link>
                    <Table.Cell className="py-2 px-4 border-b">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton variant="transparent">
                            <EllipsisHorizontal className="text-ui-fg-subtle" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="text-green-700"
                            onClick={() => {
                              router.push(`/vendor/store/${store.id}`);
                            }}
                          >
                            <PencilSquare className="mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="text-red-700">
                            <Trash className="mr-2" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </Container>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 sm:h-auto sm:w-[556px] md:h-auto md:w-[656px] lg:h-auto lg:w-[786px] overflow-auto">
            <div className="flex flex-row justify-between">
              <Heading
                level="h2"
                className="text-xl sm:text-2xl font-semibold mb-4"
              >
                {isSalesChannelCreated
                  ? "Create Store & Sales Channel"
                  : "Create Sales Channel"}
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeModal} />
              </IconButton>
            </div>
            <hr />
            {!isSalesChannelCreated ? (
              // Sales Channel form
              <>
                <Heading
                  level="h2"
                  className="text-lg sm:text-xl font-semibold mt-4"
                >
                  Sales Channel Details
                </Heading>
                <Text className="text-lg font-semibold pt-4">General info</Text>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Apparel Design, Grocery Store, Paper Design Printing"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Description
                      </Label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Available products at our website, app..."
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="transparent"
                      className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              // Store form
              <>
                <Heading
                  level="h2"
                  className="text-lg sm:text-xl font-semibold mt-4"
                >
                  Store Details
                </Heading>
                <Text className="text-sm text-gray-600 pt-2 font-semibold">
                  Manage your business details
                </Text>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                    <div className="pt-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        Store name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="storeName"
                        placeholder="Store name"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Swap link template
                      </Label>
                      <Input
                        type="text"
                        name="swapLinkTemplate"
                        placeholder="https://acme.inc/swap={swap_id}"
                        value={formData.swapLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Draft order link template
                      </Label>
                      <Input
                        type="text"
                        name="paymentLinkTemplate"
                        placeholder="https://acme.inc/payment={payment_id}"
                        value={formData.paymentLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Invite link template
                      </Label>
                      <Input
                        type="text"
                        name="inviteLinkTemplate"
                        placeholder="https://acme.inc/invite?token={invite_token}"
                        value={formData.inviteLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="transparent"
                      className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Store);
