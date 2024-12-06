'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Plus, Search, MoreHorizontal, PenSquare, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import withAuth from "@/lib/withAuth"
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels"
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel"
import { useUpdateSalesChannel } from "@/app/hooks/saleschannel/useUpdateSalesChannel"
import DashboardComponent from "../../../../components/dashboard/page"
import SalesTable from "@/components/saleschannelTableView/salesTable"

function SalesChannels() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Default Sales Channel")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vendor_id: sessionStorage.getItem("vendor_id"),
  })
  const { data: SalesChannels } = useGetSalesChannels()
  const channelId = SalesChannels?.find((channel) => channel.name === selectedRegion)?.id
  const { mutate: createSalesChannel } = useCreateSalesChannel()
  const { mutate: updateSalesChannel } = useUpdateSalesChannel(channelId)
  const vendorName = sessionStorage.getItem("contactName")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const openEditModal = () => setIsEditModalOpen(true)
  const closeEditModal = () => setIsEditModalOpen(false)

  const handleRadioChange = (region: string) => {
    setSelectedRegion(region)
    const selectedChannel = SalesChannels?.find((channel) => channel.name === region)
    if (selectedChannel) {
      setFormData({
        name: selectedChannel.name,
        description: selectedChannel.description,
        vendor_id: sessionStorage.getItem("vendor_id") || "",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createSalesChannel(
      {
        name: formData.name,
        description: formData.description,
        vendor_id: formData.vendor_id,
      },
      {
        onSuccess: (response) => {
          console.log("Successfully Created Sales Channel ", response)
          closeModal()
        },
        onError: (error) => {
          console.error("Error while creating sales channel:", error)
        },
      }
    )
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (channelId) {
      updateSalesChannel(
        {
          channelId,
          name: formData.name,
          description: formData.description
        },
        {
          onSuccess: (response) => {
            console.log("Successfully Updated Sales Channel", response)
            closeEditModal()
          },
          onError: (error) => {
            console.error("Error while updating sales channel:", error)
          },
        }
      )
    }
  }

  const renderSidebarContent = () => {
    switch (selectedRegion) {
      case selectedRegion:
        return (
          <>
            <div className="flex justify-between items-center px-8 mb-6">
              <h2 className="text-2xl font-semibold text-black">{selectedRegion}</h2>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-black/80">
                  <span className="w-2.5 h-2.5 rounded-full mr-2 inline-block bg-green-500"></span>
                  Enabled
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-white/10 text-black hover:bg-white/20">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                    <DropdownMenuItem className="flex items-center gap-x-2 px-4 py-2 text-sm text-black hover:bg-white/20" onClick={openEditModal}>
                      <PenSquare className="h-4 w-4" />
                      Edit General info
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-x-2 px-4 py-2 text-sm text-black hover:bg-white/20">
                      <Plus className="h-4 w-4" />
                      Add Products
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <SalesTable />
          </>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl font-semibold text-black/60">
              Select a channel to view details
            </h2>
          </div>
        )
    }
  }

  return (
    <DashboardComponent
      title="Sales Channels"
      description="Control which products are available in which channels"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 overflow-hidden rounded-[12px] border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-black">Channels</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="bg-white/10 text-black hover:bg-white/20">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 text-black hover:bg-white/20" onClick={openModal}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SalesChannels?.map((channel) => (
                <motion.div
                  key={channel.id}
                  className={`cursor-pointer p-4 rounded-lg transition-colors ${
                    selectedRegion === channel.name
                      ? "bg-white/20 text-black"
                      : "bg-white/5 text-black/80 hover:bg-white/10"
                  }`}
                  onClick={() => handleRadioChange(channel.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{channel.name}</h3>
                      <p className="text-sm text-black/60">
                        {channel.description}
                      </p>
                    </div>
                    <p className="text-xs text-black/60">
                      Created By {vendorName}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden rounded-[12px] border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <CardContent className="p-6">
            {renderSidebarContent()}
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/admin/settings" passHref>
          <Button variant="ghost" className="text-black hover:bg-white hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md border-white/20 text-black">
          <DialogHeader>
            <DialogTitle>Create new sales channel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3 bg-white/10 border-white/20 text-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3 bg-white/10 border-white/20 text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit">Create Channel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md border-white/20 text-black">
          <DialogHeader>
            <DialogTitle>Edit Sales Channel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3 bg-white/10 border-white/20 text-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3 bg-white/10 border-white/20 text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeEditModal}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardComponent>
  )
}

export default withAuth(SalesChannels)