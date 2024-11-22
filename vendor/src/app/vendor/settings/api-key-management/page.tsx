'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import withAuth from "@/lib/withAuth"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import DashboardComponent from "../../components/dashboard/page"

function PublishableApiKeysTable() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false)
  const pageSize = 6
  const { data: stores } = useGetStores()

  return (
    <DashboardComponent
      title="Publishable API Keys"
      description="Manage your publishable keys to authenticate API requests."
    >
      {/* <Card className="mb-6 overflow-hidden rounded-[12px] border-0 bg-white/10 backdrop-blur-md shadow-2xl"> */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-white">
            API Keys
          </CardTitle>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white hover:bg-white/20 hidden"
          >
            <Plus className="mr-2 h-4 w-4" /> Create API Key
          </Button>
        </CardHeader>
        <CardContent>
          {stores?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/80">No API Keys created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10">
                    <TableHead className="text-white">S/No</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Token</TableHead>
                    <TableHead className="text-white">Created</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores?.map((apiKey, index) => (
                    <TableRow key={index} className="border-b border-white/10">
                      <TableCell className="text-white">{index + 1}</TableCell>
                      <TableCell className="text-white">
                        {apiKey.name}
                      </TableCell>
                      <TableCell className="text-white">
                        {apiKey.publishableapikey}
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(apiKey.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={apiKey.revoked_at ? "destructive" : "secondary"}
                          className={`rounded-full text-xs font-medium ${
                            apiKey.revoked_at 
                              ? "bg-red-500/10 text-red-500" 
                              : "bg-green-500/10 text-green-400"
                          }`}                        >
                          {apiKey.revoked_at ? "Revoked" : "Live"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      {/* </Card> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/vendor/settings" passHref>
          <Button variant="ghost" className="text-white hover:bg-white hover:text-fuchsia-700 rounded-[4px]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </Button>
        </Link>
      </motion.div>
    </DashboardComponent>
  )
}

export default withAuth(PublishableApiKeysTable)