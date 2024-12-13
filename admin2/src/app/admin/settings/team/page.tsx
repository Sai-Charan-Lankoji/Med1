"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@medusajs/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import withAuth from "@/lib/withAuth";
import DashboardComponent from "../../../../components/dashboard/page";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import { useQuery } from "@tanstack/react-query";
import { useGetUsers } from "@/app/hooks/users/useGetUsers";
import { useGetInvites } from "@/app/hooks/invites/useGetInvites";
import { useCreateInvite } from "@/app/hooks/invites/useCreateInvite";

const TeamManagement = () => {
  const { data: users } = useGetUsers()
  const { data: invites } = useGetInvites();
  const createInviteMutation = useCreateInvite();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setNewUserEmail] = useState("");
  const [role, setNewUserRole] = useState("member");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInviteUser = () => {
    createInviteMutation.mutate(
      { email, role },
      {
        onSuccess: () => {
          console.log("Invite created successfully");
        },
        onError: (err) => {
          console.error("Failed to create invite:", err);
        },
      }
    );
    closeModal();
  };

  // Combine users and invites, adding type and status
  const combinedData = {
    users: users?.map((user) => ({
      ...user,
      type: "admin",
      status: user.deleted_at ? "Inactive" : "Active",
    })),
    invites: invites?.map((invite) => ({
      ...invite,
      type: "member",
      status: invite.expires_at ? "Inactive" : "Active",
    })),
  };

  console.log("COMBINED DATA: ", combinedData);
  // const filteredData = combinedData?.filter(
  //   (item) =>
  //     item?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     (item?.type === "admin" &&
  //       `${item.first_name || ""} ${item.last_name || ""}`
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()))
  // );

  return (
    <DashboardComponent
      title="Team Management"
      description="Manage your team members and their roles"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-black">
          Team Members
        </CardTitle>
        <Button
          variant="secondary"
          size="small"
          onClick={openModal}
          className="bg-white/10 text-black hover:bg-white hover:text-fuchsia-700 rounded-[4px]"
        >
          <Plus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Search className="h-4 w-4 text-black/60 absolute ml-3" />
          <Input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-black placeholder-white/60"
          />
        </div>
        <div className="rounded-md border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow>
                <TableHead className="text-black/80">Name</TableHead>
                <TableHead className="text-black/80">Email</TableHead>
                <TableHead className="text-black/80">Role</TableHead>
                <TableHead className="text-black/80">Status</TableHead>
                <TableHead className="text-right text-black/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Loop through users */}
              {combinedData?.users?.map((user) => {
                const status = user.deleted_at ? "Inactive" : "Active";
                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-white/5 bg-blue-50"
                  >
                    <TableCell className="font-medium text-black">
                      {`${user.first_name || ""} ${
                        user.last_name || ""
                      }`.trim() || user.email}
                    </TableCell>
                    <TableCell className="text-black/80">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-black/80">
                      {user.role}
                    </TableCell>
                    <TableCell
                      className={`text-black ${
                        status === "Active" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {status}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="transparent"
                            className="h-8 w-8 p-0 text-black/80 hover:bg-white/10"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/10 backdrop-blur-md border-white/20"
                        >
                          <DropdownMenuItem className="text-green-500 hover:bg-white/20">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 hover:bg-white/20">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Loop through invites */}
              {combinedData?.invites?.map((invite) => {
                const now = new Date();
                const expiresAt = new Date(invite.expires_at);
                const status = expiresAt > now ? "Pending" : "Expired"; // Status based on expiration
                const name = invite.user_email.split("@")[0]; // Extract name before @

                return (
                  <TableRow
                    key={invite.id}
                    className="hover:bg-white/5 bg-green-50"
                  >
                    <TableCell className="font-medium text-black">
                      {name}
                    </TableCell>
                    <TableCell className="text-black/80">
                      {invite.user_email}
                    </TableCell>
                    <TableCell className="text-black/80">
                      {invite.role}
                    </TableCell>
                    <TableCell
                      className={`text-black ${
                        status === "Pending" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {status}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="transparent"
                            className="h-8 w-8 p-0 text-black/80 hover:bg-white/10"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/10 backdrop-blur-md border-white/20"
                        >
                          <DropdownMenuItem className="text-green-500 hover:bg-white/20">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 hover:bg-white/20">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
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
                value={email}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="col-span-3 bg-white text-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select onValueChange={setNewUserRole} defaultValue={role}>
                <SelectTrigger className="col-span-3 bg-white text-black">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-white/20">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleInviteUser}
              className="bg-purple-400 hover:bg-purple-600 text-white border-none"
            >
              Invite User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Link href="/admin/settings" passHref>
          <Button variant="transparent" className="text-black hover:bg-white hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
    </DashboardComponent>
  );
};

export default TeamManagement;
