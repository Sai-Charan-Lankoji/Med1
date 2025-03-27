"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, MoreHorizontal, PencilIcon, TrashIcon, Store as StoreIcon } from "lucide-react";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useDeleteStore } from "@/app/hooks/store/useDeleteStore";
import Pagination from "@/app/utils/pagination";
import { getColors } from "@/app/utils/dummyData";
import StoreCreationComponent from "./StoreCreationComponent";
import toast, { Toaster } from "react-hot-toast";

const Store = () => {
  const { data: storesData, isLoading, refetch: refreshStores } = useGetStores();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { deleteStore } = useDeleteStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [storeToDelete, setStoreToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingStore, setIsDeletingStore] = useState(false);

  const PAGE_SIZE = 6;

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
      const createdDateMatch = store.createdAt?.toLowerCase().includes(searchLower) || 
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
      return "N/A";
    }
    try {
      const date = parseISO(isoDate);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return format(date, "dd MMM yyyy");
    } catch (error) {
      console.error(`Error parsing date: ${isoDate}`, error);
      return "N/A";
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
      toast.success("Store deleted successfully", {
        duration: 3000,
        style: {
          background: 'var(--fallback-b1,oklch(var(--b1)))',
          color: 'var(--fallback-bc,oklch(var(--bc)))',
          border: '1px solid var(--fallback-bc,oklch(var(--bc)))',
        },
      });
      refreshStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Failed to delete store", {
        duration: 4000,
        style: {
          background: 'var(--fallback-b1,oklch(var(--b1)))',
          color: 'var(--fallback-bc,oklch(var(--bc)))',
          border: '1px solid var(--fallback-er,oklch(var(--er)))',
        },
      });
    } finally {
      setIsDeletingStore(false);
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
    }
  };

  if (isLoading) {
    return <StoreSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0 flex items-center gap-2">
          <StoreIcon className="h-6 w-6" /> Store Management
        </h1>
        <div className="w-full sm:w-72 relative">
          <div className="join w-full">
            <input
              type="search"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input join-item w-full pl-10"
            />
            <button className="btn btn-primary join-item">
              <Search className="h-5 w-5" />
            </button>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-4 w-4 text-base-content opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/50 text-base-content">
                  <th className="text-xs font-semibold uppercase tracking-wider">Store #</th>
                  <th className="text-xs font-semibold uppercase tracking-wider">Date Added</th>
                  <th className="text-xs font-semibold uppercase tracking-wider">Store Name</th>
                  <th className="text-xs font-semibold uppercase tracking-wider">Sales Channel</th>
                  <th className="text-xs font-semibold uppercase tracking-wider">Store Type</th>
                  <th className="text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((store, index) => (
                  <tr key={store.id} className="hover:bg-base-200/30 transition-colors duration-200">
                    <td className="font-medium">{getRowIndex(index)}</td>
                    <td>{formatDate(store.createdAt || store.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 rounded-full bg-primary text-primary-content">
                            <span>{store.name.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <Link href={store.store_url} target="_blank" className="link link-hover font-medium">
                            {store.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      {store.matchingSalesChannel?.name || "N/A"}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {store.store_type || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[1]"
                        >
                          <li>
                            <Link href={`/vendor/store/${store.id}`} className="flex items-center">
                              <PencilIcon className="h-4 w-4" /> Edit
                            </Link>
                          </li>
                          <li>
                            <button
                              className="flex items-center text-error"
                              onClick={(event) => initiateDelete(store.id, event)}
                            >
                              <TrashIcon className="h-4 w-4" /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedStores.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-base-content/70 py-10">
                      No stores found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-base-200">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredStores.length}
              data={filteredStores}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StoreCreationComponent onStoreCreated={refreshStores} storesData={storesData || []} />
      </div>

      <dialog id="delete-modal" className="modal" open={isDeleteModalOpen}>
        <div className="modal-box">
          <h3 className="text-lg font-bold text-primary">Confirm Delete</h3>
          {isDeletingStore ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="loading loading-spinner loading-md"></span>
              <p className="text-lg text-base-content/70">Deleting store...</p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <p className="text-center text-base-content/70">
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
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsDeleteModalOpen(false)}>Close</button>
          </form>
        </div>
      </dialog>
      
      {/* Add Toaster component for notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

const StoreSkeleton = () => (
  <div className="p-6">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="skeleton h-8 w-56 mb-4 sm:mb-0"></div>
      <div className="skeleton w-full sm:w-72 h-10"></div>
    </div>

    <div className="card bg-base-100">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/40">
                {[...Array(6)].map((_, index) => (
                  <th key={index}>
                    <div className="skeleton h-4 w-full"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(6)].map((_, cellIndex) => (
                    <td key={cellIndex}>
                      <div className="skeleton h-4 w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-base-200">
          <div className="skeleton h-8 w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default withAuth(Store);