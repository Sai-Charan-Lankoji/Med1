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
  Table,
} from "@medusajs/ui";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../../utils/pagination";
import withAuth from "@/lib/withAuth";
import { useGetUsers } from "@/app/hooks/users/useGetUsers";

// Mock user data (replace this with actual API call if available)
const mockUser = {
  id: "usr_01J98V6VVESMJQ616PFN1GSB0F",
  email: "talaripraveenkumar53@gmail.com",
  first_name: "football",
  last_name: "franchise",
  role: "member",
  vendor_id: "vendor_01J98V6VYJ89KZWNRSEF8G669C",
  status: "Active",
};

const Team = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useGetUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="p-4 flex items-center">
        <button
          className="text-sm text-gray-500 font-semibold flex items-center"
          onClick={() => router.back()}
        >
          <span className="mr-2">
            <ArrowLongLeft />
          </span>{" "}
          Back to settings
        </button>
      </div>
      <Container className="bg-white min-h-screen w-auto">
        <div className="flex flex-row justify-between">
          <Heading className="text-[24px] font-semibold mb-2">The Team</Heading>
          <Button
            variant="secondary"
            className="mb-3"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusMini /> Invite Users
          </Button>
        </div>
        <p className="text-[12px] text-gray-500">
          Manage users of your Medusa Store
        </p>
        <div className="flex flex-row justify-between py-8">
          {/* Filters and Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[13px] pl-11 py-1 border bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-blue-500 outline-none"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {user?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No users created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
              <Table className="min-w-full bg-transparent">
                <Table.Header className="bg-gray-100  ">
                  <Table.Row>
                    <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Email
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Team permissions	
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                      Actions
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row key={user?.id} className="hover:bg-gray-100">
                    <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
                      {user?.first_name} {user?.last_name}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[13px] border-b border-gray-300">
                      <div className="flex justify-left items-center">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full text-white text-center bg-slate-700">
                          {user?.email ? user?.email.charAt(0) : " "}
                        </div>
                        <span className="text-gray-700">{user?.email}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[14px] text-violet-500 font-medium border-b border-gray-300">
                      {user?.role[0].toUpperCase() + user?.role.slice(1)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b text-end border-gray-300">
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
                            <PencilSquare className="mr-2" /> Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="bg-white text-gray-500 hover:text-white">
                            <Trash className="mr-2" /> Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          )}
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
              <div className="grid grid-cols-1 gap-1 mb-4 mt-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="useremail@gmail.com"
                    className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 mb-4 mt-6">
              <div>
                <Label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role<span className="text-red-700">*</span>
                </Label>
                <select
                  id="role"
                  name="role"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="transparent"
                  className="ml-2 px-12 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                >
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

export default withAuth(Team);
