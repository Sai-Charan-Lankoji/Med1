'use client'

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  IconButton,
  Input,
  Button,
  Table,
  Heading,
  Select,
  Label,
  toast,
  Toaster,
} from "@medusajs/ui"
import {
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
  XMark,
} from "@medusajs/icons"
import { useForm } from "react-hook-form"
import withAuth from "@/lib/withAuth"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import { useCreateUser } from "@/app/hooks/users/useCreateUser"
import { useDeleteUser } from "@/app/hooks/users/useDeleteUser"
import { useGetUsers } from "@/app/hooks/users/useGetUsers"
import { useUpdateUser } from "@/app/hooks/users/useUpdateUser"

export declare enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer"
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRoles;
  vendor_id: string;
}

const permissions = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "developer", label: "Developer" },
]

const statuses = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
]

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: stores } = useGetStores()
  const { data: users } = useGetUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const vendor_id = sessionStorage.getItem('vendor_id')

  const openModal = (user = null) => {
    setEditingUser(user)
    setIsModalOpen(true)
    if (user) {
      setValue("first_name", user.first_name)
      setValue("last_name", user.last_name)
      setValue("email", user.email)
      setValue("role", user.role)
      setValue("password", "")
    } else {
      reset()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    reset()
  }

  const onSubmit = (data: UserFormData) => {
    const userData = {
      ...data,
      vendor_id
    }
    if (editingUser) {
      updateUser.mutate({ id: editingUser.id, ...userData }, {
        onSuccess: () => {
          toast.success("Success", {
            description: "User Updated Successfully",
            duration: 1000,
          });
          closeModal()
        },
      })
    } else {
      createUser.mutate(userData, {
        onSuccess: () => {
          toast.success("Success", {
            description: "User Created Successfully",
            duration: 1000,
          });
          closeModal()
        },
      })
    }
  }

  const openDeleteModal = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setUserToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id, {
        onSuccess: () => {
          toast.success("Success", {
            description: "User Deleted Successfully",
            duration: 1000,
          });
          closeDeleteModal()
        },
      })
    }
  }

  return (
    <>
        <Toaster position="top-right"/>
        
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">The Team</h1>
          <p className="text-sm text-gray-500">
            Manage users of your Medusa Store
          </p>
        </div>
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-md"
          onClick={() => openModal()}
        >
          <Plus className="h-4 w-4" />
          Invite User
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

      <div className="border rounded-sm overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Team permissions</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user) => (
              <Table.Row key={user?.id}>
                <Table.Cell>
                  {user?.first_name} {user?.last_name}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-full text-white text-sm bg-indigo-600">
                      {user?.email ? user?.email.charAt(0).toUpperCase() : ""}
                    </div>
                    <span>{user?.email}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user?.role[0].toUpperCase() + user?.role.slice(1)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user?.deleted_at ? "Deleted" : "Active"}
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
                      <DropdownMenu.Item onClick={() => openModal(user)}>
                        <PencilSquare className="mr-2 text-green-500" />
                        <span className="text-green-500">Edit</span>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => openDeleteModal(user)}>
                        <Trash className="mr-2 text-red-500" />
                        <span className="text-red-500">Delete</span>
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
              <Heading level="h2">{editingUser ? 'Edit User' : 'Invite User'}</Heading>
              <Button variant="secondary" onClick={closeModal}>
                <XMark />
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    placeholder="John"
                    {...register("first_name", { required: "First name is required" })}
                  />
                  {errors.first_name && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    {...register("last_name", { required: "Last name is required" })}
                  />
                  {errors.last_name && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
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
                  <Label htmlFor="password">
                    Password {!editingUser && <span className="text-rose-500">*</span>}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: !editingUser })}
                  />
                  {errors.password && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
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
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
            {(createUser.isError || updateUser.isError) && (
              <p className="text-rose-500 mt-4">
                An error occurred while {editingUser ? 'updating' : 'creating'} the user. Please try again.
              </p>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-[400px]">
            <Heading level="h3" className="mb-4">Confirm Deletion</Heading>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default withAuth(Users)