"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
// import { useAdminCustomerGroups } from "medusa-react";
import { Button, DropdownMenu, Heading, IconButton, Input, Label, Text } from "@medusajs/ui";
import { ArrowDownMini, ArrowUpMini, EllipsisHorizontal, InformationCircleSolid, PencilSquare, Plus, SquareTwoStack, Trash, XCircle, XMarkMini } from "@medusajs/icons";
import useSearch from "../../hooks/useSearch";
import Pagination from "../../utils/pagination"; 
import withAuth from "@/lib/withAuth";

const CustomerGroups = () => {
  // const { customer_groups, isLoading } = useAdminCustomerGroups();
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const pageSize = 6;

  // Define a dummy member count function
  const getMemberCount = (groupId: string): number => {
    return Math.floor(Math.random() * 100); 
  };

  const { searchQuery, setSearchQuery, filteredData } = useSearch({
    data: [],
    searchKeys: ["name"],
  });

  const currentGroups = useMemo(() => {
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
  }

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
        <Button variant="secondary" onClick={openModal}>
          <Plus /> New Group
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-8">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No Customer Groups Created Yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="min-w-full bg-transparent">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentGroups.map((group: any) => (
                  <tr key={group.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {group.name}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {getMemberCount(group.id)}
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
                        <DropdownMenu.Content className="bg-white p-3">
                          <DropdownMenu.Label>Actions</DropdownMenu.Label>
                          <DropdownMenu.Item className="bg-white text-gray-500 hover:text-white">
                            <PencilSquare className="mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="bg-white text-gray-500 hover:text-white">
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
         {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 h-auto w-[600px]">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col m-2">
                  <Heading level="h2" className="text-xl font-semibold mb-1">
                    Add Collection
                  </Heading>
                  <Text className="text-[14px] text-gray-500 font-semibold">
                    To create a collection, all you need is a title and a
                    handle.
                  </Text>
                </div>
                <IconButton
                  size="base"
                  variant="transparent"
                  className="border mt-4"
                >
                  <XMarkMini onClick={closeModal} />
                </IconButton>
              </div>
              <hr />
              <Heading className="text-[16px] text-slate-900 font-semibold m-4">
                Details
              </Heading>
              <form>
                <div className="grid grid-cols-1 gap-1 mb-4 mt-6 m-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Name..."
                      className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>    
                </div>
                <div className="mb-4">
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
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="transparent"
                    className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                  >
                    Publish Group
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredData.length}
          data={currentGroups}
        />
      </div>
    </>
  );
};

export default withAuth(CustomerGroups);
