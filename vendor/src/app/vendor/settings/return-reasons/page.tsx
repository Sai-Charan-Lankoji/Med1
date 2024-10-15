"use client";
import { ArrowLongLeft, PlusMini, XMarkMini } from "@medusajs/icons";
import { Button, Container, Heading, IconButton, Input, Label, Textarea } from "@medusajs/ui";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/app/utils/backButton"; 
import withAuth from "@/lib/withAuth";
const ReturnReasons = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="p-4 flex items-center">
       <BackButton name = "Settings"/>
      </div>
      <Container className="bg-white min-h-screen w-1/2">
        <div className="flex flex-row justify-between">
          <Heading className="text-[24px] font-semibold mb-2">
            Return Reasons
          </Heading>
          <Button variant="secondary"  className="mb-3 border hover:bg-gray-100 text-sm border-gray-200" onClick={openModal}>
            <PlusMini /> Add reason
          </Button>
        </div>
        <p className="text-[12px] text-gray-500">
          Manage reasons for returned items
        </p>
      </Container>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-[350px] w-[600px]">
            <div className="flex flex-row justify-between">
            <Heading level="h2" className="text-xl font-semibold mb-4">Add Reason</Heading>
            <IconButton variant="transparent">
            <XMarkMini onClick={closeModal}/>
            </IconButton>
            </div>
            <hr />
            <form>
              <div className="grid grid-cols-2 gap-2 mb-4 mt-6">
                <div> 
                <Label className="block text-sm font-medium text-gray-700">
                  Value <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="wrong_size"
                  className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                </div>
                <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Label <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Wrong size"
                  className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                />
                </div>
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="transparent" className="ml-2 px-12 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ReturnReasons);
