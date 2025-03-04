"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package2, RefreshCcw, PlusCircle, Search, History, ArrowUpDown, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStock } from "@/app/hooks/useStock"
import { AddStockDialog } from "./add-stock-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Variant {
  id: string
  productId: string | null
  name: string
  size: string
  color: string
  totalQuantity: number
  availableQuantity: number
  onHoldQuantity: number
  exhaustedQuantity: number
  status: string
}

export default function StockManagement() {
  const { stocks, loading, error, fetchStocks } = useStock()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddStock, setShowAddStock] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStocks()
    setIsRefreshing(false)
  }

  const handleAddStock = () => {
    setShowAddStock(true)
  }

  const standardVariants = stocks.flatMap((stock) =>
    (stock.StockVariants || []).map((variant) => ({
      id: variant.variantId,
      productId: stock.productId,
      name: "Unknown", // Replace with product title if joined in backend
      size: variant.size,
      color: variant.color || "N/A",
      totalQuantity: variant.totalQuantity,
      availableQuantity: variant.availableQuantity,
      onHoldQuantity: variant.onHoldQuantity,
      exhaustedQuantity: variant.exhaustedQuantity,
      status:
        variant.availableQuantity === 0 ? "Out of Stock" : variant.availableQuantity <= 10 ? "Low Stock" : "In Stock",
    })),
  )

  const lowStockCount = standardVariants.filter((v) => v.status === "Low Stock").length
  const outOfStockCount = standardVariants.filter((v) => v.status === "Out of Stock").length

  const totals = {
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
          value={totals.totalQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-blue-50 text-blue-700"
        />
        <StockCard
          title="Available"
          value={totals.availableQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-green-50 text-green-700"
        />
        <StockCard
          title="On Hold"
          value={totals.onHoldQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-amber-50 text-amber-700"
        />
        <StockCard
          title="Exhausted"
          value={totals.exhaustedQuantity}
          icon={<Package2 className="h-5 w-5" />}
          color="bg-red-50 text-red-700"
        />
      </motion.div>

      {/* Stock Table with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
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
            <StockTable data={standardVariants} searchTerm={searchTerm} filterStatus="all" />
          </TabsContent>

          <TabsContent value="low-stock" className="m-0">
            <StockTable data={standardVariants} searchTerm={searchTerm} filterStatus="low-stock" />
          </TabsContent>

          <TabsContent value="out-of-stock" className="m-0">
            <StockTable data={standardVariants} searchTerm={searchTerm} filterStatus="out-of-stock" />
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
    <Card className="border shadow-sm">
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
  data,
  searchTerm,
  filterStatus,
}: {
  data: Variant[]
  searchTerm: string
  filterStatus: string
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

  const filteredData = data.filter((item) => {
    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      if (
        !item.name.toLowerCase().includes(searchTermLower) &&
        !item.size.toLowerCase().includes(searchTermLower) &&
        !item.color.toLowerCase().includes(searchTermLower)
      ) {
        return false
      }
    }

    // Status filter
    if (filterStatus !== "all") {
      const status = item.status.toLowerCase().replace(" ", "-")
      return status === filterStatus
    }

    return true
  })

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
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

  return (
    <>
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("size")}>
                  Size/Color
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
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
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("status")}>
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package2 className="h-8 w-8 mb-2 opacity-40" />
                    <p>No stock items found</p>
                    {searchTerm && <p className="text-sm mt-1">Try adjusting your search</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {item.productId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        {item.size}
                      </Badge>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            item.color === "black"
                              ? "black"
                              : item.color === "white"
                                ? "white"
                                : item.color === "navy"
                                  ? "navy"
                                  : item.color === "gray"
                                    ? "gray"
                                    : "#ddd",
                          border: item.color === "white" ? "1px solid #ddd" : "none",
                        }}
                      />
                      <span className="text-sm capitalize">{item.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{item.totalQuantity}</TableCell>
                  <TableCell className="text-right font-medium">{item.availableQuantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.onHoldQuantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.exhaustedQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "In Stock"
                          ? "default"
                          : item.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : item.status === "Low Stock"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <History className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View History</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestockDialog({ open: true, variantId: item.id, quantity: "" })}
                        className="text-xs h-8"
                      >
                        Restock
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
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

