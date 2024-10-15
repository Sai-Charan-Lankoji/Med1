"use client";
import { Button, Input, Label, Switch, Textarea } from "@medusajs/ui";
import { useState } from "react";

const CustomGiftCardForm = () => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [region, setRegion] = useState("");
  const regions = ["Australia", "EU", "NA"];
  const closeCustomModal = () => setIsCustomModalOpen(false);

  const handleRegionChange = (e: any) => {
    setRegion(e.target.value);
  };

  return (
    <>
      <hr />
      <form className="flex flex-col space-y-6 p-2">
        <div className="flex flex-col space-y-4">
          <h6 className="font-semibold">Details</h6>
          <div className="flex flex-row space-x-6">
            <div className="flex flex-col w-1/2">
              <Label className="block text-sm font-medium text-gray-700">
                Region <span className="text-red-600">*</span>
              </Label>
              <select
                id="region"
                value={region}
                onChange={(e) => {
                  handleRegionChange(e);
                }}
                className="mt-1 py-2 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select...
                </option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-1/2">
              <Label className="block text-sm font-medium text-gray-700">
                Amount <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                placeholder="$"
                className="mt-1 py-4 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <div>
            <h2 className="text-md font-semibold">
              Gift Card has an expiry date?
            </h2>
            <p className="text-sm text-gray-600">
              Schedule the Gift Card to deactivate in the future.
            </p>
          </div>
          <Switch className="lg:ml-auto" />
        </div>
        <div className="flex flex-col space-y-6">
          <h6 className="font-semibold">Receiver</h6>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <Label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Email..."
                className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <Label className="block text-sm font-medium text-gray-700">
                Personal Message <span className="text-red-600">*</span>
              </Label>
              <Textarea
                placeholder="Write a personal message here"
                className="mt-1 py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={closeCustomModal}>
            Cancel
          </Button>
          <Button
            variant="transparent"
            className="px-4 py-2 border-none rounded-md text-white font-bold bg-violet-600 hover:bg-violet-500"
          >
            Create and Send
          </Button>
        </div>
      </form>
    </>
  );
};

export default CustomGiftCardForm;
