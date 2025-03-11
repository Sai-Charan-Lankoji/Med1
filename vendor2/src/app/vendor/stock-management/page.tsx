"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger,TooltipProvider } from "@radix-ui/react-tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStock } from "@/app/hooks/useStock"
import { AddStockDialog } from "./add-stock-dialog"
import { format } from "date-fns"

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
    await fetchStocks()
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Stock Data</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Stock Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track your inventory levels</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAddStock} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
          color="bg-blue-50 text-blue-700"
        />
        <StockCard
          title="Available"
          value={overallTotals.availableQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-green-50 text-green-700"
        />
        <StockCard
          title="On Hold"
          value={overallTotals.onHoldQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-amber-50 text-amber-700"
        />
        <StockCard
          title="Exhausted"
          value={overallTotals.exhaustedQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-red-50 text-red-700"
        />
      </motion.div>

      {/* Stock Table with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-xs border"
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Stock
              </TabsTrigger>
              <TabsTrigger
                value="low-stock"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                Low Stock
                {lowStockCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-amber-200 text-amber-800">
                    {lowStockCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="out-of-stock"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Out of Stock
                {outOfStockCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-red-200 text-red-800">
                    {outOfStockCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <StockTable
              stocks={stocks}
              searchTerm={searchTerm}
              filterStatus="all"
              expandedStocks={expandedStocks}
              toggleStockExpansion={toggleStockExpansion}
            />
          </TabsContent>

          <TabsContent value="low-stock" className="m-0">
            <StockTable
              stocks={stocks.filter(
                (stock) => stock.availableQuantity > 0 && stock.availableQuantity <= stock.totalQuantity * 0.2,
              )}
              searchTerm={searchTerm}
              filterStatus="low-stock"
              expandedStocks={expandedStocks}
              toggleStockExpansion={toggleStockExpansion}
            />
          </TabsContent>

          <TabsContent value="out-of-stock" className="m-0">
            <StockTable
              stocks={stocks.filter((stock) => stock.availableQuantity === 0)}
              searchTerm={searchTerm}
              filterStatus="out-of-stock"
              expandedStocks={expandedStocks}
              toggleStockExpansion={toggleStockExpansion}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add Stock Dialog */}
      <AddStockDialog open={showAddStock} onClose={() => setShowAddStock(false)} />
    </div>
  )
}

function StockCard({ title, value, icon, color }) {
  return (
    <Card className="border shadow-xs">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
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
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("stock_id")}>
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                  Batch Title
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Variants</TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center justify-end cursor-pointer"
                  onClick={() => requestSort("totalQuantity")}
                >
                  Total
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center justify-end cursor-pointer"
                  onClick={() => requestSort("availableQuantity")}
                >
                  Available
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-right">On Hold</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer">
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package2 className="h-8 w-8 mb-2 opacity-40" />
                    <p>No stock items found</p>
                    {searchTerm && <p className="text-sm mt-1">Try adjusting your search</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedStocks.map((stock) => (
                <>
                  <TableRow
                    key={stock.stock_id}
                    className={`cursor-pointer hover:bg-muted/50 ${expandedStocks[stock.stock_id] ? "bg-muted/30" : ""}`}
                    onClick={() => toggleStockExpansion(stock.stock_id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        {expandedStocks[stock.stock_id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                          <span onClick={() => handleCopy(stock.stock_id)}>{stock.stock_id.substring(0, 8)}...</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Copy</span>
                        </TooltipContent>
                      </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-medium">{stock.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {stock.availableVariants.sizes.map((size, i) => (
                          <Badge key={`size-${i}`} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                        {stock.availableVariants.colors.map((color, i) => (
                          <Badge key={`color-${i}`} variant="outline" className="text-xs">
                            <div
                              className="h-2 w-2 rounded-full mr-1 inline-block"
                              style={{
                                backgroundColor: color, 
                                border: color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                              }}
                            />
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{stock.totalQuantity}</TableCell>
                    <TableCell className="text-right font-medium">{stock.availableQuantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{stock.onHoldQuantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{stock.exhaustedQuantity}</TableCell>
                    <TableCell>
                      <StockStatusBadge status={getStockStatus(stock)} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(stock.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Variants Table */}
                  {expandedStocks[stock.stock_id] && (
                    <TableRow>
                      <TableCell colSpan={10} className="p-0 border-t-0">
                        <div className="bg-muted/10 p-4 rounded-b-lg">
                          <h4 className="text-sm font-medium mb-2">Variants in {stock.title}</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Variant ID</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                                <TableHead className="text-right">On Hold</TableHead>
                                <TableHead className="text-right">Used</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stock.StockVariants.map((variant) => (
                                <TableRow key={variant.variantId}>
                                  <TableCell className="font-mono text-xs">
                                    {variant.variantId.substring(0, 8)}...
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                      {variant.size}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                          backgroundColor: variant.color, // Directly use the color name
                                          border: variant.color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                                        }}
                                      />
                                      <span className="text-sm capitalize">{variant.color}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-medium">{variant.totalQuantity}</TableCell>
                                  <TableCell className="text-right font-medium">{variant.availableQuantity}</TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    {variant.onHoldQuantity}
                                  </TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    {variant.exhaustedQuantity}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setRestockDialog({ open: true, variantId: variant.variantId, quantity: "" })
                                      }}
                                      className="text-xs h-8"
                                    >
                                      Restock
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={restockDialog.open}
        onOpenChange={() => setRestockDialog({ open: false, variantId: null, quantity: "" })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock Variant</DialogTitle>
            <DialogDescription>Enter the quantity you want to add to the current stock.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Add</Label>
              <Input
                id="quantity"
                type="number"
                value={restockDialog.quantity}
                onChange={(e) => setRestockDialog({ ...restockDialog, quantity: e.target.value })}
                className="border-slate-300"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setRestockDialog({ open: false, variantId: null, quantity: "" })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestock}
                className="bg-primary hover:bg-primary/90"
                disabled={!restockDialog.quantity || Number.parseInt(restockDialog.quantity) <= 0}
              >
                Restock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StockStatusBadge({ status }: { status: string }) {
  let badgeClass = ""

  switch (status) {
    case "In Stock":
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-200"
      break
    case "Low Stock":
      badgeClass = "bg-amber-100 text-amber-800 hover:bg-amber-200"
      break
    case "Out of Stock":
      badgeClass = "bg-red-100 text-red-800 hover:bg-red-200"
      break
    default:
      badgeClass = "bg-slate-100 text-slate-800 hover:bg-slate-200"
  }

  return (
    <Badge variant="outline" className={badgeClass}>
      {status}
    </Badge>
  )
}

