"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import withAuth from "@/lib/withAuth";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Plus,
  PlusCircle,
  Copy,
  XCircle,
  Trash2,
  X
} from "lucide-react";
import useSearch from "../../hooks/useSearch";
import Pagination from "../../utils/pagination";
import CustomDrawer from "../../utils/customDrawer";
import ExistingDrawer from "../../utils/existingDrawer";
import { countries } from "@/app/utils/countries";
import Image from "next/image";

const Drafts = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  const [region, setRegion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(1);
  const regions = ["Australia", "EU", "NA"];
  const [shippingmethod, setShippingMethod] = useState("");
  const shippingmethods = ["PostFakeStandard - 10 EUR", "PostFakeExpress - 15 EUR"];
  const [fields, setFields] = useState([{ key: "", value: "" }]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };
  const handleShippingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingMethod(e.target.value);
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const pageSize = 6;
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const toggleCustomDrawer = () => setIsCustomDrawerOpen(!isCustomDrawerOpen);

  const [isExistingDrawerOpen, setIsExistingDrawerOpen] = useState(false);
  const toggleExistingDrawer = () => setIsExistingDrawerOpen(!isExistingDrawerOpen);

  const { searchQuery, setSearchQuery, filteredData } = useSearch({
    data: [],
    searchKeys: ["status"],
  });

  const currentDraftOrder = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredData.length);
    return filteredData.slice(offset, limit);
  }, [currentPage, pageSize, filteredData]);

  const handleFieldChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedFields = [...fields];
    if (event.target.name === "key" || event.target.name === "value") {
      updatedFields[index][event.target.name] = event.target.value;
    }
    setFields(updatedFields);
  };

  const handleAddField = (index: number, position: string) => {
    const values = [...fields];
    const newField = { key: "", value: "" };
    if (position === "above") {
      values.splice(index, 0, newField);
    } else {
      values.splice(index + 1, 0, newField);
    }
    setFields(values);
  };

  const handleDuplicateField = (index: number) => {
    const values = [...fields];
    values.splice(index, 0, { ...fields[index] });
    setFields(values);
  };

  const handleClearField = (index: number) => {
    const values = [...fields];
    values[index] = { key: "", value: "" };
    setFields(values);
  };

  const handleDeleteField = (index: number) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-x-2 mb-4">
        <input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered input-sm w-64"
        />
        <button onClick={openModal} className="btn btn-secondary">
          <Plus className="h-5 w-5 mr-2" /> Create Draft Order
        </button>
      </div>

      <div className="flex flex-col gap-4 p-8">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No Draft Orders Created Yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DRAFT</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE ADDED</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {currentDraftOrder.map((draft, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{/* Placeholder */}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{/* Placeholder */}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{/* Placeholder */}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{new Date().toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{/* Placeholder */}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{/* Placeholder */}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 border-b text-right">
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                          <MoreHorizontal className="h-6 w-6" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li>
                            <button className="flex items-center">
                              <Pencil className="mr-2 h-5 w-5" /> Edit
                            </button>
                          </li>
                          <li>
                            <button className="flex items-center">
                              <Trash2 className="mr-2 h-5 w-5" /> Delete
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
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredData.length}
          data={currentDraftOrder}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 h-[578px] w-[670px] flex flex-col justify-between overflow-auto">
            <div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold pb-2">Create Draft Order</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-500 text-sm">Step {currentStep} of 6</p>
                    <div className="flex space-x-2">
                      {Array.from({ length: totalSteps }, (_, index) => (
                        <span
                          key={index}
                          className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                            index < currentStep ? "bg-purple-500" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="btn btn-ghost btn-circle">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <hr className="my-4" />

              {/* Step 1: Choose Region */}
              {currentStep === 1 && (
                <div className="m-4">
                  <label className="block text-sm font-semibold text-black pb-4">Choose region</label>
                  <p className="text-xs text-gray-500 font-semibold pb-2">Region</p>
                  <div className="relative">
                    <select
                      id="region"
                      value={region}
                      onChange={handleRegionChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select...</option>
                      {regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Items for the Order */}
              {currentStep === 2 && (
                <div>
                  <div className="p-6">
                    <p className="text-sm text-slate-900 font-semibold mb-4">Items for the order</p>
                  </div>
                  <div className="flex justify-end space-x-4 mb-4 px-6">
                    <button onClick={toggleCustomDrawer} className="btn btn-outline">
                      <Plus className="mr-2 h-5 w-5" /> Add Custom
                    </button>
                    <button onClick={toggleExistingDrawer} className="btn btn-outline">
                      <Plus className="mr-2 h-5 w-5" /> Add Existing
                    </button>
                    <CustomDrawer onClose={toggleCustomDrawer} isOpen={isCustomDrawerOpen} />
                    <ExistingDrawer onClose={toggleExistingDrawer} isOpen={isExistingDrawerOpen} />
                  </div>
                </div>
              )}

              {/* Step 3: Shipping Method */}
              {currentStep === 3 && (
                <div className="flex flex-col space-y-4 px-4">
                  <h3 className="text-base font-semibold">
                    Shipping Method <span className="text-sm text-gray-300">(To {region})</span>
                  </h3>
                  <label className="text-xs text-gray-400 font-semibold">Choose a shipping method</label>
                  <select
                    id="shippingmethod"
                    value={shippingmethod}
                    onChange={handleShippingChange}
                    className="select select-bordered w-full"
                  >
                    {shippingmethods.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <div className="flex justify-end pt-4">
                    {isCustomPrice ? (
                      <div className="w-full grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 p-2">Currency</label>
                          <span className="badge badge-primary m-2">AUD</span>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-semibold text-gray-700 p-2">
                            Price<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="$ 0.00"
                            className="input input-bordered w-full"
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => setIsCustomPrice(false)}
                            className="btn btn-ghost mt-11"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsCustomPrice(!isCustomPrice)}
                        className="btn btn-outline"
                      >
                        Set custom price
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Customer and Shipping Details */}
              {currentStep === 4 && (
                <div className="px-4">
                  <h3 className="text-sm font-semibold text-black p-2">Customer and shipping details</h3>
                  <p className="text-xs text-gray-500 font-semibold pl-2">Find existing customer</p>
                  <select className="select select-bordered w-full mt-2 mb-4">
                    <option>No Options</option>
                  </select>
                  <h3 className="text-sm font-semibold text-black pl-2">Email</h3>
                  <p className="text-xs text-gray-500 font-semibold p-2">
                    Email <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="email"
                    placeholder="lebron@james.com"
                    className="input input-bordered w-full mb-4"
                  />
                  <h3 className="text-sm font-semibold text-black pl-2">General</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          First Name <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input type="text" placeholder="First Name" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Last Name <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input type="text" placeholder="Last Name" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Company</span></label>
                      <input type="text" placeholder="Company" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Phone</span></label>
                      <input type="number" placeholder="Phone" className="input input-bordered" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-black pl-2 mt-4">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address 1 <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="Address 1" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Address 2</span></label>
                      <input type="text" placeholder="Address 2" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Postal code <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="Postal Code" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">City <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="City" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Province</span></label>
                      <input type="text" placeholder="Province" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Country <span className="text-red-500">*</span></span>
                      </label>
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select a country</option>
                        {countries.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 ml-2">Metadata</h3>
                  <div className="space-y-4 border rounded-md m-2">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-300 border-b">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Key</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Value</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        {fields.map((field, index) => (
                          <tr key={index} className="divide-x divide-gray-300">
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                name="key"
                                placeholder="Key"
                                value={field.key}
                                onChange={(event) => handleFieldChange(index, event)}
                                className="input input-bordered w-full"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                name="value"
                                placeholder="Value"
                                value={field.value}
                                onChange={(event) => handleFieldChange(index, event)}
                                className="input input-bordered w-full"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                  <MoreHorizontal className="h-5 w-5" />
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                  <li>
                                    <button onClick={() => handleAddField(index, "above")} className="flex items-center">
                                      <ArrowUp className="mr-2 h-5 w-5" /> Insert above
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleAddField(index, "below")} className="flex items-center">
                                      <ArrowDown className="mr-2 h-5 w-5" /> Insert below
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleDuplicateField(index)} className="flex items-center">
                                      <Copy className="mr-2 h-5 w-5" /> Duplicate
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleClearField(index)} className="flex items-center">
                                      <XCircle className="mr-2 h-5 w-5" /> Clear contents
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleDeleteField(index)} className="flex items-center">
                                      <Trash2 className="mr-2 h-5 w-5" /> Delete
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
                </div>
              )}

              {/* Step 5: Billing Address */}
              {currentStep === 5 && (
                <div className="px-4">
                  <h3 className="text-sm font-semibold text-black p-2">Billing Address</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <input type="checkbox" id="billing-shipping" className="checkbox checkbox-sm" />
                    <label htmlFor="billing-shipping" className="text-base text-gray-800">Use same as shipping</label>
                  </div>
                  <h3 className="text-sm font-semibold text-black pl-2 mt-2">General</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="First Name" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="Last Name" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Company</span></label>
                      <input type="text" placeholder="Company" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Phone</span></label>
                      <input type="number" placeholder="Phone" className="input input-bordered" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-black pl-2 mt-4">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address 1 <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="Address 1" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Address 2</span></label>
                      <input type="text" placeholder="Address 2" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Postal code <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="Postal Code" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">City <span className="text-red-500">*</span></span>
                      </label>
                      <input type="text" placeholder="City" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Province</span></label>
                      <input type="text" placeholder="Province" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Country <span className="text-red-500">*</span></span>
                      </label>
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select a country</option>
                        {countries.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 ml-2">Metadata</h3>
                  <div className="space-y-4 border rounded-md m-2">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-300 border-b">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Key</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Value</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        {fields.map((field, index) => (
                          <tr key={index} className="divide-x divide-gray-300">
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                name="key"
                                placeholder="Key"
                                value={field.key}
                                onChange={(event) => handleFieldChange(index, event)}
                                className="input input-bordered w-full"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <input
                                type="text"
                                name="value"
                                placeholder="Value"
                                value={field.value}
                                onChange={(event) => handleFieldChange(index, event)}
                                className="input input-bordered w-full"
                              />
                            </td>
                            <td className="px-6 py-2">
                              <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                  <MoreHorizontal className="h-5 w-5" />
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                  <li>
                                    <button onClick={() => handleAddField(index, "above")} className="flex items-center">
                                      <ArrowUp className="mr-2 h-5 w-5" /> Insert above
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleAddField(index, "below")} className="flex items-center">
                                      <ArrowDown className="mr-2 h-5 w-5" /> Insert below
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleDuplicateField(index)} className="flex items-center">
                                      <Copy className="mr-2 h-5 w-5" /> Duplicate
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleClearField(index)} className="flex items-center">
                                      <XCircle className="mr-2 h-5 w-5" /> Clear contents
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleDeleteField(index)} className="flex items-center">
                                      <Trash2 className="mr-2 h-5 w-5" /> Delete
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
                </div>
              )}

              {/* Step 6: Summary */}
              {currentStep === 6 && (
                <div className="px-4">
                  <div className="flex justify-between pt-4">
                    <h3 className="text-sm text-slate-900 font-semibold">Items</h3>
                    <p className="text-violet-500 font-semibold cursor-pointer">Edit</p>
                  </div>
                  <hr className="my-4" />
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <table className="w-full">
                        <thead className="text-gray-500 text-sm border-b">
                          <tr>
                            <th className="text-left">Details</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-right">Price (excl. Taxes)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-sm text-gray-700">
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src="/uploads/coffee-mug.jpg"
                                  alt="Product Image"
                                  className="rounded-md"
                                  width={40}
                                  height={40}
                                />
                                <div>
                                  <p className="font-medium">Medusa Coffee Mug</p>
                                  <p className="text-gray-500 text-xs">One Size</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">1</td>
                            <td className="py-4 text-right">12.00</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex justify-end">
                        <button className="btn btn-outline btn-sm mt-2">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Discount
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-gray-700 font-semibold text-sm">Customer</h4>
                        <p className="text-sm text-gray-500">gowrichandana@calibrage.in</p>
                      </div>
                      <p className="text-violet-500 text-sm font-semibold cursor-pointer">Edit</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-r pr-4">
                        <h4 className="text-gray-700 font-semibold text-sm">Shipping details</h4>
                        <p className="text-sm text-gray-500">
                          Address<br />
                          2-21/1, Ramalayam Street, Gayathri Nagar,<br />
                          Madhapur, Hyderabad 510081.
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-gray-700 font-semibold text-sm">Shipping method</h4>
                          <p className="text-sm text-gray-500">PostFake Express - 15 EUR</p>
                        </div>
                        <p className="text-violet-500 text-sm font-semibold cursor-pointer">Edit</p>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div>
                      <h4 className="text-gray-700 font-semibold text-sm">Billing details</h4>
                      <p className="text-sm text-gray-500">
                        Address<br />
                        2-21/1, Ramalayam Street, Gayathri Nagar,<br />
                        Madhapur, Hyderabad 510081.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-ghost px-8 py-2"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!region}
                className={`btn px-10 py-2 ${region ? "btn-primary" : "btn-disabled"}`}
              >
                {currentStep === 6 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Drafts);