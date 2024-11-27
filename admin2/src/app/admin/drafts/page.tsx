"use client";
import React, { ChangeEvent, useMemo, useState } from "react"; 
import withAuth from "@/lib/withAuth";
// import { useAdminDraftOrders } from "medusa-react";
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Label,
  Select,
  Text,
} from "@medusajs/ui";
import {
  ArrowDownMini,
  ArrowUpMini,
  ChevronDownMini,
  ChevronUpMini,
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  PlusMini,
  SquareTwoStack,
  Trash,
  XCircle,
  XMarkMini,
} from "@medusajs/icons";
import useSearch from "../../hooks/useSearch";
import Pagination from "../../utils/pagination";
import CustomDrawer from "../../utils/customDrawer";
import ExistingDrawer from "../../utils/existingDrawer";
import { countries } from "@/app/utils/countries";
import Image from "next/image";
const Drafts = () => {
  // const { draft_orders, isLoading } = useAdminDraftOrders();
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
  const shippingmethods = [
    "PostFakeStandard - 10 EUR",
    "PostFakeExpress - 15 EUR",
  ];
  const [fields, setFields] = useState([{ key: "", value: "" }]);

  const handleRegionChange = (e: any) => {
    setRegion(e.target.value);
  };
  const handleShippingChange = (e: any) => {
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

  const toggleCustomDrawer = () => {
    setIsCustomDrawerOpen(!isCustomDrawerOpen);
  };
  const [isExistingDrawerOpen, setIsExistingDrawerOpen] = useState(false);

  const toggleExistingDrawer = () => {
    setIsExistingDrawerOpen(!isExistingDrawerOpen);
  };

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

    

  const handleFieldChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
      <div className="flex items-center justify-end gap-x-2">
        <Input
          size="small"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="secondary" onClick={openModal}>
          <Plus /> Create Draft Order
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-8">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No Drafts Orders Created Yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="min-w-full bg-transparent">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DRAFT
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ORDER
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE ADDED
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentDraftOrder.map((draft, index: any) => (
                  <tr key={""} className="hover:bg-gray-100">
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {""}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {""}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {new Date("").toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {""}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {""}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b text-end border-gray-300">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton
                            variant="transparent"
                            className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                          >
                            <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className=" bg-white p-3">
                          <DropdownMenu.Label>Actions</DropdownMenu.Label>
                          <DropdownMenu.Item className="bg-white text-gray-500  hover:text-white">
                            <PencilSquare className="mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="bg-white text-gray-500  hover:text-white">
                            <Trash className="mr-2" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
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
        <>
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 mb-1 h-[578px] w-[670px] flex flex-col justify-between overflow-auto">
              <div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <Heading className="text-[26px] font-semibold pb-2">
                      Create Draft Order
                    </Heading>
                    <div className="flex flex-row space-x-4">
                      <Text className="text-gray-500 mb-2">
                        Step {currentStep} of 6
                      </Text>
                      <div className="flex space-x-2 mt-2">
                        {Array.from({ length: totalSteps }, (_, index) => (
                          <span
                            key={index}
                            className={`h-3 w-3 rounded-full transition-colors duration-300
                          ${
                            index < currentStep
                              ? "bg-purple-500"
                              : "bg-gray-300"
                          }
                        `}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <IconButton variant="transparent">
                    <XMarkMini onClick={closeModal} />
                  </IconButton>
                </div>
                <hr />

                {currentStep === 1 && (
                  <div className="m-4">
                    <Label
                      htmlFor="region"
                      className="block text-[14px] font-semibold text-[rgb(0, 0, 0)] pb-4"
                    >
                      Choose region
                    </Label>
                    <Text className="text-[12px] text-gray-500 font-semibold pb-2">
                      Region
                    </Text>
                    <div className="relative">
                      <div
                        className={`w-full mt-1 p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center ${
                          isOpen && "border-violet-400"
                        } sm:text-sm`}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <select
                          id="region"
                          value={region}
                          onChange={(e) => {
                            handleRegionChange(e);
                            setIsOpen(false); 
                          }}
                          onFocus={() => setIsOpen(true)} 
                          onBlur={() => setIsOpen(false)} 
                          className="w-full appearance-none bg-transparent outline-none"
                        >
                          <option value="">Selected...</option>
                          {regions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>

                        {isOpen ? (
                          <ChevronUpMini className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownMini className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <>
                    <div>
                      <div className="p-6">
                        <Text className="text-[14px] text-slate-900 font-semibold mb-4">
                          Items for the order
                        </Text>
                      </div>
                      <div className="flex justify-end space-x-4 mb-4">
                        <Button
                          variant="transparent"
                          className="px-4 py-2 border rounded-md"
                          onClick={toggleCustomDrawer}
                        >
                          <Plus /> Add Custom
                        </Button>
                        <Button
                          variant="transparent"
                          className="px-4 py-2 border rounded-md"
                          onClick={toggleExistingDrawer}
                        >
                          <Plus /> Add Existing
                        </Button>
                        <CustomDrawer
                          onClose={toggleCustomDrawer}
                          isOpen={isCustomDrawerOpen}
                        />
                        <ExistingDrawer
                          onClose={toggleExistingDrawer}
                          isOpen={isExistingDrawerOpen}
                        />
                      </div>
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <div className="flex flex-col  space-x-4">
                    <Heading
                      level="h2"
                      className="text-[16px] font-semibold p-4"
                    >
                      Shipping Method
                      <span className="text-[14px] text-gray-300">
                        (To {region})
                      </span>
                    </Heading>
                    <Label
                      htmlFor="shippingmethod"
                      className="text-[12px] text-gray-400 font-semibold"
                    >
                      Choose a shipping method
                    </Label>
                    <div className="w-full px-2">
                      <div
                        className={`w-full mt-1 p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center ${
                          isOpen && "border-violet-400"
                        } sm:text-sm`}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <select
                          id="shippingmethod"
                          value={shippingmethod}
                          onChange={(e) => {
                            handleShippingChange(e);
                            setIsOpen(false); 
                          }}
                          onFocus={() => setIsOpen(true)} 
                          onBlur={() => setIsOpen(false)} 
                          className="w-full appearance-none bg-transparent outline-none"
                        >
                          {shippingmethods.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>

                        {isOpen ? (
                          <ChevronUpMini className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownMini className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row justify-end pt-4">
                      {isCustomPrice ? (
                        <div className="w-full mb-2 grid grid-cols-3 gap-3">
                          <div className="flex-1">
                            <Label className="block text-[14px] font-semibold p-2 text-gray-700">
                              Currency
                            </Label>
                            <Badge className="text-[14px] text-left pr-12 m-2">
                              AUD
                            </Badge>
                          </div>
                          <div className="flex-1 mt-2">
                            <Label className="block text-[14px] font-semibold p-2 text-gray-700">
                              Price<span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              placeholder="$ 0.00"
                              className="w-full border rounded"
                            />
                          </div>
                          <div>
                            <Button
                              variant="transparent"
                              onClick={() => setIsCustomPrice(false)}
                              className="border mt-11"
                            >
                              <Trash />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="transparent"
                          className="border"
                          onClick={() => setIsCustomPrice(!isCustomPrice)}
                        >
                          Set custom price
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="">
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] p-4"
                    >
                      Customer and shipping details
                    </Heading>
                    <Text className="text-[13px] text-gray-500 font-semibold pl-4">
                      Find existing customer
                    </Text>
                    <div className="relative m-4">
                      <div
                        className={`w-full mt-1 p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center ${
                          isOpen && "border-violet-400"
                        } sm:text-sm`}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <select
                          id="region"
                          value={region}
                          onChange={(e) => {
                            handleRegionChange(e);
                            setIsOpen(false); 
                          }}
                          onFocus={() => setIsOpen(true)}
                          onBlur={() => setIsOpen(false)} 
                          className="w-full appearance-none bg-transparent outline-none"
                        >
                          <option> No Options</option>
                        </select>

                        {isOpen ? (
                          <ChevronUpMini className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownMini className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <Heading
                        level="h2"
                        className="text-[14px] text-[rgb(0, 0, 0)] pl-4"
                      >
                        Email
                      </Heading>
                      <Text className="text-[13px] text-gray-500 font-semibold p-4">
                        Email <span className="text-red-500">*</span>
                      </Text>
                      <Input
                        type="email"
                        placeholder="lebron@james.com"
                        className="ml-4 w-[592px]"
                      />
                    </div>
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] pl-4"
                    >
                      General
                    </Heading>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          First Name <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="First Name"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Last Name <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Last Name"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Company
                        </Text>
                        <Input
                          type="text"
                          placeholder="Company"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Phone
                        </Text>
                        <Input
                          type="number"
                          placeholder="Phone"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] pl-4"
                    >
                      Shipping Address
                    </Heading>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Address 1 <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Address 1"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Address 2
                        </Text>
                        <Input
                          type="text"
                          placeholder="Address 2"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Postal code <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Postal Code"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          City <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="City"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Province
                        </Text>
                        <Input
                          type="text"
                          placeholder="Province"
                          className="mr-4 ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Country <span className="text-red-500">*</span>
                        </Text>
                        <Select onValueChange={setValue} value={value}>
                          <Select.Trigger>
                            <Select.Value
                              placeholder="Select a country"
                              className=""
                            />
                          </Select.Trigger>
                          <Select.Content>
                            {countries.map((item) => (
                              <Select.Item key={item.value} value={item.value}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Heading className="text-xl font-semibold m-4">
                        Metadata
                      </Heading>
                      <div className="space-y-4 border rounded-md m-4">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 ">
                            <tr className="divide-x divide-gray-300 border-b">
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Key
                              </th>
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Value
                              </th>
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-300">
                            {fields.map((field, index) => (
                              <tr key={index} className="divide-x divide-gray-300">
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    name="key"
                                    placeholder="Key"
                                    value={field.key}
                                    onChange={(event) =>
                                      handleFieldChange(index, event)
                                    }
                                    className="border p-2 rounded w-full"
                                  />
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    name="value"
                                    placeholder="Value"
                                    value={field.value}
                                    onChange={(event) =>
                                      handleFieldChange(index, event)
                                    }
                                    className="border p-2 rounded w-full"
                                  />
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="relative">
                                    <DropdownMenu>
                                      <DropdownMenu.Trigger asChild>
                                        <IconButton variant="transparent">
                                          <EllipsisHorizontal />
                                        </IconButton>
                                      </DropdownMenu.Trigger>
                                      <DropdownMenu.Content>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <ArrowUpMini className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleAddField(index, "above")
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Insert above
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <ArrowDownMini className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleAddField(index, "below")
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Insert below
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <SquareTwoStack className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleDuplicateField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Duplicate
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                          <XCircle className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleClearField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Clear contents
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                          <Trash className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleDeleteField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Delete
                                          </Button>
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Content>
                                    </DropdownMenu>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {/* Billing Address details */}
                {currentStep === 5 && (
                  <div className="">
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] p-4"
                    >
                      Billing Address
                    </Heading>
                    <div className="flex items-center space-x-2 ml-4 mb-2">
                      <Checkbox id="billing-shipping" />
                      <Label
                        htmlFor="billing-shipping"
                        className="text-[16px] text-grey-800"
                      >
                        Use same as shipping
                      </Label>
                    </div>
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] pl-4"
                    >
                      General
                    </Heading>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          First Name <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="First Name"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Last Name <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Last Name"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Company
                        </Text>
                        <Input
                          type="text"
                          placeholder="Company"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Phone
                        </Text>
                        <Input
                          type="number"
                          placeholder="Phone"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <Heading
                      level="h2"
                      className="text-[14px] text-[rgb(0, 0, 0)] pl-4"
                    >
                      Shipping Address
                    </Heading>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Address 1 <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Address 1"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Address 2
                        </Text>
                        <Input
                          type="text"
                          placeholder="Address 2"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Postal code <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="Postal Code"
                          className="ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          City <span className="text-red-500">*</span>
                        </Text>
                        <Input
                          type="text"
                          placeholder="City"
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Province
                        </Text>
                        <Input
                          type="text"
                          placeholder="Province"
                          className="mr-4 ml-4"
                        />
                      </div>
                      <div>
                        <Text className="text-[13px] text-gray-500 font-semibold p-4">
                          Country <span className="text-red-500">*</span>
                        </Text>
                        <Select onValueChange={setValue} value={value}>
                          <Select.Trigger>
                            <Select.Value
                              placeholder="Select a country"
                              className=""
                            />
                          </Select.Trigger>
                          <Select.Content>
                            {countries.map((item) => (
                              <Select.Item key={item.value} value={item.value}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Heading className="text-xl font-semibold m-4">
                        Metadata
                      </Heading>
                      <div className="space-y-4 border rounded-md m-4">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 ">
                            <tr className="divide-x divide-gray-300 border-b">
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Key
                              </th>
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Value
                              </th>
                              <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-800 tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-300">
                            {fields.map((field, index) => (
                              <tr key={index} className="divide-x divide-gray-300">
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    name="key"
                                    placeholder="Key"
                                    value={field.key}
                                    onChange={(event) =>
                                      handleFieldChange(index, event)
                                    }
                                    className="border p-2 rounded w-full"
                                  />
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    name="value"
                                    placeholder="Value"
                                    value={field.value}
                                    onChange={(event) =>
                                      handleFieldChange(index, event)
                                    }
                                    className="border p-2 rounded w-full"
                                  />
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="relative">
                                    <DropdownMenu>
                                      <DropdownMenu.Trigger asChild>
                                        <IconButton variant="transparent">
                                          <EllipsisHorizontal />
                                        </IconButton>
                                      </DropdownMenu.Trigger>
                                      <DropdownMenu.Content>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <ArrowUpMini className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleAddField(index, "above")
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Insert above
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <ArrowDownMini className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleAddField(index, "below")
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Insert below
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="gap-x-2">
                                          <SquareTwoStack className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleDuplicateField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Duplicate
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                          <XCircle className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleClearField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Clear contents
                                          </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                          <Trash className="text-ui-fg-subtle" />
                                          <Button
                                            variant="transparent"
                                            onClick={() =>
                                              handleDeleteField(index)
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                          >
                                            Delete
                                          </Button>
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Content>
                                    </DropdownMenu>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 6 && (
                  <div>
                    <div className="flex flex-row justify-between pt-4">
                      <Heading
                        level="h2"
                        className="text-[14px] text-slate-900"
                      >
                        Items
                      </Heading>
                      <Text className="text-violet-500 font-semibold">
                        Edit
                      </Text>
                    </div>
                    <hr />
                    <div className="p-6 space-y-4">
                      <div className="border-ui-border-base border-b pb-2">
                        <table className="w-full">
                          <thead className="text-gray-500 text-[14px] border-ui-border-base border-b">
                            <tr>
                              <th className="text-left">Details</th>
                               <th>Quantity</th>
                               <th className="text-right">
                                Price (excl. Taxes)
                              </th>
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
                                    <p className="font-medium">
                                      Medusa Coffee Mug
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      One Size
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-center">1</td>
                              <td className="py-4 text-right">12.00</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="flex flex-row justify-end">
                        <Button variant="transparent" className="mt-2 text-[14px] border text-slate-900">
                          <PlusMini /> Add Discount
                        </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <Heading level="h3" className="text-gray-700 font-semibold text-sm">
                            Customer
                          </Heading>
                          <Text className="text-sm text-gray-500">
                            gowrichandana@calibrage.in
                          </Text>
                        </div>
                        <Text className="text-violet-500 text-[14px] font-semibold">
                          Edit
                        </Text>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-ui-border-base border-r">
                          <Heading level="h3" className="text-gray-700 font-semibold text-sm">
                            Shipping details
                          </Heading>
                          <Text className="text-sm text-gray-500">
                            Address
                            <br />
                            2-21/1, Ramalayam Street, Gayathri Nagar,
                            <br />
                            Madhapur, Hyderbad 510081.
                          </Text>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <Heading className="text-gray-700 font-semibold text-sm">
                              Shipping method
                            </Heading>
                            <Text className="text-sm text-gray-500">
                              PostFake Express - 15 EUR
                            </Text>
                          </div>
                          <Text className="text-violet-500 text-[14px] font-semibold">
                            Edit
                          </Text>
                        </div>
                      </div>
                      <hr />
                      <div>
                          <Heading level="h3" className="text-gray-700 font-semibold text-sm">
                            Billing details
                          </Heading>
                          <Text className="text-sm text-gray-500">
                            Address
                            <br />
                            2-21/1, Ramalayam Street, Gayathri Nagar,
                            <br />
                            Madhapur, Hyderbad 510081.
                          </Text>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <Button
                  variant="transparent"
                  className="px-8 py-2 bg-gray-200 text-gray-500 rounded-md"
                  disabled={currentStep === 1}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="transparent"
                  className={`px-10 py-2 rounded-lg text-white ${
                    region
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-gray-500 "
                  }`}
                  disabled={!region}
                  onClick={handleNext}
                >
                  { currentStep === 6 ? ("Submit") : ("Next") }
                </Button>
              </div>
            </div>
          </div>
          <hr />
        </>
      )}
       
    </>
  );
};

export default withAuth(Drafts);
