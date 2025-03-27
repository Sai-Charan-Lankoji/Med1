'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Plus, Search, MoreHorizontal, Edit, Trash } from 'lucide-react'
import Link from "next/link"
import withAuth from "@/lib/withAuth"
import { useGetUsers } from "@/app/hooks/users/useGetUsers"
import DashboardComponent from "../../../../components/dashboard/page"

const TeamManagement = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: users } = useGetUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("member")

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleInviteUser = () => {
    // Implement user invitation logic here
    closeModal()
  }

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardComponent
      title="Team Management"
      description="Manage your team members and their roles"
    >
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <h2 className="card-title text-xl font-bold text-base-content">Team Members</h2>
            <button
              onClick={openModal}
              className="btn btn-primary btn-sm"
            >
              <Plus className="mr-2 h-4 w-4" /> Invite User
            </button>
          </div>
          
          <div className="flex items-center mb-4 relative">
            <Search className="h-4 w-4 text-base-content/60 absolute ml-3" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered pl-10 w-full"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-base-content/80">Name</th>
                  <th className="text-base-content/80">Email</th>
                  <th className="text-base-content/80">Role</th>
                  <th className="text-right text-base-content/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td className="font-medium text-base-content">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="text-base-content/80">{user.email}</td>
                    <td className="text-base-content/80">
                      {user.role[0].toUpperCase() + user.role.slice(1)}
                    </td>
                    <td className="text-right">
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-40">
                          <li>
                            <a className="text-success flex items-center">
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </a>
                          </li>
                          <li>
                            <a className="text-error flex items-center">
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </a>
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <button className="btn btn-ghost text-base-content hover:bg-base-200">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </button>
        </Link>
      </motion.div>

      {/* Modal using daisyUI */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Invite New User</h3>
          <div className="grid gap-4 py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleInviteUser} className="btn btn-primary">Invite User</button>
            <button onClick={closeModal} className="btn">Cancel</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </DashboardComponent>
  )
}

export default withAuth(TeamManagement)