"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check } from 'lucide-react'
import Link from "next/link"
import { Button } from "@medusajs/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
 import Pagination from "../../../utils/pagination"
import { currencies } from "@/app/utils/currencies "
import DashboardComponent from "../../../../components/dashboard/page"

function CurrencyManager() {
  const [defaultCurrency, setDefaultCurrency] = useState<string>("")
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCurrencyChange = (value: string) => {
    setDefaultCurrency(value)
  }

  const handleSelectCurrency = (currencyCode: string) => {
    setSelectedCurrencies((prev) => {
      if (prev.includes(currencyCode)) {
        return prev.filter((code) => code !== currencyCode)
      }
      return [...prev, currencyCode]
    })
  }

  const handleSaveChanges = () => {
    setIsModalOpen(false)
  }

  const pageSize = 6

  const currentCurrencies = useMemo(() => {
    const offset = currentPage * pageSize
    return currencies.currencies.slice(offset, offset + pageSize)
  }, [currentPage])

  return (
    <DashboardComponent
      title="Currency Management"
      description="Manage the currencies for your store"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <Card className="md:col-span-2 overflow-hidden rounded-[12px] border-0 bg-white/10 backdrop-blur-md shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-black">Store Currencies</CardTitle>
            <Button
              variant="secondary"
              size="small"
              onClick={openModal}
              className="bg-white/10 text-black hover:bg-white/20"
            >
              Edit Currencies
            </Button>
          </CardHeader>
          <CardContent>
            {selectedCurrencies.length === 0 ? (
              <p className="text-black/80">No currencies selected</p>
            ) : (
              <ul className="space-y-2">
                {selectedCurrencies.map((code) => {
                  const currency = currencies.currencies.find((c) => c.code === code)
                  return currency ? (
                    <li
                      key={code}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-black">
                        {currency.code.toLocaleUpperCase()} - {currency.name}
                      </span>
                      {defaultCurrency === currency.code && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-100 rounded-full">
                          Default
                        </span>
                      )}
                    </li>
                  ) : null
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 rounded-[12px] bg-white/10 backdrop-blur-md shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Default Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 mb-4">Select the default currency for your store.</p>
            <Select onValueChange={handleCurrencyChange} value={defaultCurrency}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-black">
                <SelectValue placeholder="Select a currency"  />
              </SelectTrigger>
              <SelectContent>
                {selectedCurrencies.map((code) => {
                  const currency = currencies.currencies.find((c) => c.code === code)
                  return currency ? (
                    <SelectItem key={code} value={currency.code}>
                      {currency.code.toLocaleUpperCase()} - {currency.name}
                    </SelectItem>
                  ) : null
                })}
              </SelectContent>
            </Select>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Select Currencies</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {currentCurrencies.map((currency) => (
              <div key={currency.code} className="flex items-center space-x-2">
                <Checkbox
                  id={currency.code}
                  checked={selectedCurrencies.includes(currency.code)}
                  onCheckedChange={() => handleSelectCurrency(currency.code)}
                />
                <label
                  htmlFor={currency.code}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {currency.code.toLocaleUpperCase()} - {currency.name}
                </label>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={currencies.currencies.length}
            data={currencies.currencies}
          />
          <DialogFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardComponent>
  )
}

export default withAuth(CurrencyManager)

