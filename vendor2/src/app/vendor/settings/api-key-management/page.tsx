'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Plus } from 'lucide-react'
import withAuth from "@/lib/withAuth"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import DashboardComponent from "../../../../components/dashboard/page"

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
      <div className="card bg-base-100">
        <div className="card-body p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl font-bold text-base-content">API Keys</h2>
            <button className="btn btn-primary btn-sm hidden">
              <Plus className="mr-2 h-4 w-4" /> Create API Key
            </button>
          </div>
          
          {stores?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-base-content/80">No API Keys created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-md">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="text-base-content">S/No</th>
                    <th className="text-base-content">Name</th>
                    <th className="text-base-content">Token</th>
                    <th className="text-base-content">Created</th>
                    <th className="text-base-content">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stores?.map((apiKey, index) => (
                    <tr key={index} className="border-b border-base-300">
                      <td className="text-base-content">{index + 1}</td>
                      <td className="text-base-content">{apiKey.name}</td>
                      <td className="text-base-content">{apiKey.publishableapikey}</td>
                      <td className="text-base-content">
                        {new Date(apiKey.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge ${
                          apiKey.revoked_at 
                            ? "badge-error badge-outline" 
                            : "badge-success badge-outline"
                        }`}>
                          {apiKey.revoked_at ? "Revoked" : "Live"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    </DashboardComponent>
  )
}

export default withAuth(PublishableApiKeysTable)