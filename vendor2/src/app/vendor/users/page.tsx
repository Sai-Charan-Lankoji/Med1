"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useCreateUser } from "@/app/hooks/users/useCreateUser";
import { useDeleteUser } from "@/app/hooks/users/useDeleteUser";
import { useGetUsers } from "@/app/hooks/users/useGetUsers";
import { useUpdateUser } from "@/app/hooks/users/useUpdateUser";
import { UserFormData, UserResponseData, UserRoles } from "@/app/@types/user";
import { vendor_id } from "@/app/utils/constant";
import toast, { Toaster } from "react-hot-toast";

const permissions = [
  { value: "all", label: "All" },
  { value: UserRoles.ADMIN, label: "Admin" },
  { value: UserRoles.MEMBER, label: "Member" },
  { value: UserRoles.DEVELOPER, label: "Developer" },
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
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponseData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>();
  const { createUser, isLoading: isCreating } = useCreateUser();
  const { updateUser, isLoading: isUpdating } = useUpdateUser();
  const { deleteUser, isLoading: isDeleting } = useDeleteUser();
  const vendorId = vendor_id;

  const openModal = (user: UserResponseData | null = null) => {
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

  const onSubmit = async (data: UserFormData) => {
    const userData = { ...data, vendor_id: vendorId };
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...userData });
        toast.success("User Updated Successfully", { duration: 1000 });
      } else {
        await createUser(userData);
        toast.success("User Created Successfully", { duration: 1000 });
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${editingUser ? "updating" : "creating"} user:`, error);
      toast.error(`Failed to ${editingUser ? "update" : "create"} user`, { duration: 1000 });
    }
  };

  const openDeleteModal = (user: UserResponseData) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        toast.success("User Deleted Successfully", { duration: 1000 });
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user", { duration: 1000 });
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">The Team</h1>
            <p className="text-sm text-base-content/70">Manage users of your Store</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn btn-secondary flex items-center gap-2"
            disabled={isCreating || isUpdating || isDeleting || isLoadingUsers}
          >
            <Plus className="h-4 w-4" />
            Invite User
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-4 flex-1">
            <select className="select select-bordered w-full max-w-xs bg-base-200 text-base-content">
              <option disabled selected>
                Team Permissions
              </option>
              {permissions.map((permission) => (
                <option key={permission.value} value={permission.value}>
                  {permission.label}
                </option>
              ))}
            </select>

            <select className="select select-bordered w-full max-w-xs bg-base-200 text-base-content">
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
              className="input input-bordered w-full pl-10 bg-base-200 text-base-content"
            />
          </div>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg border border-base-200">
          {isLoadingUsers ? (
            <div className="flex justify-center items-center p-6">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : users && users.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Team permissions
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td className="px-4 py-3 text-sm text-base-content/70 border-b border-base-200">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-base-content/70 border-b border-base-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-full text-white text-sm bg-primary">
                          {user.email ? user.email.charAt(0).toUpperCase() : ""}
                        </div>
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-base-content/70 border-b border-base-200">
                      <span
                        className={`badge ${
                          user.role === UserRoles.ADMIN ? "badge-primary" : "badge-info"
                        }`}
                      >
                        {user.role[0].toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-base-content/70 border-b border-base-200">
                      <span className="badge badge-success">
                        {user.deleted_at ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-base-content/70 border-b border-base-200">
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
                              disabled={isCreating || isUpdating || isDeleting}
                            >
                              <Pencil className="mr-2 h-5 w-5" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="flex items-center text-red-500"
                              disabled={isCreating || isUpdating || isDeleting}
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
          ) : (
            <div className="flex justify-center items-center p-6">
              <p className="text-base-content/70">No users found.</p>
            </div>
          )}
        </div>

        <input
          type="checkbox"
          id="user-modal"
          className="modal-toggle"
          checked={isModalOpen}
          onChange={() => setIsModalOpen(!isModalOpen)}
        />
        <div className="modal">
          <div className="modal-box bg-base-100 text-base-content max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                    className="input input-bordered bg-base-200 text-base-content"
                    {...register("first_name", { required: "First name is required" })}
                  />
                  {errors.first_name && (
                    <p className="text-error text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="form-control">
                  <label htmlFor="last_name" className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    id="last_name"
                    placeholder="Doe"
                    className="input input-bordered bg-base-200 text-base-content"
                    {...register("last_name", { required: "Last name is required" })}
                  />
                  {errors.last_name && (
                    <p className="text-error text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text">
                      Email <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    className="input input-bordered bg-base-200 text-base-content"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text">
                      Password {!editingUser && <span className="text-error">*</span>}
                    </span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="input input-bordered bg-base-200 text-base-content"
                    {...register("password", { required: !editingUser && "Password is required" })}
                  />
                  {errors.password && (
                    <p className="text-error text-sm mt-1">{errors.password.message}</p>
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
                  className="select select-bordered w-full bg-base-200 text-base-content"
                >
                  <option value={UserRoles.MEMBER}>{UserRoles.MEMBER}</option>
                  <option value={UserRoles.ADMIN}>{UserRoles.ADMIN}</option>
                  <option value={UserRoles.DEVELOPER}>{UserRoles.DEVELOPER}</option>
                </select>
                {errors.role && (
                  <p className="text-error text-sm mt-1">{errors.role.message}</p>
                )}
              </div>
              <div className="modal-action">
                <button
                  onClick={closeModal}
                  className="btn btn-secondary"
                  disabled={isCreating || isUpdating || isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreating || isUpdating || isDeleting}
                >
                  {isCreating || isUpdating ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editingUser ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <input
          type="checkbox"
          id="delete-modal"
          className="modal-toggle"
          checked={isDeleteModalOpen}
          onChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        />
        <div className="modal">
          <div className="modal-box bg-base-100 text-base-content max-w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.first_name} {userToDelete?.last_name}
              </strong>
              ?
            </p>
            <div className="modal-action">
              <button
                onClick={closeDeleteModal}
                className="btn btn-secondary"
                disabled={isCreating || isUpdating || isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error"
                disabled={isCreating || isUpdating || isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Users);