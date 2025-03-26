"use client"

import React,{ useState } from "react"
import { motion } from "framer-motion"
import {
  Package2,
  RefreshCcw,
  PlusCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  AlertTriangle,
  Clock,
  Check,
  Layers,
  X,
  Filter,
  BarChart3
} from "lucide-react"
import { format } from "date-fns"
import { useStock } from "@/app/hooks/useStock"
import { AddStockDialog } from "./add-stock-dialog"

interface Variant {
  variantId: string
  stockId: string
  size: string
  color: string
  totalQuantity: number
  availableQuantity: number
  onHoldQuantity: number
  exhaustedQuantity: number
  createdAt: string
  updatedAt: string
  stock_id: string
}

interface Stock {
  stock_id: string
  title: string
  totalQuantity: number
  availableQuantity: number
  onHoldQuantity: number
  exhaustedQuantity: number
  createdAt: string
  updatedAt: string
  StockVariants: Variant[]
  totals: {
    totalQuantity: number
    availableQuantity: number
    onHoldQuantity: number
    exhaustedQuantity: number
  }
  availableVariants: {
    sizes: string[]
    colors: string[]
  }
}

export default function StockManagement() {
  const { stocks, loading, error, fetchStocks } = useStock()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddStock, setShowAddStock] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [expandedStocks, setExpandedStocks] = useState<Record<string, boolean>>({})

  const handleRefresh = async () => {
    setIsRefreshing(true)
    window.location.reload()
    setIsRefreshing(false)
  }

  const handleAddStock = () => {
    setShowAddStock(true)
  }

  const toggleStockExpansion = (stockId: string) => {
    setExpandedStocks((prev) => ({
      ...prev,
      [stockId]: !prev[stockId],
    }))
  }

  // Calculate counts for tabs
  const lowStockCount = stocks.filter(
    (stock) => stock.availableQuantity > 0 && stock.availableQuantity <= stock.totalQuantity * 0.2,
  ).length

  const outOfStockCount = stocks.filter((stock) => stock.availableQuantity === 0).length

  // Calculate overall totals
  const overallTotals = {
    totalQuantity: stocks.reduce((sum, stock) => sum + stock.totalQuantity, 0),
    availableQuantity: stocks.reduce((sum, stock) => sum + stock.availableQuantity, 0),
    onHoldQuantity: stocks.reduce((sum, stock) => sum + stock.onHoldQuantity, 0),
    exhaustedQuantity: stocks.reduce((sum, stock) => sum + stock.exhaustedQuantity, 0),
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="alert alert-error max-w-md shadow-lg">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Error Loading Stock Data</h3>
            <div className="text-sm">{error}</div>
          </div>
          <button onClick={handleRefresh} className="btn btn-outline btn-sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen bg-base-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            Stock Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage and track your inventory levels</p>
        </div>
        <div className="join shadow-sm">
          <button onClick={handleAddStock} className="btn btn-primary join-item">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Stock
          </button>
          <button 
            className={`btn join-item ${isRefreshing ? 'btn-disabled' : 'btn-outline'}`} 
            onClick={handleRefresh}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stock Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StockCard
          title="Total Stock"
          value={overallTotals.totalQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="primary"
        />
        <StockCard
          title="Available"
          value={overallTotals.availableQuantity}
          icon={<Check className="h-5 w-5" />}
          color="success"
        />
        <StockCard
          title="On Hold"
          value={overallTotals.onHoldQuantity}
          icon={<Clock className="h-5 w-5" />}
          color="warning"
        />
        <StockCard
          title="Used"
          value={overallTotals.exhaustedQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="error"
        />
      </motion.div>

      {/* Stock Table with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-base-100 shadow"
      >
        <div className="card-body p-0 overflow-hidden">
          <div className="bg-base-200 p-4 border-b border-base-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="tabs tabs-boxed bg-base-300/50 inline-flex">
                <button 
                  className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Stock
                </button>
                <button 
                  className={`tab ${activeTab === 'low-stock' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('low-stock')}
                >
                  Low Stock
                  {lowStockCount > 0 && (
                    <span className="badge badge-warning badge-sm ml-2">{lowStockCount}</span>
                  )}
                </button>
                <button 
                  className={`tab ${activeTab === 'out-of-stock' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('out-of-stock')}
                >
                  Out of Stock
                  {outOfStockCount > 0 && (
                    <span className="badge badge-error badge-sm ml-2">{outOfStockCount}</span>
                  )}
                </button>
              </div>
              
              <div className="join">
                <div className="join-item bg-base-300 flex items-center px-3 rounded-l-lg">
                  <Search className="h-4 w-4 text-base-content/50" />
                </div>
                <input
                  placeholder="Search stocks..."
                  className="input input-bordered join-item w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="join-item btn btn-square"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-0">
            {activeTab === 'all' && (
              <StockTable
                stocks={stocks}
                searchTerm={searchTerm}
                filterStatus="all"
                expandedStocks={expandedStocks}
                toggleStockExpansion={toggleStockExpansion}
              />
            )}

            {activeTab === 'low-stock' && (
              <StockTable
                stocks={stocks.filter(
                  (stock) => stock.availableQuantity > 0 && stock.availableQuantity <= stock.totalQuantity * 0.2,
                )}
                searchTerm={searchTerm}
                filterStatus="low-stock"
                expandedStocks={expandedStocks}
                toggleStockExpansion={toggleStockExpansion}
              />
            )}

            {activeTab === 'out-of-stock' && (
              <StockTable
                stocks={stocks.filter((stock) => stock.availableQuantity === 0)}
                searchTerm={searchTerm}
                filterStatus="out-of-stock"
                expandedStocks={expandedStocks}
                toggleStockExpansion={toggleStockExpansion}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Add Stock Dialog */}
      <AddStockDialog open={showAddStock} onClose={() => setShowAddStock(false)} />
    </div>
  )
}

function StockCard({ title, value, icon, color }) {
  return (
    <div className={`card bg-base-100 shadow overflow-hidden border-t-4 border-${color}`}>
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`font-medium text-${color}`}>{title}</h2>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`bg-${color}/10 p-3 rounded-xl`}>
            <div className={`text-${color}`}>{icon}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StockTable({
  stocks,
  searchTerm,
  filterStatus,
  expandedStocks,
  toggleStockExpansion,
}: {
  stocks: Stock[]
  searchTerm: string
  filterStatus: string
  expandedStocks: Record<string, boolean>
  toggleStockExpansion: (stockId: string) => void
}) {
  const { restockVariant, fetchStocks } = useStock()
  const [restockDialog, setRestockDialog] = useState({
    open: false,
    variantId: null as string | null,
    quantity: "",
  })
  const [sortConfig, setSortConfig] = useState({
    key: null as string | null,
    direction: "asc",
  })

  const requestSort = (key: string) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleCopy = (stockId: string) => {
    navigator.clipboard.writeText(stockId);
    // Use toast notification instead of alert
    alert("Stock ID copied to clipboard!");
  };

  const filteredStocks = stocks.filter((stock) => {
    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      if (
        !stock.title.toLowerCase().includes(searchTermLower) &&
        !stock.stock_id.toLowerCase().includes(searchTermLower) &&
        !stock.availableVariants.sizes.some((size) => size.toLowerCase().includes(searchTermLower)) &&
        !stock.availableVariants.colors.some((color) => color.toLowerCase().includes(searchTermLower))
      ) {
        return false
      }
    }
    return true
  })

  // Apply sorting
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const handleRestock = async () => {
    if (!restockDialog.variantId) return
    try {
      await restockVariant(restockDialog.variantId, Number.parseInt(restockDialog.quantity))
      setRestockDialog({ open: false, variantId: null, quantity: "" })
      await fetchStocks() // Refresh stock data
    } catch (err) {
      console.error("Failed to restock:", err)
    }
  }

  const getStockStatus = (stock: Stock) => {
    if (stock.availableQuantity === 0) return "Out of Stock"
    if (stock.availableQuantity <= stock.totalQuantity * 0.2) return "Low Stock"
    return "In Stock"
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead className="text-sm bg-base-200">
            <tr className="border-b border-base-300">
              <th className="w-12"></th>
              <th className="w-[100px]">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("stock_id")}>
                  ID
                  {sortConfig.key === "stock_id" ? (
                    <span className="ml-1 text-primary">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-3 w-3 text-base-content/30" />
                  )}
                </div>
              </th>
              <th>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                  Batch Title
                  {sortConfig.key === "title" ? (
                    <span className="ml-1 text-primary">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-3 w-3 text-base-content/30" />
                  )}
                </div>
              </th>
              <th>Variants</th>
              <th className="text-right">
                <div
                  className="flex items-center justify-end cursor-pointer"
                  onClick={() => requestSort("totalQuantity")}
                >
                  Total
                  {sortConfig.key === "totalQuantity" ? (
                    <span className="ml-1 text-primary">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-3 w-3 text-base-content/30" />
                  )}
                </div>
              </th>
              <th className="text-right">
                <div
                  className="flex items-center justify-end cursor-pointer"
                  onClick={() => requestSort("availableQuantity")}
                >
                  Available
                  {sortConfig.key === "availableQuantity" ? (
                    <span className="ml-1 text-primary">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  ) : (
                    <ArrowUpDown className="ml-1 h-3 w-3 text-base-content/30" />
                  )}
                </div>
              </th>
              <th className="text-right">Hold</th>
              <th className="text-right">Used</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.length === 0 ? (
              <tr>
                <td colSpan={10} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-base-content/50">
                    <div className="bg-base-200 p-6 rounded-full mb-4">
                      <Package2 className="h-10 w-10 opacity-40" />
                    </div>
                    <p className="font-medium text-lg">No stock items found</p>
                    {searchTerm && <p className="text-sm mt-2">Try adjusting your search criteria</p>}
                  </div>
                </td>
              </tr>
            ) : (
              sortedStocks.map((stock) => (
                <React.Fragment key={stock.stock_id}>
                  <tr
                    className={`hover cursor-pointer ${expandedStocks[stock.stock_id] ? "bg-base-200/70" : ""}`}
                    onClick={() => toggleStockExpansion(stock.stock_id)}
                  >
                    <td>
                      <div className={`btn btn-circle btn-sm ${expandedStocks[stock.stock_id] ? "btn-primary" : "btn-ghost"}`}>
                        {expandedStocks[stock.stock_id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </td>
                    <td className="font-mono text-xs">
                      <div className="tooltip tooltip-right" data-tip="Copy ID">
                        <span 
                          className="cursor-pointer hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(stock.stock_id);
                          }}
                        >
                          {stock.stock_id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{stock.title}</div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {stock.availableVariants.sizes.length > 0 && (
                          <span className="badge badge-neutral">{stock.availableVariants.sizes.length} sizes</span>
                        )}
                        {stock.availableVariants.colors.length > 0 && (
                          <span className="badge badge-neutral">{stock.availableVariants.colors.length} colors</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right font-medium">{stock.totalQuantity}</td>
                    <td className="text-right font-medium">
                      <span className="text-success">{stock.availableQuantity}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-warning">{stock.onHoldQuantity}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-error">{stock.exhaustedQuantity}</span>
                    </td>
                    <td className="sm:text-[12px] md:text-[14px] lg:text-[16px]">
                      <StockStatusBadge status={getStockStatus(stock)} />
                    </td>
                    <td className="text-sm">
                      {format(new Date(stock.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>

                  {/* Expanded Variants Table */}
                  {expandedStocks[stock.stock_id] && (
                    <tr>
                      <td colSpan={10} className="p-0 border-t-0">
                        <div className="bg-base-200 rounded-lg mx-4 my-2 overflow-hidden shadow-inner">
                          <div className="bg-primary/10 border-l-4 border-primary p-3 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                              <Package2 className="h-4 w-4" /> 
                              Variants in {stock.title}
                            </h3>
                            <div className="text-xs text-base-content/60">
                              {stock.StockVariants.length} variants
                            </div>
                          </div>
                          <div className="p-3">
                            <table className="table table-sm">
                              <thead className="text-xs">
                                <tr className="bg-base-300/50 border-b border-base-300">
                                  <th>Variant ID</th>
                                  <th>Size</th>
                                  <th>Color</th>
                                  <th className="text-right">Total</th>
                                  <th className="text-right">Available</th>
                                  <th className="text-right">On Hold</th>
                                  <th className="text-right">Used</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {stock.StockVariants.map((variant) => (
                                  <tr key={variant.variantId} className="hover">
                                    <td className="font-mono text-xs">
                                      {variant.variantId.substring(0, 8)}...
                                    </td>
                                    <td>
                                      <span className="badge badge-outline badge-sm font-normal">
                                        {variant.size}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2">
                                        <div className="tooltip" data-tip={variant.color}>
                                          <div
                                            className="h-4 w-4 rounded-md ring-1 ring-base-300"
                                            style={{
                                              backgroundColor: variant.color,
                                              border: variant.color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-right font-medium">{variant.totalQuantity}</td>
                                    <td className="text-right">
                                      <span className="text-success font-medium">{variant.availableQuantity}</span>
                                    </td>
                                    <td className="text-right">
                                      <span className="text-warning">{variant.onHoldQuantity}</span>
                                    </td>
                                    <td className="text-right">
                                      <span className="text-error">{variant.exhaustedQuantity}</span>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-primary btn-sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setRestockDialog({ open: true, variantId: variant.variantId, quantity: "" })
                                        }}
                                      >
                                        <PlusCircle className="h-3 w-3 mr-1" />
                                        Restock
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Restock Dialog */}
      <dialog id="restock_modal" className={`modal ${restockDialog.open ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
            <PlusCircle className="h-5 w-5" />
            Restock Variant
          </h3>
          <div className="divider mt-0"></div>
          <p className="py-2 text-base-content/70">Enter the quantity you want to add to the current inventory.</p>
          
          <div className="form-control w-full my-4">
            <label className="label">
              <span className="label-text">Quantity to Add</span>
            </label>
            <input
              type="number"
              className="input input-bordered input-primary w-full"
              value={restockDialog.quantity}
              onChange={(e) => setRestockDialog({ ...restockDialog, quantity: e.target.value })}
            />
          </div>
          
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={() => setRestockDialog({ open: false, variantId: null, quantity: "" })}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleRestock}
              disabled={!restockDialog.quantity || Number.parseInt(restockDialog.quantity) <= 0}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Restock
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setRestockDialog({ open: false, variantId: null, quantity: "" })}>close</button>
        </form>
      </dialog>
    </>
  )
}

function StockStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "In Stock":
      return (
        <div className="badge badge-success gap-1">
          <Check className="w-3 h-3" />
          {status}
        </div>
      );
    case "Low Stock":
      return (
        <div className="badge badge-warning gap-1">
          <Clock className="w-3 h-3" />
          {status}
        </div>
      );
    case "Out of Stock":
      return (
        <div className="badge badge-error gap-1">
          <AlertTriangle className="w-3 h-3" />
          {status}
        </div>
      );
    default:
      return <div className="badge badge-outline">{status}</div>;
  }
}