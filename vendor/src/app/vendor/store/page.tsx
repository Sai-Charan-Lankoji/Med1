
"use client"

import React, { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Search, Plus, MoreHorizontal, PencilIcon, TrashIcon, Loader2, CheckCircle } from 'lucide-react'
import withAuth from "@/lib/withAuth"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels"
import { useCreateStore } from "@/app/hooks/store/useCreateStore"
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel"
import { useDeleteStore } from "@/app/hooks/store/useDeleteStore"
import { useCreatePublishableApiKey } from "@/app/hooks/publishableapikey/useCreatepublishablekey"
import { getColors } from "@/app/utils/dummyData"
import Pagination from "@/app/utils/pagination"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateStore } from "@/app/hooks/store/useUpdateStore"
import { useToast } from "@/hooks/use-toast" 
import { useGetPlan } from "@/app/hooks/plan/useGetPlan" 
import { useGetVendor } from "@/app/hooks/vendor/useGetVendor"
import { plan_id, vendor_id } from "@/app/utils/constant"




const getStoreLimitFromPlan = (plan) => {
  if (!plan || !Array.isArray(plan.features)) return 0; // Ensure plan.features exists and is an array
  const limitFeature = plan.features.find((feature) =>
    feature.toLowerCase().includes("store") 

  );
  if (!limitFeature) return 0;

  if (limitFeature.toLowerCase().includes("Unlimited")) {
    return Infinity;
  }

  const match = limitFeature.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const Store = () => { 
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSalesChannelCreated, setIsSalesChannelCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [storeUrls, setStoreUrls] = useState({})
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false)

  const { toast } = useToast()

  const PAGE_SIZE = 6
  const { data: vendor, isLoading: vendorLoading } = useGetVendor();
  const {data : currentPlan} = useGetPlan(plan_id) 
   const { data: storesData, isLoading, refetch: refreshStores } = useGetStores()
  const { data: saleschannelsData } = useGetSalesChannels()
  const { mutate: createStore } = useCreateStore()
  const { mutate: createSalesChannel } = useCreateSalesChannel()
  const { mutate: createPublishableApiKey } = useCreatePublishableApiKey()
  const { mutate: deleteStore } = useDeleteStore()
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingStage, setLoadingStage] = useState("")
  const [isStoreCreated, setIsStoreCreated] = useState(false)
  const { mutate: updateStore } = useUpdateStore()
  const [storeToDelete, setStoreToDelete] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingStore, setIsDeletingStore] = useState(false)

  const [isLoadingModalMounted, setIsLoadingModalMounted] = useState(false)

  useEffect(() => {
    if (showLoadingModal) {
      setIsLoadingModalMounted(true)
    }
  }, [showLoadingModal])

  useEffect(() => {
    if (!showLoadingModal && isLoadingModalMounted) {
      const timer = setTimeout(() => {
        setIsLoadingModalMounted(false)
      }, 300) // Adjust this value to match your exit animation duration

      return () => clearTimeout(timer)
    }
  }, [showLoadingModal, isLoadingModalMounted])

  const storesWithMatchingSalesChannels = storesData?.map((store) => {
    const matchingSalesChannel = saleschannelsData?.find(
      (salesChannel) => salesChannel.id === store.default_sales_channel_id
    )
    return { ...store, matchingSalesChannel }
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salesChannelId: "",
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
    vendor_id: vendor_id ?? "",
    store_type: "",
    publishableapikey: ""
  })



  const filteredStores = useMemo(() => {
    if (!storesWithMatchingSalesChannels) return []

    const searchLower = searchQuery.toLowerCase()
    return storesWithMatchingSalesChannels.filter((store) => {
      const storeNameMatch = store.name?.toLowerCase().includes(searchLower)
      const createdDateMatch = store.created_at?.toLowerCase().includes(searchLower)
      const salesChannelNameMatch = store.matchingSalesChannel?.name?.toLowerCase().includes(searchLower)
      return storeNameMatch || createdDateMatch || salesChannelNameMatch
    })
  }, [storesWithMatchingSalesChannels, searchQuery])

  const paginatedStores = useMemo(() => {
    const startIndex = currentPage * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return filteredStores.slice(startIndex, endIndex)
  }, [currentPage, filteredStores])

  const formatDate = (isoDate) => {
    const date = parseISO(isoDate)
    return format(date, "dd MMM yyyy")
  } 


   // Function to get store limit from plan features
 

  const canCreateStore = () => {
    if (!currentPlan ) return false
    const storeLimit = currentPlan?.no_stores
 
    if (storeLimit === "unlimited") {
      return true;
    }
    // return storesData.length < storeLimit
    return storesData.length < parseInt(storeLimit, 10);
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isSalesChannelCreated && !canCreateStore()) {
      setShowPlanLimitModal(true);
      return;
    }
  
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
              toast({
                title: "Success",
                description: "Sales Channel Created Successfully",
              });
  
              setFormData((prev) => ({
                ...prev,
                salesChannelId: response.id,
              }));
  
              createPublishableApiKey(
                {
                  title: response.name,
                  created_by: response.vendor_id,
                },
                {
                  onSuccess: (apiKeyResponse) => {
                    toast({
                      title: "Success",
                      description: "Publishable API Key Created Successfully",
                    });
  
                    setFormData((prev) => ({
                      ...prev,
                      publishableapikey: apiKeyResponse.id,
                    }));
  
                    setIsSalesChannelCreated(true);
                    setLoading(false);
                  },
                  onError: (error) => {
                    console.error("Error creating publishable API key:", error);
                    toast({
                      title: "Error",
                      description: "Error creating publishable API key",
                      variant: "destructive",
                    });
                    setLoading(false);
                  },
                }
              );
            },
            onError: (error) => {
              console.error("Error while creating sales channel:", error);
              toast({
                title: "Error",
                description: "Error while creating sales channel",
                variant: "destructive",
              });
              setLoading(false);
            },
          }
        );
      } else {
        setIsModalOpen(false); // Close the store creation modal
         setLoadingStage("Initializing domain creation...");
  
        const storeName = formData.storeName;
        const addDomainUrl = "http://localhost:5000/api/stores/add-domain";  
  
        // Check if store name already exists and create domain
        let domain = null;
        try {
          const domainResponse = await fetch(addDomainUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ storeName }),
          });
  
          if (!domainResponse.ok) {
            const errorData = await domainResponse.json();
            throw new Error(errorData.message || "Error creating domain");
          }
  
          const domainData = await domainResponse.json();
          domain = domainData.domain; // Assuming the domain is returned as { domain: 'example.vercel.app' }
          if(!domain.includes("https://")){
            domain = `https://${domain}`;
          }
        } catch (error) {
          console.error("Error during domain creation:", error);
          setLoadingStage("Error creating domain");
          toast({
            title: "Error",
            description:  "Failed to create domain",
            variant: "destructive",
          });
          setLoading(false);
          setShowLoadingModal(false);
          return;
        }
  
        setLoadingStage("Creating store...");
  
        const storeData = {
          name: storeName,
          store_url: domain,
          default_sales_channel_id: formData.salesChannelId,
          swap_link_template: formData.swapLinkTemplate,
          payment_link_template: formData.paymentLinkTemplate,
          invite_link_template: formData.inviteLinkTemplate,
          vendor_id: formData.vendor_id,
          store_type: formData.store_type,
          publishableapikey: formData.publishableapikey,
        };
  
        // Create the store
        createStore(storeData, {
          onSuccess: async (response) => {
            if(response.ok){
            toast({
              title: "Success",
              description: "Store Created Successfully",
            });
          }
            setIsStoreCreated(true);
            setLoading(false);
            setShowLoadingModal(false);
          },
          onError: (error) => {
            console.error("Error while creating store:", error);
            setLoadingStage("Error creating store");
            toast({
              title: "Error",
              description: "Error while creating store",
              variant: "destructive",
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
  
  const initiateDelete = (id, event) => {
    event.stopPropagation()
    setStoreToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!storeToDelete) return
    try {
      // First, delete the store from your backend
      await deleteStore(storeToDelete)
    } catch (error) {
      console.error("Error deleting store:", error)
      //setLoadingStage("Error deleting store and its instance")
      toast({
        title: "Error",
        description: "Error deleting store and its instance",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsDeleteModalOpen(false)
        setStoreToDelete(null)
      }, 2000)
    }
  }

  const getRowIndex = (index: number) => {
    return (currentPage * PAGE_SIZE) + index + 1
  }

  const LoadingModal = () => (
    <AnimatePresence>
      {isLoadingModalMounted && (
        <Dialog 
          open={showLoadingModal} 
          onOpenChange={setShowLoadingModal}
          modal={true}
        >
          <DialogContent 
            className="sm:max-w-[425px]"
            onCloseAutoFocus={(e) => {
              if (!isStoreCreated && !isDeletingStore) {
                e.preventDefault();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>{isStoreCreated || isDeletingStore ? "Success!" : "Please Wait"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  {!isStoreCreated && !isDeletingStore ? (
                    <div className="animate-spin">
                      <Loader2 className="h-8 w-8 text-blue-500" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </motion.div>
                  )}
                </div>
                <p className="text-center text-sm text-gray-500">{loadingStage}</p>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );

  const DeleteConfirmationModal = () => (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent className="sm:max-w-[425px] bg-slate-100">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Confirm Delete</DialogTitle>
        </DialogHeader>
        
        {isDeletingStore ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-700 font-semibold">
              Shutting down and deleting store...
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <p className="text-center text-md text-gray-700">
                Are you sure you want to delete this store? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="mr-2 w-20"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="w-24"
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );



  const PlanLimitModal = () => (
    <Dialog open={showPlanLimitModal} onOpenChange={setShowPlanLimitModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Store Limit Reached</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-center text-gray-700">
            You&apos;ve reached the maximum number of stores allowed in your {currentPlan?.name} plan 
            ({getStoreLimitFromPlan(currentPlan)} stores).
          </p>
          <p className="text-center text-gray-600">
            Please upgrade your plan to create more stores.
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={() => setShowPlanLimitModal(false)}
            className="mr-2"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => router.push('/vendor/billing')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Upgrade Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (isLoading) {
    return <StoreSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold text-indigo-900 mb-4 sm:mb-0">
          Store Management
        </h1>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-row justify-center space-x-2 w-full sm:w-72 relative"
        >
          <Input
            type="search"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="overflow-x-auto bg-white rounded-xl shadow-md"
      >
        <Table className="">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Store</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Date Added</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Store Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Sales Channel</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Store Type</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedStores.map((store, index) => (
                <motion.tr
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer transition-colors hover:bg-indigo-50"
                >
                  <TableCell className="px-4 py-2 whitespace-nowrap text-sm font-bold text-indigo-900">
                    #{getRowIndex(index)}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                    {formatDate(store.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColors(index)}`}
                      >
                        {store.name.charAt(0).toUpperCase()}
                      </motion.div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-900">
                          <Link href={store?.store_url} target="_blank" className="hover:underline">
                            {store.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                    {store.matchingSalesChannel?.name || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                    {store.store_type || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/vendor/store/${store.id}`)}>
                          <PencilIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(event) => initiateDelete(store.id, event)}>
                          <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredStores.length}
          data={filteredStores}
        />
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="right-8 shadow-lg mt-4 bg-blue-600 hover:bg-blue-900" onClick={(e) => {
              if (!canCreateStore()) {
                e.preventDefault()
                setShowPlanLimitModal(true)
                return
              }
            }}>
            <Plus className="mr-2 h-4 w-4" /> New Store
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-blue-600">{isSalesChannelCreated ? "Create Store" : "Create Sales Channel"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {!isSalesChannelCreated ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storeName" className="text-right">
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="store_type" className="text-right">
                    Store Type
                  </Label>
                  <Select
                    name="store_type"
                    value={formData.store_type}
                    onValueChange={(value) => handleChange({ target: { name: 'store_type', value } })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select store type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design_ui">Design UI store</SelectItem>
                      <SelectItem value="grocery">Pick And Buy Grocery store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="swapLinkTemplate" className="text-right">
                    Swap Link Template
                  </Label>
                  <Input
                    id="swapLinkTemplate"
                    name="swapLinkTemplate"
                    value={formData.swapLinkTemplate}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentLinkTemplate" className="text-right">
                    Payment Link Template
                  </Label>
                  <Input
                    id="paymentLinkTemplate"
                    name="paymentLinkTemplate"
                    value={formData.paymentLinkTemplate}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inviteLinkTemplate" className="text-right">
                    Invite Link Template
                  </Label>
                  <Input
                    id="inviteLinkTemplate"
                    name="inviteLinkTemplate"
                    value={formData.inviteLinkTemplate}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="mr-2 w-20">
                Cancel
              </Button>
              <Button type="submit" className="w-24 bg-blue-600 hover:bg-blue-950">
                {loading ? (
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <LoadingModal />
      <DeleteConfirmationModal />
      <PlanLimitModal />   
       </motion.div>
  )
}

const StoreSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg border border-indigo-100/50 p-6 animate-pulse"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="h-8 bg-indigo-200 rounded w-40 mb-4 sm:mb-0"></div>
        <div className="w-full sm:w-72 h-10 bg-indigo-200 rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl shadow-inner overflow-hidden">
        <div className="border-b border-indigo-200">
          <div className="flex px-6 py-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-1 h-4 bg-indigo-100 rounded mr-2"></div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-indigo-100">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex px-6 py-4">
              {[...Array(6)].map((_, cellIndex) => (
                <div key={cellIndex} className="flex-1 h-4 bg-indigo-50 rounded mr-2"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="h-8 bg-indigo-200 rounded w-64"></div>
      </div>
    </motion.div>
  )
}

export default withAuth(Store)

