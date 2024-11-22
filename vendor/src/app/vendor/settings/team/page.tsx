'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Plus, Search, MoreHorizontal, Edit, Trash } from 'lucide-react'
import Link from "next/link"
import { Button } from "@medusajs/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import withAuth from "@/lib/withAuth"
import { useGetUsers } from "@/app/hooks/users/useGetUsers"
import DashboardComponent from "../../components/dashboard/page"

function TeamManagement() {
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
    console.log("Inviting user:", newUserEmail, "with role:", newUserRole)
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
      {/* <Card className="overflow-hidden rounded-[12px] border-0 bg-white/10 backdrop-blur-md shadow-2xl"> */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-white">Team Members</CardTitle>
          <Button
            variant="secondary"
            size="small"
            onClick={openModal}
            className="bg-white/10 text-white hover:bg-white hover:text-fuchsia-700 rounded-[4px]"
          >
            <Plus className="mr-2 h-4 w-4" /> Invite User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="h-4 w-4 text-white/60 absolute ml-3" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/60"
            />
          </div>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="text-white/80">Name</TableHead>
                  <TableHead className="text-white/80">Email</TableHead>
                  <TableHead className="text-white/80">Role</TableHead>
                  <TableHead className="text-right text-white/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="text-white/80">{user.email}</TableCell>
                    <TableCell className="text-white/80">
                      {user.role[0].toUpperCase() + user.role.slice(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="transparent" className="h-8 w-8 p-0 text-white/80 hover:bg-white/10">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20">
                          <DropdownMenuItem className="text-white hover:bg-white/20">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/20">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      {/* </Card> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <Button variant="transparent" className="text-white hover:bg-white hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="col-span-3 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select onValueChange={setNewUserRole} defaultValue={newUserRole}>
                <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInviteUser} className="bg-white/10 text-white hover:bg-white/20">
              Invite User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardComponent>
  )
}

export default withAuth(TeamManagement)