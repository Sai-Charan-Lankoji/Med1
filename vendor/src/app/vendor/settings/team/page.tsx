"use client";
import {
  ArrowLongLeft,
  ChevronDownMini,
  EllipsisHorizontal,
  PencilSquare,
  PlusMini,
  Trash,
  XMarkMini,
} from "@medusajs/icons";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Label,
} from "@medusajs/ui";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../../utils/pagination";
import useSearch from "@/app/hooks/useSearch";
import withAuth from "@/lib/withAuth";

const Team = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 6;

  const { searchQuery, setSearchQuery, filteredData } = useSearch({
    data:  [],
    searchKeys: ["email", "first_name", "last_name"],
  });

  const currentUsers = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredData.length);
    return filteredData.slice(offset, limit);
  }, [currentPage, pageSize, filteredData]);

  return (
    <div>
      <div className="p-4 flex items-center">
        <button
          className="text-sm text-gray-500 font-semibold flex items-center"
          onClick={() => {
            router.back();
          }}
        >
          <span className="mr-2">
            <ArrowLongLeft />
          </span>
          Back to settings
        </button>
      </div>
      <Container className="bg-white min-h-screen w-auto">
        <div className="flex flex-row justify-between">
          <Heading className="text-[24px] font-semibold mb-2">The Team</Heading>
          <Button variant="secondary" className="mb-3" onClick={openModal}>
            <PlusMini /> Invite Users
          </Button>
        </div>
        <p className="text-[12px] text-gray-500">
          Manage users of your Medusa Store
        </p>
        <div className="flex flex-row justify-between py-12">
          <div className="flex space-x-6">
            <div className="flex flex-row items-center">
              <p className="text-[12px] text-gray-500">Team Permissions:</p>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button size="base" variant="transparent">
                    <span className="text-gray-500">All</span>{" "}
                    <ChevronDownMini className="text-gray-500" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-[300px]">
                  <Heading>Hello Dropdown</Heading>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
            <div className="flex flex-row items-center">
              <p className="text-[12px] text-gray-500">Status:</p>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button size="base" variant="transparent">
                    <span className="text-gray-500">All</span>{" "}
                    <ChevronDownMini className="text-gray-500" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-[300px]">
                  <Heading>Hello Dropdown</Heading>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="text-[13px] pl-10 py-2 px-8 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-purple-500 outline-none"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {filteredData.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No users created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
              <table className="min-w-full bg-transparent">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Team Permissions
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user: any, index: any) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                        {""}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 text-[13px] border-b border-gray-300">
                        <div className="flex justify-left items-center">
                          <div
                            className={`w-6 h-6 mr-2 flex items-center justify-center rounded-full text-white text-center bg-slate-700`}
                          >
                            {user.email ? user.email.charAt(0) : " "}
                          </div>
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                        {user.role}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                        {user.status}
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
            data={currentUsers}
          />
        </div>
      </Container>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-[350px] w-[600px]">
            <div className="flex flex-row justify-between">
              <Heading level="h2" className="text-xl font-semibold mb-4">
                Invite Users
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeModal} />
              </IconButton>
            </div>
            <hr />
            <form>
              <div className="grid mb-4 mt-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="lebron@james.com"
                    className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">
                  Role
                </Label>
                <select className="block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700   hover:bg-gray-100 hover:border-violet-500 transition-all duration-300">
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="transparent"
                  className="ml-2 px-12 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                >
                  Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Team);
