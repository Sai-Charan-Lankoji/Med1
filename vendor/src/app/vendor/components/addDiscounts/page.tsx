"use client";
import {
  ArrowDownMini,
  ArrowUpMini,
  ChevronRightMini,
  EllipsisHorizontal,
  InformationCircleSolid,
  PlusMini,
  SquareTwoStack,
  Trash,
  XCircle,
  XMarkMini,
} from "@medusajs/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Input,
  Label,
  ProgressAccordion,
  Switch,
  Toaster,
  Tooltip,
} from "@medusajs/ui";
import { ChangeEvent, useState } from "react";

const AddDiscountForm = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const currencies = ["NA", "Australia", "EU"];
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [isExpiryDateEnabled, setIsExpiryDateEnabled] = useState(false);
  const [isRedemptionLimitEnabled, setIsRedemptionLimitEnabled] =
    useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleCheckboxChange = (currency: string) => {
    setSelectedCurrencies((prevSelected) =>
      prevSelected.includes(currency)
        ? prevSelected.filter((item) => item !== currency)
        : [...prevSelected, currency]
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openConditionModal = () => setIsModalOpen(true);
  const closeCondtionModal = () => setIsModalOpen(false);
  const getButtonLabel = () => {
    if (selectedCurrencies.length === 0) return "Select...";
    return `${selectedCurrencies.length} selected`;
  };

  const renderInputField = (
    id: string,
    label: string,
    placeholder: string,
    type: "text" | "number" = "text",
    required = false
  ) => (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm outline-none"
        required={required}
      />
    </div>
  );

  const renderRedemptionLimitInput = () => {
    if (!isRedemptionLimitEnabled) return null;
    return (
      <div className="mt-4">
        <Label className="block text-sm font-medium text-gray-700">
          Number of redemptions
        </Label>
        <input
          type="number"
          id="redemptionLimit"
          name="redemptionLimit"
          placeholder="5"
          className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm outline-none"
          required
        />
      </div>
    );
  };

  const renderDatePicker = (
    label: string,
    isEnabled: boolean,
    date: Date | null,
    setDate: (date: Date | null) => void
  ) => {
    if (!isEnabled) return null;
    return (
      <div className="mt-4">
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
        <DatePicker
          onChange={(date: Date | undefined) => setDate(date || null)}
          className="mt-2 p-2 border border-violet-500 rounded-md w-full"
          placeholder={`Select ${label}`}
        />
      </div>
    );
  };

  const handleRadioChange = (region: any) => {
    setSelectedRegion(region);
  };

  const renderCard = (heading: string, description: string) => {
    return (
      <div className="flex flex-row justify-between py-4 px-4 border rounded-md m-4 hover:bg-gray-100 hover:cursor-pointer">
        <div className="flex flex-col">
          <Heading
            level="h2"
            className="text-gray-950 text-[16px] font-semibold"
          >
            {heading}
          </Heading>
          <p className="text-gray-500 text-[14px]">{description}</p>
        </div>
        <div>
          <ChevronRightMini className="justify-self-end" />
        </div>
      </div>
    );
  };
  const [fields, setFields] = useState([{ key: "", value: "" }]);

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
    <div>
      <Heading className="text-2xl text-black mb-4 ">
        Create new discount
      </Heading>
      <div className="mt-6">
        <ProgressAccordion type="multiple">
          <ProgressAccordion.Item value="Discount type">
            <ProgressAccordion.Header className="text-black text-lg">
              Discount type <span className="text-red-600">*</span>
            </ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <div className="flex items-center gap-2">
                <div
                  className={`mt-2 w-48 p-2 shadow-none rounded-md flex items-center bg-white cursor-pointer border ${
                    selectedRegion === "percentage"
                      ? "border-violet-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRadioChange("percentage")}
                >
                  <input
                    type="radio"
                    name="country"
                    className="mr-3 scale-150"
                    id="percentage"
                    checked={selectedRegion === "percentage"}
                    onChange={() => handleRadioChange("percentage")}
                  />
                  <div>
                    <h1 className="text-black font-semibold">Percentage</h1>
                    <p className="text-[12px] text-gray-600">
                      Payment Providers
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-2 w-48 p-2 shadow-none rounded-md flex items-center bg-white cursor-pointer border ${
                    selectedRegion === "fixed-amount"
                      ? "border-violet-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRadioChange("fixed-amount")}
                >
                  <input
                    type="radio"
                    name="country"
                    className="mr-3 scale-150"
                    id="fixed-amount"
                    checked={selectedRegion === "fixed-amount"}
                    onChange={() => handleRadioChange("fixed-amount")}
                  />
                  <div>
                    <h1 className="text-black font-semibold">Fixed Amount</h1>
                    <p className="text-[12px] text-gray-600">
                      Payment Providers
                    </p>
                  </div>
                </div>
                <div
                  className={`mt-2 w-48 p-2 shadow-none rounded-md flex items-center bg-white cursor-pointer border ${
                    selectedRegion === "free-shipping"
                      ? "border-violet-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleRadioChange("free-shipping")}
                >
                  <input
                    type="radio"
                    name="country"
                    className="mr-3 scale-150 "
                    id="free-shipping"
                    checked={selectedRegion === "free-shipping"}
                    onChange={() => handleRadioChange("free-shipping")}
                  />
                  <div>
                    <h1 className="text-black font-semibold">Free Shipping</h1>
                    <p className="text-[12px] text-gray-600">
                      Payment Providers
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                {selectedRegion === "percentage" && (
                  <div className="p-4 bg-slate-50 border border-gray-300 rounded">
                    <h3 className="text-black font-semibold">Percentage</h3>
                    <p>This is the content for the Percentage option.</p>
                  </div>
                )}
                {selectedRegion === "fixed-amount" && (
                  <>
                    <h1>Allocation*</h1>
                    <div className="flex flex-row justify-evenly pb-4">
                      <div
                        className={
                          "mt-2 w-48 p-2 shadow-none rounded-md flex items-center bg-white cursor-pointer border"
                        }
                      >
                        <input type="radio" className="mr-3 scale-150" />
                        <div>
                          <h1 className="text-black font-semibold">
                            Total Amount
                          </h1>
                          <p className="text-[12px] text-gray-600">
                            Apply to the total amount.
                          </p>
                        </div>
                      </div>
                      <div
                        className={
                          "mt-2 w-48 p-2 shadow-none rounded-md flex items-center bg-white cursor-pointer border"
                        }
                      >
                        <input type="radio" className="mr-3 scale-150" />
                        <div>
                          <h1 className="text-black font-semibold">
                            Item Specific
                          </h1>
                          <p className="text-[12px] text-gray-600">
                            Apply to every allowed item.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {selectedRegion === "free-shipping" && (
                  <div className="p-4 bg-slate-50 border border-gray-300 rounded">
                    <h3 className="text-black font-semibold">Free Shipping</h3>
                    <p>This is the content for the Free Shipping option.</p>
                  </div>
                )}
              </div>
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>

          <ProgressAccordion.Item value="General">
            <ProgressAccordion.Header className="text-black text-lg">
              General <span className="text-red-600">*</span>
            </ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <div className="relative inline-block w-full mb-6">
                <Label className="block text-gray-400 text-sm font-semibold mb-2">
                  Choose valid regions <span className="text-red-500">*</span>
                </Label>
                <div className="relative inline-block w-full">
                  <button
                    className="px-4 py-2 rounded-md w-full text-left text-gray-400 border border-gray-300 focus:border-violet-500"
                    onClick={toggleDropdown}
                  >
                    {getButtonLabel()}
                  </button>
                  {isOpen && (
                    <div className="absolute mt-2 w-full bg-white shadow-md rounded-md z-10">
                      <ul className="max-h-48 overflow-y-auto">
                        {currencies.map((currency) => (
                          <li
                            key={currency}
                            className="px-4 py-2 flex items-center hover:bg-gray-100"
                          >
                            <input
                              id={currency}
                              type="checkbox"
                              className="mr-2"
                              checked={selectedCurrencies.includes(currency)}
                              onChange={() => handleCheckboxChange(currency)}
                            />
                            <Label htmlFor={currency} className="text-gray-700">
                              {currency}
                            </Label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {renderInputField("code", "Code", "SUMMERSALE10", "text", true)}
                {renderInputField(
                  "percentage",
                  "Percentage",
                  "0",
                  "number",
                  true
                )}
              </div>
              <p className="text-gray-400 text-[13px] font-cabin mb-8">
                The code your customers will enter during checkout. This will
                appear on your customer’s invoice.
                <br />
                Uppercase letters and numbers only.
              </p>
              {renderInputField(
                "description",
                "Description",
                "Summer Sale 2022...",
                "text",
                true
              )}
              <div className="flex items-center space-x-2 py-4">
                <Checkbox id="template-discount" />
                <Label
                  htmlFor="template-discount"
                  className="text-[16px] text-gray-700 font-cabin"
                >
                  This is a template discount{" "}
                </Label>
                <Tooltip
                  className="text-gray-500 text-[12px] font-semibold"
                  content="Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique 
                                codes for each user, but where the rules for all unique codes should be the same."
                >
                  <InformationCircleSolid />
                </Tooltip>
              </div>
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>

          <ProgressAccordion.Item value="Configuration">
            <ProgressAccordion.Header className="text-black text-lg">
              Configuration
            </ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <ProgressAccordion.Content>
                <p className="text-gray-500 text-[14px] font-cabin">
                  Discount code applies from when you hit the publish button and
                  forever if left untouched.
                </p>
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <h1 className="text-[15px] text-gray-800 font-semibold mt-6">
                        Start date
                      </h1>
                      <Tooltip
                        className="text-gray-500 text-[12px] font-semibold"
                        content="If you want to schedule the discount to activate in the future, you can set a start date here."
                      >
                        <InformationCircleSolid className="mt-6" />
                      </Tooltip>
                    </div>
                    <Switch
                      checked={isStartDateEnabled}
                      onCheckedChange={setIsStartDateEnabled}
                    />
                  </div>
                  {renderDatePicker(
                    "Start Date",
                    isStartDateEnabled,
                    startDate,
                    setStartDate
                  )}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <h1 className="text-[15px] text-gray-800 font-semibold mt-6">
                        Discount has an expiry date?
                      </h1>
                      <Tooltip
                        className="text-gray-500 text-[12px] font-semibold"
                        content="If you want to schedule the discount to deactivate in the future, you can set an expiry date here."
                      >
                        <InformationCircleSolid className="mt-6" />
                      </Tooltip>
                    </div>
                    <Switch
                      checked={isExpiryDateEnabled}
                      onCheckedChange={setIsExpiryDateEnabled}
                    />
                  </div>
                  {renderDatePicker(
                    "Expiry Date",
                    isExpiryDateEnabled,
                    expiryDate,
                    setExpiryDate
                  )}
                </div>
                <div className="col-span-2 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <h1 className="text-[15px] text-gray-800 font-semibold mt-6">
                        Discount has a limited number of redemptions?
                      </h1>
                      <Tooltip
                        className="text-gray-500 text-[12px] font-semibold"
                        content="You can limit the number of times this discount can be redeemed by setting a redemption limit here."
                      >
                        <InformationCircleSolid className="mt-6" />
                      </Tooltip>
                    </div>
                    <Switch
                      checked={isRedemptionLimitEnabled}
                      onCheckedChange={setIsRedemptionLimitEnabled}
                    />
                  </div>
                  {renderRedemptionLimitInput()}
                </div>
              </ProgressAccordion.Content>
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>

          <ProgressAccordion.Item value="Conditions">
            <ProgressAccordion.Header className="text-black text-lg">
              Conditions
            </ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <Button
                onClick={openConditionModal}
                size="base"
                variant="transparent"
                className="m-2 w-full border pb-4"
              >
                <PlusMini /> Add Condition
              </Button>
              {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white rounded-lg p-6 h-auto w-[600px]">
                    <div className="flex flex-row justify-between">
                      <Heading className="text-xl font-semibold mb-4">
                        Add Conditions
                      </Heading>
                      <IconButton variant="transparent">
                        <XMarkMini onClick={closeCondtionModal} />
                      </IconButton>
                    </div>
                    <div className="flex flex-row">
                      <p className="text-[13px] text-gray-900 font-semibold">
                        Choose a condition type
                      </p>
                      <Tooltip
                        content="You can only add one of each type of condition"
                        className="text-gray-900 font-semibold text-[12px]"
                      >
                        <InformationCircleSolid />
                      </Tooltip>
                    </div>
                    <hr />
                    {renderCard("Product", "Only for specific products")}
                    {renderCard(
                      "Customer group",
                      "Only for specific customer groups"
                    )}
                    {renderCard("Tag", "Only for specific tags")}
                    {renderCard(
                      "Collection",
                      "Only for specific product collections"
                    )}
                    {renderCard("Type", "Only for specific product types")}
                    <hr />
                    <div className="flex justify-end pt-6">
                      <Button variant="secondary" onClick={closeCondtionModal}>
                        Cancel
                      </Button>
                      <Button
                        variant="transparent"
                        className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-semi  bold font-cabin bg-violet-600 hover:bg-violet-500"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>

          <ProgressAccordion.Item value="Metadata">
            <ProgressAccordion.Header className="text-black text-lg">
              <div className="flex flex-col pt-4">
                <Heading className="text-xl font-semibold mb-4 ">
                  Metadata
                </Heading>
                <p className="font-normal text-[13px] text-gray-400">
                  Metadata allows you to add additional information to your
                  discount.
                </p>
              </div>
            </ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Metadata allows you to add additional information to your
                  account.
                </h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="text"
                            name="key"
                            placeholder="Key"
                            value={field.key}
                            onChange={(event) =>
                              handleFieldChange(index, event)
                            }
                            className="p-2 w-full shadow-none bg-transparent focus:ring-0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="text"
                            name="value"
                            placeholder="Value"
                            value={field.value}
                            onChange={(event) =>
                              handleFieldChange(index, event)
                            }
                            className="p-2 w-full shadow-none bg-transparent focus:border-none"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenu.Trigger asChild>
                                <IconButton>
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
                                    onClick={() => handleDuplicateField(index)}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Duplicate
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <XCircle className="text-ui-fg-subtle" />
                                  <Button
                                    variant="transparent"
                                    onClick={() => handleClearField(index)}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Clear contents
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <Trash className="text-ui-fg-subtle" />
                                  <Button
                                    variant="transparent"
                                    onClick={() => handleDeleteField(index)}
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
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>
        </ProgressAccordion>
      </div>
    </div>
  );
};

export default AddDiscountForm;
