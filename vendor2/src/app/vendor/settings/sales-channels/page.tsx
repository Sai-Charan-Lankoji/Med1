"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Search, MoreHorizontal, PenSquare, X } from "lucide-react";
import withAuth from "@/lib/withAuth";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel";
import { useUpdateSalesChannel } from "@/app/hooks/saleschannel/useUpdateSalesChannel";
import SalesTable from "../../components/saleschannelTableView/salesTable";
import DashboardComponent from "../../../../components/dashboard/page";
import { contact_name, vendor_id } from "@/app/utils/constant";
import toast from "react-hot-toast";

function SalesChannels() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Default Sales Channel");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vendor_id: vendor_id,
  });
  const { data: SalesChannels } = useGetSalesChannels();
  const channelId = SalesChannels?.find((channel) => channel.name === selectedRegion)?.id;
  const { createSalesChannel } = useCreateSalesChannel();
  const { updateSalesChannel } = useUpdateSalesChannel(channelId || "");
  const vendorName = contact_name;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleRadioChange = (region: string) => {
    setSelectedRegion(region);
    const selectedChannel = SalesChannels?.find((channel) => channel.name === region);
    if (selectedChannel) {
      setFormData({
        name: selectedChannel.name,
        description: selectedChannel.description,
        vendor_id: vendor_id || "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSalesChannel({
        name: formData.name,
        description: formData.description,
        vendor_id: formData.vendor_id,
      });
      toast.success("Sales channel created successfully", { duration: 1000 });
      closeModal();
    } catch (error) {
      console.error("Error while creating sales channel:", error);
      toast.error("Failed to create sales channel", { duration: 1000 });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (channelId) {
      try {
        await updateSalesChannel({
          channelId,
          name: formData.name,
          description: formData.description,
          vendor_id: formData.vendor_id,
          default_sales_channel_id: channelId,
        });
        toast.success("Sales channel updated successfully", { duration: 1000 });
        closeEditModal();
      } catch (error) {
        console.error("Error while updating sales channel:", error);
        toast.error("Failed to update sales channel", { duration: 1000 });
      }
    }
  };

  const renderSidebarContent = () => {
    if (selectedRegion) {
      return (
        <>
          <div className="flex justify-between items-center px-8 mb-6">
            <h2 className="text-2xl font-semibold text-base-content">{selectedRegion}</h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-base-content/80">
                <span className="w-2.5 h-2.5 rounded-full mr-2 inline-block bg-green-500"></span>
                Enabled
              </p>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <MoreHorizontal className="h-4 w-4" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <button
                      className="flex items-center gap-x-2 px-4 py-2 text-sm text-base-content hover:bg-base-200"
                      onClick={openEditModal}
                    >
                      <PenSquare className="h-4 w-4" />
                      Edit General info
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-x-2 px-4 py-2 text-sm text-base-content hover:bg-base-200">
                      <Plus className="h-4 w-4" />
                      Add Products
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <SalesTable />
        </>
      );
    }
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-semibold text-base-content/60">
          Select a channel to view details
        </h2>
      </div>
    );
  };

  return (
    <DashboardComponent
      title="Sales Channels"
      description="Control which products are available in which channels"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 overflow-hidden rounded-[12px] bg-base-100 shadow-xl">
          <div className="flex flex-row items-center justify-between p-4">
            <h3 className="text-xl font-bold text-base-content">Channels</h3>
            <div className="flex space-x-2">
              <button className="btn btn-ghost btn-circle">
                <Search className="h-4 w-4" />
              </button>
              <button className="btn btn-ghost btn-circle" onClick={openModal}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {SalesChannels?.map((channel) => (
                <motion.div
                  key={channel.id}
                  className={`cursor-pointer p-4 rounded-lg transition-colors ${
                    selectedRegion === channel.name
                      ? "bg-base-200 text-base-content"
                      : "bg-base-100 text-base-content/80 hover:bg-base-200"
                  }`}
                  onClick={() => handleRadioChange(channel.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{channel.name}</h3>
                      <p className="text-sm text-base-content/60">{channel.description}</p>
                    </div>
                    <p className="text-xs text-base-content/60">Created By {vendorName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 overflow-hidden rounded-[12px] bg-base-100 shadow-xl">
          <div className="p-6">{renderSidebarContent()}</div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <button className="btn btn-ghost text-base-content hover:bg-base-200 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </button>
        </Link>
      </motion.div>

      <input type="checkbox" id="create-modal" className="modal-toggle" checked={isModalOpen} onChange={() => setIsModalOpen(!isModalOpen)} />
      <div className="modal">
        <div className="modal-box bg-base-100 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Create new sales channel</h3>
            <button className="btn btn-ghost btn-circle" onClick={closeModal}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="label text-right">
                  <span className="label-text">Name</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3 input input-bordered w-full bg-base-200 text-base-content"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="label text-right">
                  <span className="label-text">Description</span>
                </label>
                <input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3 input input-bordered w-full bg-base-200 text-base-content"
                />
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Channel
              </button>
            </div>
          </form>
        </div>
      </div>

      <input type="checkbox" id="edit-modal" className="modal-toggle" checked={isEditModalOpen} onChange={() => setIsEditModalOpen(!isEditModalOpen)} />
      <div className="modal">
        <div className="modal-box bg-base-100 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Edit Sales Channel</h3>
            <button className="btn btn-ghost btn-circle" onClick={closeEditModal}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleUpdateSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="label text-right">
                  <span className="label-text">Name</span>
                </label>
                <input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3 input input-bordered w-full bg-base-200 text-base-content"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-description" className="label text-right">
                  <span className="label-text">Description</span>
                </label>
                <input
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3 input input-bordered w-full bg-base-200 text-base-content"
                />
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardComponent>
  );
}

export default withAuth(SalesChannels);