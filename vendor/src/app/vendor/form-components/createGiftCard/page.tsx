"use client";
import { PlusMini, XMarkMini } from "@medusajs/icons";
import {
  Button,
  Heading,
  IconButton,
  Input,
  Label,
  Textarea,
} from "@medusajs/ui";
import { FC, useState } from "react";

const CreateGiftCardForm = () => {
  const [denominations, setDenominations] = useState([
    { currency: "USD", amount: 0 },
  ]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [showDenominations, setShowDenominations] = useState(false);
  const addDenomination = () => {
    setShowDenominations(true);
    setDenominations([...denominations, { currency: "USD", amount: 0 }]);
  };

  const removeDenomination = (index: number) => {
    const updatedDenominations = denominations.filter((_, i) => i !== index);
    setDenominations(updatedDenominations);
    if (updatedDenominations.length === 0) setShowDenominations(false);
  };

  const handleDenominationChange = (
    index: number,
    field: "currency" | "amount", // Specify the allowed fields
    value: string
  ) => {
    const updatedDenominations = [...denominations];

    if (field === "amount") {
      updatedDenominations[index][field] = parseFloat(value); // Ensure amount is a number
    } else {
      updatedDenominations[index][field] = value; // Keep currency as a string
    }

    setDenominations(updatedDenominations);
  };
  return (
    <>
      <hr />
      <form className="flex flex-col space-y-6 p-2">
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
            placeholder="The best Gift Card"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="The best Gift Card of all time"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M24 8v32m16-16H8"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
                >
                  <span>Click to browse</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files) {
                        setThumbnail(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                1200 x 1600 (3:4) recommended, up to 10MB each
              </p>
            </div>
          </div>
        </div>
        {showDenominations && (
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Denominations <span className="text-red-500">*</span>
            </Label>
            {denominations.map((denomination, index) => (
              <div key={index} className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-4">
                  <div className="w-1/4">
                    <Label className="block text-sm font-medium text-gray-700 pb-2">
                      Currency
                    </Label>
                    <select
                      value={denomination.currency}
                      onChange={(e) =>
                        handleDenominationChange(
                          index,
                          "currency",
                          e.target.value
                        )
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <Label className="block text-sm font-medium text-gray-700 pb-2">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      placeholder="$ 0.00"
                      value={denomination.amount}
                      onChange={(e) =>
                        handleDenominationChange(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    variant="transparent"
                    onClick={() => removeDenomination(index)}
                    className="text-red-500 mt-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          variant="transparent"
          className="text-purple-600 mt-4"
          onClick={addDenomination}
        >
          <PlusMini /> Add Denomination
        </Button>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary">Cancel</Button>
          <Button
            variant="secondary"
            className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Create & Publish
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateGiftCardForm;
