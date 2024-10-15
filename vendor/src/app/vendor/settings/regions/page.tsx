"use client";
import React, { useState } from "react";
import { BackButton } from "@/app/utils/backButton";
import { Container } from "@medusajs/ui";
import { Plus } from "@medusajs/icons"; 
import withAuth from "@/lib/withAuth";

const Regions = () => {
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleRadioChange = (region: string) => {
    setSelectedRegion(region);
  };

  const renderSidebarContent = () => {
    switch (selectedRegion) {
      case "australia":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Australia Settings</h2>
            <p className="text-[12px]">Customize your settings for Australia.</p>
           </>
        );
      case "EU":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">EU Settings</h2>
            <p className="text-[12px]">Customize your settings for the EU region.</p>
           </>
        );
      case "NA":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">NA Settings</h2>
            <p className="text-[12px]">Customize your settings for North America.</p>
           </>
        );
      default:
        return <p className="text-[12px]">Select a region to view settings.</p>;
    }
  };

  return (
    <div>
      <BackButton name = "Settings" />
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <Container className="bg-white min-h-screen w-[450px]">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-semibold mb-4">Regions</h1>
              <p className="text-[12px]">
                Manage the markets that you will operate within...
              </p>
            </div>
            <div className="ml-auto text-black">
              <button className="">
                <Plus className="text-black mr-2" />
              </button>
            </div>
          </div>

           <Container
            className={`mt-4 shadow-none flex items-center bg-white cursor-pointer border ${
              selectedRegion === "australia"
                ? "border-violet-600"
                : "border-gray-300"
            }`}
            onClick={() => handleRadioChange("australia")}
          >
            <input
              type="radio"
              name="country"
              className="mr-3 scale-150"
              id="australia"
              checked={selectedRegion === "australia"}
              onChange={() => handleRadioChange("australia")}
            />
            <div>
              <h1 className="text-black font-semibold">
                Australia <span className="text-gray-500">(Australia)</span>
              </h1>
              <p className="text-[12px] text-gray-600">
                Payment Providers: Manual
              </p>
              <p className="text-[12px] text-gray-600">
                Fulfillment Providers: Manual
              </p>
            </div>
          </Container>

           <Container
            className={`mt-4 shadow-none flex items-center bg-white cursor-pointer border ${
              selectedRegion === "EU"
                ? "border-violet-600"
                : "border-gray-300"
            }`}
            onClick={() => handleRadioChange("EU")}
          >
            <input
              type="radio"
              name="country"
              className="mr-3 scale-150 text-violet-600 focus:ring-violet-600"
              id="EU"
              checked={selectedRegion === "EU"}
              onChange={() => handleRadioChange("EU")}
            />
            <div>
              <h1 className="text-black font-semibold">
                EU
                <span className="text-gray-500">
                  (United Kingdom, Germany, Denmark)
                </span>
              </h1>
              <p className="text-[12px] text-gray-600">
                Payment Providers: Manual
              </p>
              <p className="text-[12px] text-gray-600">
                Fulfillment Providers: Manual
              </p>
            </div>
          </Container>

           <Container
            className={`mt-4 shadow-none flex items-center bg-white cursor-pointer border ${
              selectedRegion === "NA"
                ? "border-violet-600"
                : "border-gray-300"
            }`}
            onClick={() => handleRadioChange("NA")}
          >
            <input
              type="radio"
              name="country"
              className="mr-3 scale-150"
              id="NA"
              checked={selectedRegion === "NA"}
              onChange={() => handleRadioChange("NA")}
            />
            <div>
              <h1 className="text-black font-semibold">
                NA{" "}
                <span className="text-gray-500">(United States, Canada)</span>
              </h1>
              <p className="text-[12px] text-gray-600">
                Payment Providers: Manual
              </p>
              <p className="text-[12px] text-gray-600">
                Fulfillment Providers: Manual
              </p>
            </div>
          </Container>
        </Container>

         <Container className="bg-white border-l border-gray-300 p-4">
          {renderSidebarContent()}
        </Container>
      </div>
    </div>
  );
};

export default withAuth(Regions);
