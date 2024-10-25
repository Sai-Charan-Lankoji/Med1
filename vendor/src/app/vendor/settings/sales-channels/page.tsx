"use client";
import React, { useState } from "react";
import {
  EllipsisHorizontal,
  MagnifyingGlassMini,
  PencilSquare,
  Plus,
  PlusMini,
  XMarkMini,
} from "@medusajs/icons";
import {
  Button,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Input,
  Label,
  ProgressAccordion,
} from "@medusajs/ui";
import { BackButton } from "@/app/utils/backButton";
import SalesTable from "../../components/saleschannelTableView/salesTable";
import withAuth from "@/lib/withAuth";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel";
import { useUpdateSalesChannel } from "@/app/hooks/saleschannel/useUpdateSalesChannel"; // Custom hook for updating sales channels
import { identity } from "lodash";

const SalesChannels = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    "Default Sales Channel"
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vendor_id: sessionStorage.getItem("vendor_id"),
  });
  const { data: SalesChannels } = useGetSalesChannels();
  const channelId = SalesChannels?.find(
    (channel) => channel.name === selectedRegion
  )?.id; // Get channel ID to update
  console.log("Channel ID: " + channelId)
  const { mutate: createSalesChannel } = useCreateSalesChannel();
  const { mutate: updateSalesChannel } = useUpdateSalesChannel(channelId); // Hook for updating sales channels
  const vendorName = sessionStorage.getItem("contactName");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleRadioChange = (region: string) => {
    setSelectedRegion(region);
    const selectedChannel = SalesChannels.find(
      (channel) => channel.name === region
    );
    if (selectedChannel) {
      setFormData({
        name: selectedChannel.name,
        description: selectedChannel.description,
        vendor_id: sessionStorage.getItem("vendor_id"),
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log("Form data changed", formData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createSalesChannel(
      {
        name: formData.name,
        description: formData.description,
        vendor_id: formData.vendor_id,
      },
      {
        onSuccess: (response) => {
          console.log("Successfully Created Sales Channel ", response);
          closeModal(); // Close modal after successful creation
        },
        onError: (error) => {
          console.error("Error while creating sales channel:", error);
        },
      }
    );
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSalesChannel(
      {
        channelId,
        name: formData.name,
        description: formData.description
      },
      {
        onSuccess: (response) => {
          console.log("Successfully Updated Sales Channel", response);
          closeEditModal();
        },
        onError: (error) => {
          console.error("Error while updating sales channel:", error);
        },
      }
    );
    
    
  };

  const renderSidebarContent = () => {
    switch (selectedRegion) {
      case selectedRegion:
        return (
          <>
            <div className="flex justify-between items-center px-8">
              <h2 className="text-xl font-semibold">{selectedRegion}</h2>
              <div className="flex justify-between items-center w-36 ">
                <p className="text-[12px] text-gray-500">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 inline-block ${"bg-green-500"}`}
                  ></span>
                  Enabled
                </p>
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <IconButton>
                      <EllipsisHorizontal />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-white">
                    <DropdownMenu.Item
                      className="gap-x-2 text-sm"
                      onClick={openEditModal}
                    >
                      <PencilSquare className="text-ui-fg-subtle" />
                      Edit General info
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
                      <Plus className="text-ui-fg-subtle" />
                      Add Products
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </div>
            </div>
            <SalesTable />
          </>
        );
      default:
        return (
          <h2 className="text-xl font-semibold">
            Select a region to view settings
          </h2>
        );
    }
  };

  return (
    <div className="px-16">
      <BackButton name="Settings" />
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <Container className="bg-white min-h-screen w-[450px]">
          <div className="my-4">
            <div className="flex flex-row justify-between">
              <h3 className="text-2xl font-semibold">Sales channels</h3>
              <div className="flex flex-row justify-around">
                <Button variant="transparent">
                  <MagnifyingGlassMini />
                </Button>
                <FocusModal>
                  <FocusModal.Trigger asChild>
                    <Button variant="transparent">
                      <PlusMini />
                    </Button>
                  </FocusModal.Trigger>
                  <FocusModal.Content className="bg-white">
                    <FocusModal.Header className="flex justify-between">
                      <div>
                        <Button variant="primary" onClick={closeModal}>
                          Save as draft
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          variant="transparent"
                          className="bg-violet-500 text-white ml-4"
                        >
                          Publish Channel
                        </Button>
                      </div>
                    </FocusModal.Header>
                    <FocusModal.Body className="flex flex-col justify-start items-center py-16 w-full bg-white">
                      <ProgressAccordion type="multiple">
                        <Heading className="text-[24px] font-semibold pb-4">
                          Create new sales channel
                        </Heading>
                        <ProgressAccordion.Item
                          value="general-info"
                          className="pb-12 w-[900px]"
                        >
                          <ProgressAccordion.Header className="font-semibold text-lg">
                            General info
                          </ProgressAccordion.Header>
                          <ProgressAccordion.Content>
                            <form onSubmit={handleSubmit}>
                              <div className="flex flex-col gap-y-2 py-4">
                                <Label
                                  htmlFor="title"
                                  className="text-ui-fg-subtle"
                                >
                                  Title
                                </Label>
                                <Input
                                  id="title"
                                  value={formData.name}
                                  name="name"
                                  onChange={handleChange}
                                  placeholder="Website, app, Amazon, physical store POS, facebook product feed..."
                                  className="py-5 border hover:border-violet-600 focus:border-violet-600"
                                />
                              </div>
                              <div className="flex flex-col gap-y-2 pb-4">
                                <Label
                                  htmlFor="description"
                                  className="text-ui-fg-subtle"
                                >
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleChange}
                                  placeholder="Available products at our website, app..."
                                  className="py-5 border hover:border-violet-600 focus:border-violet-600"
                                />
                              </div>
                            </form>
                          </ProgressAccordion.Content>
                        </ProgressAccordion.Item>
                        <hr />
                      </ProgressAccordion>
                    </FocusModal.Body>
                  </FocusModal.Content>
                </FocusModal>
              </div>
            </div>
            <p className="text-sm">
              Control which products are available in which channels
            </p>
            <div className="my-4">
              {SalesChannels?.map((channel) => (
                <Container
                  key={channel.id}
                  className={`cursor-pointer p-4 my-2 border ${
                    selectedRegion === channel.name
                      ? "border-violet-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRadioChange(channel.name)}
                >
                  <input
                    type="radio"
                    checked={selectedRegion === channel.name}
                    onChange={() => handleRadioChange(channel.name)}
                    className="hidden"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{channel.name}</h3>
                      <p className="text-sm text-gray-500">
                        {channel.description}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                    Created By { vendorName}
                    </p>
                  </div>
                </Container>
              ))}
            </div>
          </div>
        </Container>
        <Container className="bg-white w-full">
          {renderSidebarContent()}
        </Container>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-[280px] w-[600px]">
            <div className="flex flex-row justify-between">
              <Heading className="text-xl font-semibold">
                Sales Channel Details
              </Heading>
              <IconButton onClick={closeEditModal}>
                <XMarkMini />
              </IconButton>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <Label htmlFor="title" className="text-ui-fg-subtle">
                Title
              </Label>
              <Input
                id="title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border py-2 px-4 mb-4"
              />
              <Label htmlFor="description" className="text-ui-fg-subtle">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border py-2 px-4"
              />

              <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="transparent"
                  className="ml-2 px-8 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(SalesChannels);
