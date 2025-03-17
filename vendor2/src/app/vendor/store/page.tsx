"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useDeleteStore } from "@/app/hooks/store/useDeleteStore";
import Pagination from "@/app/utils/pagination";
import { getColors } from "@/app/utils/dummyData";
import StoreCreationComponent from "./StoreCreationComponent";
import { useToast } from "@/hooks/use-toast";

const Store = () => {
  const { toast } = useToast();
  const { data: storesData, isLoading, refetch: refreshStores } = useGetStores();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { deleteStore } = useDeleteStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [storeToDelete, setStoreToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingStore, setIsDeletingStore] = useState(false);

  const PAGE_SIZE = 6;

  // Log the storesData to debug the structure
  useEffect(() => {
    if (storesData) {
      console.log("Stores Data:", storesData);
      storesData.forEach((store, index) => {
        console.log(`Store ${index + 1} - created_at:`, store.created_at, "createdAt:", store.createdAt);
      });
    }
  }, [storesData]);

  const storesWithMatchingSalesChannels = useMemo(() => {
    if (!storesData || !saleschannelsData) return [];
    return storesData.map((store) => ({
      ...store,
      matchingSalesChannel: saleschannelsData.find(
        (salesChannel) => salesChannel.id === store.default_sales_channel_id
      ),
    }));
  }, [storesData, saleschannelsData]);

  const filteredStores = useMemo(() => {
    if (!storesWithMatchingSalesChannels) return [];
    const searchLower = searchQuery.toLowerCase();
    return storesWithMatchingSalesChannels.filter((store) => {
      const storeNameMatch = store.name?.toLowerCase().includes(searchLower);
      const createdDateMatch = store.createdAt?.toLowerCase().includes(searchLower) || // Try both cases
        store.created_at?.toLowerCase().includes(searchLower);
      const salesChannelNameMatch =
        store.matchingSalesChannel?.name?.toLowerCase().includes(searchLower);
      return storeNameMatch || createdDateMatch || salesChannelNameMatch;
    });
  }, [storesWithMatchingSalesChannels, searchQuery]);

  const paginatedStores = useMemo(() => {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredStores.slice(startIndex, endIndex);
  }, [currentPage, filteredStores]);

  const formatDate = (isoDate) => {
    if (!isoDate || typeof isoDate !== "string") {
      return "N/A"; // Fallback for undefined or non-string values
    }
    try {
      const date = parseISO(isoDate);
      if (isNaN(date.getTime())) {
        return "N/A"; // Fallback for invalid dates
      }
      return format(date, "dd MMM yyyy");
    } catch (error) {
      console.error(`Error parsing date: ${isoDate}`, error);
      return "N/A"; // Fallback for parsing errors
    }
  };

  const getRowIndex = (index) => currentPage * PAGE_SIZE + index + 1;

  const initiateDelete = (id, event) => {
    event.stopPropagation();
    setStoreToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!storeToDelete) return;
    setIsDeletingStore(true);
    try {
      await deleteStore(storeToDelete);
      toast({ title: "Success", description: "Store deleted successfully" });
      refreshStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      toast({
        title: "Error",
        description: "Failed to delete store",
        variant: "destructive",
      });
    } finally {
      setIsDeletingStore(false);
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0">Store Management</h1>
        <div className="relative w-full sm:w-72">
          <input
            type="search"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10 pr-4 py-2 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-sm font-semibold text-primary">Store #</th>
              <th className="text-sm font-semibold text-primary">Date Added</th>
              <th className="text-sm font-semibold text-primary">Store Name</th>
              <th className="text-sm font-semibold text-primary">Sales Channel</th>
              <th className="text-sm font-semibold text-primary">Store Type</th>
              <th className="text-sm font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStores.map((store, index) => (
              <tr key={store.id} className="hover:bg-base-200">
                <td className="text-sm font-medium">{getRowIndex(index)}</td>
                <td className="text-sm">{formatDate(store.createdAt || store.created_at)}</td> {/* Try both field names */}
                <td>
                  <div className="flex items-center">
                    <div
                      className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColors(index)}`}
                    >
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <Link href={store.store_url} target="_blank" className="link link-hover">
                        {store.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="text-sm">{store.matchingSalesChannel?.name || "N/A"}</td>
                <td className="text-sm">{store.store_type || "N/A"}</td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link href={`/vendor/store/${store.id}`} className="flex items-center">
                          <PencilIcon className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </li>
                      <li>
                        <button
                          className="flex items-center"
                          onClick={(event) => initiateDelete(store.id, event)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredStores.length}
          data={filteredStores}
        />
      </div>

      <StoreCreationComponent onStoreCreated={refreshStores} storesData={storesData || []} />

      <input
        type="checkbox"
        id="delete-modal"
        className="modal-toggle"
        checked={isDeleteModalOpen}
        onChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-primary">Confirm Delete</h3>
          {isDeletingStore ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="text-lg text-base-content">Deleting store...</p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <p className="text-center text-base-content">
                  Are you sure you want to delete this store? This action cannot be undone.
                </p>
              </div>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StoreSkeleton = () => (
  <div className="p-6">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="h-8 bg-base-200 rounded w-40 mb-4 sm:mb-0 animate-pulse"></div>
      <div className="w-full sm:w-72 h-10 bg-base-200 rounded animate-pulse"></div>
    </div>

    <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table w-full">
        <thead>
          <tr>
            {[...Array(6)].map((_, index) => (
              <th key={index} className="bg-base-200 h-4 animate-pulse"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(6)].map((_, cellIndex) => (
                <td key={cellIndex} className="bg-base-200 h-4 animate-pulse"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-6 flex justify-center">
      <div className="h-8 bg-base-200 rounded w-64 animate-pulse"></div>
    </div>
  </div>
);

export default withAuth(Store);