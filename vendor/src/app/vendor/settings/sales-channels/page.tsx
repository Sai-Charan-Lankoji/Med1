"use client";
import React, { useState } from "react";
import {
  EllipsisHorizontal,
  MagnifyingGlassMini,
  PencilSquare,
  Plus,
  PlusMini,
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
  Text,
} from "@medusajs/ui";
import { BackButton } from "@/app/utils/backButton";
import SalesTable from "../../components/saleschannelTableView/salesTable"; 
import withAuth from "@/lib/withAuth";

interface Product {
  name: string;
  collection: string;
  imageUrl: string;
}

const SalesChannels = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    "Default Sales Channel"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRadioChange = (region: string) => {
    setSelectedRegion(region);
  };

  const renderSidebarContent = () => {
    switch (selectedRegion) {
      case "Default Sales Channel":
        return (
          <>
            <div className="flex justify-between items-center px-8">
              <h2 className="text-xl font-semibold">Default Sales Channel</h2>
              <div className="flex justify-between items-center w-36 ">
                <p className="text-[12px] text-gray-500">
                  {" "}
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
                  <DropdownMenu.Content className="bg-white ">
                    <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
                      <PencilSquare className="text-ui-fg-subtle" />
                      Edit General info
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
                      <Plus className="text-ui-fg-subtle" />
                      Add Products
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                  </DropdownMenu.Content>
                </DropdownMenu>
              </div>
            </div>
            <SalesTable />
          </>
        );
      // case "Port One":
      //   return (
      //     <>
      //       <div className="flex justify-between items-center px-8">
      //         <h2 className="text-xl font-semibold">Port One</h2>
      //         <div className="flex justify-between items-center w-36 ">
      //           <p className="text-[12px] text-gray-500">
      //             {" "}
      //             <span
      //               className={`w-2.5 h-2.5 rounded-full mr-2 inline-block ${"bg-green-500"}`}
      //             ></span>
      //             Enabled
      //           </p>
      //           <DropdownMenu>
      //             <DropdownMenu.Trigger asChild>
      //               <IconButton>
      //                 <EllipsisHorizontal />
      //               </IconButton>
      //             </DropdownMenu.Trigger>
      //             <DropdownMenu.Content className="bg-white ">
      //               <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
      //                 <PencilSquare className="text-ui-fg-subtle" />
      //                 Edit General info
      //               </DropdownMenu.Item>
      //               <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
      //                 <Plus className="text-ui-fg-subtle" />
      //                 Add Products
      //               </DropdownMenu.Item>
      //               <DropdownMenu.Separator />
      //             </DropdownMenu.Content>
      //           </DropdownMenu>
      //         </div>
      //       </div>
      //       <SalesTable />
      //     </>
      //   );
      case "Port Two":
        return (
          <>
            <div className="flex justify-between items-center px-8">
              <h2 className="text-xl font-semibold">Port Two</h2>
              <div className="flex justify-between items-center w-36 ">
                <p className="text-[12px] text-gray-500">
                  {" "}
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
                  <DropdownMenu.Content className="bg-white ">
                    <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
                      <PencilSquare className="text-ui-fg-subtle" />
                      Edit General info
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="gap-x-2 text-sm hover:bg-gray-100">
                      <Plus className="text-ui-fg-subtle" />
                      Add Products
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
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
              <div>
                <h3 className="text-2xl font-semibold">Sales channels</h3>
              </div>
              <div className="flex flex-row justify-around">
                <Button variant="transparent">
                  <MagnifyingGlassMini />
                </Button>
                <FocusModal>
                  <FocusModal.Trigger asChild>
                    <Button
                      variant="transparent"
                    >
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
                            <div className="flex flex-col gap-y-2 py-4">
                              <Label
                                htmlFor="title"
                                className="text-ui-fg-subtle"
                              >
                                Title
                              </Label>
                              <Input
                                id="title"
                                placeholder="Website, app, Amazon, physical store POS, facebook product feed..."
                                className="py-5 border  hover:border-violet-600 focus:border-violet-600"

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
                                placeholder="Available products at our website, app..."
                                className="py-5 border  hover:border-violet-600 focus:border-violet-600"

                              />
                            </div>
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
              <Container
                className={`cursor-pointer p-4 my-2 border ${
                  selectedRegion === "Default Sales Channel"
                    ? "border-violet-600"
                    : "border-gray-300"
                }`}
                onClick={() => handleRadioChange("Default Sales Channel")}
              >
                <input
                  type="radio"
                  checked={selectedRegion === "Default Sales Channel"}
                  onChange={() => handleRadioChange("Default Sales Channel")}
                  className="mr-2"
                />
                <label>Default Sales Channel</label>
                <p className="text-sm text-gray-500">Created by Medusa</p>
              </Container>
              {/* <Container
                className={`cursor-pointer p-4 my-2 border ${
                  selectedRegion === "Port One"
                    ? "border-violet-600"
                    : "border-gray-300"
                }`}
                onClick={() => handleRadioChange("Port One")}
              >
                <input
                  type="radio"
                  checked={selectedRegion === "Port One"}
                  onChange={() => handleRadioChange("Port One")}
                  className="mr-2"
                />
                <label>Port One</label>
                <p className="text-sm px-2 text-gray-500">Plain t-shirts</p>
              </Container>
              <Container
                className={`cursor-pointer p-4 my-2 border ${
                  selectedRegion === "Port Two"
                    ? "border-violet-600"
                    : "border-gray-300"
                }`}
                onClick={() => handleRadioChange("Port Two")}
              >
                <input
                  type="radio"
                  checked={selectedRegion === "Port Two"}
                  onChange={() => handleRadioChange("Port Two")}
                  className="mr-2 "
                />
                <label>Port Two</label>
                <p className="text-sm px-2 text-gray-500">
                  Customizable T-Shirts are available
                </p>
              </Container> */}
            </div>
          </div>
        </Container>
        <Container className="bg-white border-l border-gray-300 p-4">
          {renderSidebarContent()}
        </Container>
      </div>
    </div>
  );
};

export default withAuth(SalesChannels);
