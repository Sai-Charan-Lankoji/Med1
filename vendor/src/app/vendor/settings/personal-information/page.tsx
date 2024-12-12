"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, User, Globe, BarChart3 } from 'lucide-react'
import { Button, Label } from "@medusajs/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
import withAuth from "@/lib/withAuth"
import { useAuth } from "@/app/context/AuthContext"
import { getColors } from "@/app/utils/dummyData"
import DashboardComponent from "../../../../components/dashboard/page"

function PersonalInformation() {
  const { email } = useAuth() ?? { email: "Default Email" }
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  })

  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false)
  const [isEditPreferencesOpen, setIsEditPreferencesOpen] = useState(false)
  const [isAnonymized, setIsAnonymized] = useState(false)
  const [isOptedOut, setIsOptedOut] = useState(false)
  const [language, setLanguage] = useState("en")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <DashboardComponent
      title="Personal Information"
      description="Manage your Medusa profile"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-0 rounded-[12px] bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div
              className={`w-12 h-12 flex text-2xl items-center justify-center rounded-full text-black ${getColors(2)}`}
            >
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-black">{email}</CardTitle>
              <p className="text-sm text-black/80">Your account email</p>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsEditInfoOpen(true)}
              className="w-full bg-white/10 text-black hover:bg-white/20"
            >
              Edit Information
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 rounded-[12px] bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 mb-4">Adjust the language of Medusa Admin</p>
            <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-black">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden border-0 rounded-[12px] bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Usage Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 mb-4">Share usage insights and help us improve Medusa</p>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsEditPreferencesOpen(true)}
              className="w-full bg-white/10 text-black hover:bg-white/20"
            >
              Edit Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <Button variant="transparent" className="text-black hover:bg-white hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
      </motion.div>

      <Dialog open={isEditInfoOpen} onOpenChange={setIsEditInfoOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-violet-500 hover:bg-violet-700 border-none rounded-[4px]" onClick={() => setIsEditInfoOpen(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditPreferencesOpen} onOpenChange={setIsEditPreferencesOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Preferences</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="anonymize">Anonymize my usage data</Label>
                <p className="text-sm text-muted-foreground">
                  Choose to anonymize your usage data
                </p>
              </div>
              <Switch
                id="anonymize"
                checked={isAnonymized}
                onCheckedChange={setIsAnonymized}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="optout">Opt out of sharing my usage data</Label>
                <p className="text-sm text-muted-foreground">
                  Choose to opt out of sharing your usage data
                </p>
              </div>
              <Switch
                id="optout"
                checked={isOptedOut}
                onCheckedChange={setIsOptedOut}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-violet-500 hover:bg-violet-700 rounded-[4px]" onClick={() => setIsEditPreferencesOpen(false)}>
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardComponent>
  )
}

export default withAuth(PersonalInformation)

