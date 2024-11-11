"use client";

import { useState } from "react";
import {
  DropdownMenu,
  IconButton,
  Input,
  Button,
  Table,
  Heading,
  Select,
  Label,
} from "@medusajs/ui";
import {
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
  XMark,
  XMarkMini,
} from "@medusajs/icons";
import { useGetUsers } from "@/app/hooks/users/useGetUsers";
import { useCreateUser } from "@/app/hooks/users/useCreateUser";
import { useForm } from "react-hook-form";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import withAuth from "@/lib/withAuth";

type UserRoles = "admin" | "member" | "developer";
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  store_id: string;
  vendor_id: string;
}

const permissions = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "member",
    label: "Member",
  },
  {
    value: "developer",
    label: "Developer",
  },
];

const statuses = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "expired",
    label: "Expired",
  },
];
const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stores } = useGetStores();
  const { data: Users } = useGetUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>();
  const createUser = useCreateUser();
  const vendorId = sessionStorage.getItem('vendor_id')
  const store = stores?.find((store) => store.vendor_id === vendorId)
  const storeId = store?.id

  const onSubmit = (data: UserFormData) => {
    const newUserData = {
      ...data,
      vendorId,
      storeId,
    }
    createUser.mutate(newUserData, {
      onSuccess: () => {
        closeModal();
        reset();
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">The Team</h1>
          <p className="text-sm text-gray-500">
            Manage users of your Medusa Store
          </p>
        </div>
        <Button
          variant="transparent"
          className="flex items-center gap-2 border border-ui-border-strong bg-ui-bg-base-hover"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" />
          Invite Users
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-4 flex-1">
          <Select>
            <Select.Trigger>
              <Select.Value placeholder="Team Permissions" />
            </Select.Trigger>
            <Select.Content>
              {permissions.map((permission) => (
                <Select.Item key={permission.value} value={permission.value}>
                  {permission.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select>
            <Select.Trigger>
              <Select.Value placeholder="Status" />
            </Select.Trigger>
            <Select.Content>
              {statuses.map((status) => (
                <Select.Item key={status.value} value={status.value}>
                  {status.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                Name
              </Table.HeaderCell>{" "}
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Team permissions</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Users?.map((user) => (
            <Table.Row key={user?.id}>
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
              <Table.Cell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                    user?.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user?.role[0].toUpperCase() + user?.role.slice(1)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  {user?.deleted_at ? "deleted" : "active"}
                </span>
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <IconButton variant="transparent">
                      <EllipsisHorizontal className="text-ui-fg-subtle" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item className="text-green-700">
                      <PencilSquare className="mr-2" />
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-red-700">
                      <Trash className="mr-2" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
             ))} 
          </Table.Body>
        </Table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <Heading level="h2">Invite Users</Heading>
              <Button variant="secondary" size="small" onClick={closeModal}>
                <XMark />
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register("firstName")}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 mb-4 mt-6">
                <div>
                  <Label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role<span className="text-red-700"></span>
                  </Label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    id="role"
                    name="role"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                  </select>
                  {errors.role && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create User
                </Button>
              </div>
            </form>
            {createUser.isError && (
              <p className="text-rose-500 mt-4">
                An error occurred while creating the user. Please try again.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default withAuth(Users);