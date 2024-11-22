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
  Select,
  Toaster
  
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
import Image from "next/image";
import { useDeleteStore } from "@/app/hooks/store/useDeleteStore";
import { useCreatePublishableApiKey } from "@/app/hooks/publishableapikey/useCreatepublishablekey";
import { PublishableApiKey } from "@medusajs/medusa";

const Store = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSalesChannelCreated, setIsSalesChannelCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeCreationStatus, setStoreCreationStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [storeUrls, setStoreUrls] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSalesChannelCreated(false);
    setStoreCreationStatus("");
  };

  const PAGE_SIZE = 10;
  const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48;
  const vendorId = sessionStorage.getItem("vendor_id");
  
  const { data: storesData, error, isLoading, refetch: refreshStores } = useGetStores();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { mutate: createStore } = useCreateStore();
  const { mutate: createSalesChannel } = useCreateSalesChannel();
  const { mutate: createPublishableApiKey } = useCreatePublishableApiKey()
  const { mutate: deleteStore } = useDeleteStore();
  //loading
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [isStoreCreated, setIsStoreCreated] = useState(false);

  const storesWithMatchingSalesChannels = storesData?.map((store) => {
    const matchingSalesChannel = saleschannelsData?.find(
      (salesChannel) => salesChannel.id === store.default_sales_channel_id
    );
    return { ...store, matchingSalesChannel };
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salesChannelId: "",
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
    vendor_id: vendorId ?? "",
    store_type: "",
    publishableapikey: ""
  });

  const createStoreInstance = async (storeDetails) => {
    try {
      setStoreCreationStatus("Creating store instance...");
      const response = await fetch('http://localhost:3000/create-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to create store instance');
      }

      const data = await response.json();
      if (data.success) {
        setStoreUrls(prev => ({
          ...prev,
          [storeDetails.name]: data.storeInfo.url
        }));
        setStoreCreationStatus("Store is running and ready!");
        return data.storeInfo;
      }
      throw new Error(data.message || 'Failed to create store instance');
    } catch (error) {
      console.error('Error creating store instance:', error);
      setStoreCreationStatus("Error creating store");
      throw error;
    }
  };

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
    const limit = Math.min(offset + pageSize, storesWithMatchingSalesChannels.length);
    return storesWithMatchingSalesChannels.slice(offset, limit);
  }, [currentPage, storesWithMatchingSalesChannels]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
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
  
              setFormData(prev => ({
                ...prev,
                salesChannelId: response.id,
              }));
              
              createPublishableApiKey(
                {
                  salesChannelId: response.id,
                  keyData: {
                    title: response.name,
                    created_by: response.vendor_id
                  }
                },
                {
                  onSuccess: (apiKeyResponse) => {
                    toast.success("Success", {
                      description: "Publishable API Key Created Successfully",
                      duration: 1000,
                    });
                    console.log("Praveen API Key Created Successfully: ", apiKeyResponse.id)
                    // Add the publishable API key ID to the formData
                    setFormData(prev => ({
                      ...prev,
                      publishableapikey: apiKeyResponse.id
                    }));
                    
                    setIsSalesChannelCreated(true);
                    setLoading(false);
                  },
                  onError: (error) => {
                    console.error("Error creating publishable API key:", error);
                    toast.error("Error", {
                      description: "Error creating publishable API key",
                      duration: 1000,
                    });
                    setLoading(false);
                  }
                })
            },
            onError: (error) => {
              console.error("Error while creating sales channel:", error);
              toast.error("Error", {
                description: "Error while creating sales channel",
                duration: 1000,
              });
              setLoading(false);
            },
          }
        );
      } else {
        setShowLoadingModal(true);
        setLoadingStage("Initializing store creation...");
  
        const storeData = {
          name: formData.storeName,
          default_sales_channel_id: formData.salesChannelId,
          swap_link_template: formData.swapLinkTemplate,
          payment_link_template: formData.paymentLinkTemplate,
          invite_link_template: formData.inviteLinkTemplate,
          vendor_id: formData.vendor_id,
          store_type: formData.store_type,
          publishableapikey: formData.publishableapikey  
        };
  
        createStore(storeData, {
          onSuccess: async (response) => {
            try {
              setLoadingStage("Creating store instance...");
              await createStoreInstance({
                ...response,
                name: formData.storeName,
                vendor_id: formData.vendor_id,
                default_sales_channel_id: formData.salesChannelId,
                publishableapikey: formData.publishableapikey
              });
              
              setLoadingStage("Store created successfully!");
              setLoading(false);
              setIsStoreCreated(true);
              
              toast.success("Success", {
                description: "Store Created Successfully",
                duration: 1000,
              });
              
              refreshStores();
              
              setTimeout(() => {
                setShowLoadingModal(false);
                closeModal();
                setIsStoreCreated(false);
                router.refresh();
              }, 2000);
            } catch (error) {
              setLoadingStage("Error creating store instance");
              toast.error("Error", {
                description: "Error creating store instance",
                duration: 1000,
              });
              setTimeout(() => {
                setShowLoadingModal(false);
              }, 2000);
            }
          },
          onError: (error) => {
            console.error("Error while creating store:", error);
            setLoadingStage("Error creating store");
            toast.error("Error", {
              description: "Error while creating store",
              duration: 1000,
            });
            setTimeout(() => {
              setShowLoadingModal(false);
            }, 2000);
          },
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setLoadingStage("Error occurred");
      setTimeout(() => {
        setShowLoadingModal(false);
      }, 2000);
    }
  };


  const handleDelete = (id, event) => {
    event.stopPropagation();
    deleteStore(id, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Store Deleted Successfully",
          duration: 1000,
        });
        setTimeout(() => {
          router.refresh();
        }, 2000);
      },
      onError: (err) => {
        console.error("An error occurred:", err);
      },
    });
  };

  const getStoreUrl = (storeName) => {
    return storeUrls[storeName] || "#";
  };

  const LoadingModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <Container className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          {!isStoreCreated ? (
            <div className="animate-spin rounded-full h-12 w-12 -2 border-violet-600 mx-auto mb-4"></div>
          ) : (
            <div className="h-12 w-12 mx-auto mb-4 text-green-500">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          <Heading level="h3" className="text-xl font-semibold mb-2">
            {isStoreCreated ? "Success!" : "Please Wait"}
          </Heading>
          <Text className="text-gray-600">{loadingStage}</Text>
        </div>
      </Container>
    </div>
  );

  if (isLoading) {
    return <StoreSkeleton />;
  }

  return (
    <>
    <Toaster position="top-right"/>
    <div className="p-4">
      <Container className="overflow-hidden rounded-xl p-0">
        <div className="flex items-center rounded-xl justify-between px-8 pt-6 pb-4">
          <Heading className="text-2xl">Store</Heading>
          <div className="flex items-center gap-x-2">
            <Input
              size="small"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl "
            />
            <Button variant="secondary" className="rounded-[6px] px-6" onClick={openModal}>
              <Plus /> New Store
            </Button>
          </div>
        </div>
        <Table className="min-w-full m-2">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="py-2 px-4  text-left">S/N</Table.HeaderCell>
              <Table.HeaderCell className="py-2 px-4  text-left">Date Added</Table.HeaderCell>
              <Table.HeaderCell className="py-2 px-4  text-left">Store Name</Table.HeaderCell>
              <Table.HeaderCell className="py-2 px-4  text-left">Sales Channel Name</Table.HeaderCell>
              <Table.HeaderCell className="py-2 px-4  text-left">Store Type</Table.HeaderCell>
              <Table.HeaderCell className="py-2 px-4  text-left">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredStores?.map((store, index) => (
              <Table.Row key={store.id} className="hover:bg-gray-100">
                <Link href={getStoreUrl(store?.name)} target="_blank" className="contents">
                  <Table.Cell className="py-2 px-4  ">{index + 1}</Table.Cell>
                  <Table.Cell className="py-2 px-4 ">
                    {formatDate(store?.created_at) || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="py-2 px-4 ">{store?.name || "N/A"}</Table.Cell>
                  <Table.Cell className="py-2 px-4 ">
                    {store?.matchingSalesChannel?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="py-2 px-4 ">{store?.store_type || "N/A"}</Table.Cell>
                </Link>
                <Table.Cell className="py-2 px-4 ">
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
                      <DropdownMenu.Item
                        className="text-red-700"
                        onClick={(event) => handleDelete(store.id, event)}
                      >
                        <Trash className="mr-2" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg p-6 sm:h-auto sm:w-[556px] md:h-auto md:w-[656px] lg:h-auto lg:w-[786px] overflow-auto">
          <div className="flex flex-row justify-between">
            <Heading level="h2" className="text-xl sm:text-2xl font-semibold mb-4">
              {isSalesChannelCreated ? "Create Store & Sales Channel" : "Create Sales Channel"}
            </Heading>
            <IconButton variant="transparent">
              <XMarkMini onClick={closeModal} />
            </IconButton>
          </div>
          <hr />
          {showLoadingModal && <LoadingModal />}
          

            {!isSalesChannelCreated ? (
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
                        Store type <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        name="store_type"
                        value={formData.store_type}
                        onValueChange={(value) => handleChange({ target: { name: 'store_type', value } })}
                      >
                        <Select.Trigger className="w-full">
                          <Select.Value placeholder="Select store type" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="design_ui">Design UI store</Select.Item>
                          <Select.Item value="grocery">Pick And Buy Grocery store</Select.Item>
                        </Select.Content>
                      </Select>
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


const SkeletonLoader = ({ width, height, className }) => (
  <div
    className={`animate-pulse bg-gray-300 rounded ${className}`}
    style={{ width, height }}
  ></div>
);

const StoreSkeleton = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-ui-ase">
        <div className="flex flex-col sm:flex-row justify-between items-center p-6  border-ui-ase animate-pulse">
          <div className="bg-gray-200 h-8 w-24 rounded mb-4 sm:mb-0"></div>
          <div className="w-full sm:w-72">
            <div className="bg-gray-200 h-10 rounded w-full"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                {[...Array()].map((_, index) => (
                  <th
                    key={index}
                    className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle"
                  >
                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-100">
                  <td className="w-1/4 px-6 py-4">
                    <div className="bg-gray-200 h-6 w-24 rounded"></div>
                  </td>
                  <td className="w-1/4 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                      <div className="bg-gray-200 h-6 w-32 rounded"></div>
                    </div>
                  </td>
                  <td className="w-1/4 px-6 py-4">
                    <div className="bg-gray-200 h-6 w-40 rounded"></div>
                  </td>
                  <td className="w-1/4 px-6 py-4">
                    <div className="bg-gray-200 h-6 w-12 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



export default withAuth(Store);
