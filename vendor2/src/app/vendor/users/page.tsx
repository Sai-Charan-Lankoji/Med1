"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useCreateUser } from "@/app/hooks/users/useCreateUser";
import { useDeleteUser } from "@/app/hooks/users/useDeleteUser";
import { useGetUsers } from "@/app/hooks/users/useGetUsers";
import { useUpdateUser } from "@/app/hooks/users/useUpdateUser";
import { UserFormData } from "@/app/@types/user";
import { vendor_id } from "@/app/utils/constant";
import toast, { Toaster } from "react-hot-toast";

const permissions = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "developer", label: "Developer" },
];

const statuses = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stores } = useGetStores();
  const { data: users } = useGetUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const vendorId = vendor_id;

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    if (user) {
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("password", "");
    } else {
      reset();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = (data: UserFormData) => {
    const userData = { ...data, vendorId };
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, ...userData },
        {
          onSuccess: () => {
            toast.success("User Updated Successfully", { duration: 1000 });
            closeModal();
          },
        }
      );
    } else {
      createUser.mutate(userData, {
        onSuccess: () => {
          toast.success("User Created Successfully", { duration: 1000 });
          closeModal();
        },
      });
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id, {
        onSuccess: () => {
          toast.success("User Deleted Successfully", { duration: 1000 });
          closeDeleteModal();
        },
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">The Team</h1>
            <p className="text-sm text-gray-500">Manage users of your Store</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Invite User
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-4 flex-1">
            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Team Permissions
              </option>
              {permissions.map((permission) => (
                <option key={permission.value} value={permission.value}>
                  {permission.label}
                </option>
              ))}
            </select>

            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Status
              </option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team permissions
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user?.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    {user?.first_name} {user?.last_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-full text-white text-sm bg-indigo-600">
                        {user?.email ? user?.email.charAt(0).toUpperCase() : ""}
                      </div>
                      <span>{user?.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    <span
                      className={`badge ${
                        user?.role === "admin"
                          ? "badge-primary"
                          : "badge-info"
                      }`}
                    >
                      {user?.role[0].toUpperCase() + user?.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    <span className="badge badge-success">
                      {user?.deleted_at ? "Deleted" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <MoreHorizontal className="h-5 w-5" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <button
                            onClick={() => openModal(user)}
                            className="flex items-center text-green-500"
                          >
                            <Pencil className="mr-2 h-5 w-5" />
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="flex items-center text-red-500"
                          >
                            <Trash2 className="mr-2 h-5 w-5" />
                            Delete
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingUser ? "Edit User" : "Invite User"}
                </h2>
                <button onClick={closeModal} className="btn btn-ghost btn-circle">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="first_name" className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      id="first_name"
                      placeholder="John"
                      className="input input-bordered"
                      {...register("first_name", { required: "First name is required" })}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label htmlFor="last_name" className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      id="last_name"
                      placeholder="Doe"
                      className="input input-bordered"
                      {...register("last_name", { required: "Last name is required" })}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="email" className="label">
                      <span className="label-text">
                        Email <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      className="input input-bordered"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label htmlFor="password" className="label">
                      <span className="label-text">
                        Password {!editingUser && <span className="text-red-500">*</span>}
                      </span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="input input-bordered"
                      {...register("password", { required: !editingUser })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="form-control">
                  <label htmlFor="role" className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    id="role"
                    name="role"
                    required
                    className="select select-bordered w-full"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? "Update User" : "Create User"}
                  </button>
                </div>
                {(createUser.isError || updateUser.isError) && (
                  <p className="text-red-500 mt-4">
                    An error occurred while {editingUser ? "updating" : "creating"} the user. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-[400px]">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete{" "}
                <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={closeDeleteModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn btn-error">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(Users);