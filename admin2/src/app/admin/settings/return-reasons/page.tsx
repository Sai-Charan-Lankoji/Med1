"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button, Input, Label, Textarea } from "@medusajs/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import withAuth from "@/lib/withAuth"
import DashboardComponent from "../../../../components/dashboard/page"

function ReturnReasons() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <DashboardComponent
      title="Return Reasons"
      description="Manage reasons for returned items"
    >
      <Card className="overflow-hidden border-0 rounded-[12px] bg-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-white">Return Reasons</CardTitle>
          <Button
            variant="secondary"
            size="small"
            onClick={openModal}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Add reason
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-white/80">No return reasons added yet.</p>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <Button variant="transparent" className="text-white hover:bg-none hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Add Reason</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="value">Value <span className="text-red-500">*</span></Label>
                <Input
                  id="value"
                  placeholder="wrong_size"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="label">Label <span className="text-red-500">*</span></Label>
                <Input
                  id="label"
                  placeholder="Wrong size"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="py-4">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe the return reason"
                className="mt-1"
                rows={3}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-violet-600 text-white hover:bg-violet-700">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardComponent>
  )
}

export default withAuth(ReturnReasons)

