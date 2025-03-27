"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check } from 'lucide-react'
import Link from "next/link"
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

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultCurrency(e.target.value)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-md md:col-span-2">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-base-content">Store Currencies</h2>
              <button
                onClick={openModal}
                className="btn btn-primary btn-sm"
              >
                Edit Currencies
              </button>
            </div>
            
            {selectedCurrencies.length === 0 ? (
              <p className="text-base-content/80">No currencies selected</p>
            ) : (
              <ul className="space-y-2">
                {selectedCurrencies.map((code) => {
                  const currency = currencies.currencies.find((c) => c.code === code)
                  return currency ? (
                    <li
                      key={code}
                      className="flex items-center justify-between p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    >
                      <span className="text-base-content">
                        {currency.code.toLocaleUpperCase()} - {currency.name}
                      </span>
                      {defaultCurrency === currency.code && (
                        <span className="badge badge-success">
                          Default
                        </span>
                      )}
                    </li>
                  ) : null
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base-content">Default Currency</h2>
            <p className="text-base-content/80 mb-4">Select the default currency for your store.</p>
            <select 
              className="select select-bordered w-full" 
              onChange={handleCurrencyChange}
              value={defaultCurrency}
            >
              <option value="" disabled>Select a currency</option>
              {selectedCurrencies.map((code) => {
                const currency = currencies.currencies.find((c) => c.code === code)
                return currency ? (
                  <option key={code} value={currency.code}>
                    {currency.code.toLocaleUpperCase()} - {currency.name}
                  </option>
                ) : null
              })}
            </select>
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
          <button className="btn btn-ghost text-base-content">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </button>
        </Link>
      </motion.div>

      {/* Modal using daisyUI */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Select Currencies</h3>
          <div className="py-4">
            {currentCurrencies.map((currency) => (
              <div key={currency.code} className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    {currency.code.toLocaleUpperCase()} - {currency.name}
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedCurrencies.includes(currency.code)}
                    onChange={() => handleSelectCurrency(currency.code)}
                  />
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
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
            <button className="btn" onClick={closeModal}>Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </DashboardComponent>
  )
}

export default withAuth(CurrencyManager)

