"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package2, Palette, RefreshCcw, PlusCircle, Search, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
//import { Toast } from "@/components/ui/toast"
import { AddStockDialog } from "./add-stock-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Dummy data for demonstration
const stockAnalytics = {
  standard: {
    total: 1500,
    available: 1200,
    onHold: 300,
    lowStock: 5,
    recentActivity: [
      { date: "2024-01", stock: 1200 },
      { date: "2024-02", stock: 1350 },
      { date: "2024-03", stock: 1500 },
    ],
  },
  designable: {
    total: 2500,
    available: 2000,
    onHold: 500,
    lowStock: 3,
    recentActivity: [
      { date: "2024-01", stock: 2000 },
      { date: "2024-02", stock: 2300 },
      { date: "2024-03", stock: 2500 },
    ],
  },
}

const dummyStandardProducts = [
  {
    id: "STK001",
    productId: "P001",
    name: "Classic T-Shirt",
    size: "M",
    color: "Black",
    totalQuantity: 100,
    availableQuantity: 80,
    onHold: 20,
    status: "In Stock",
  },
  {
    id: "STK002",
    productId: "P002",
    name: "Premium Polo",
    size: "L",
    color: "Navy",
    totalQuantity: 75,
    availableQuantity: 60,
    onHold: 15,
    status: "In Stock",
  },
  {
    id: "STK003",
    productId: "P003",
    name: "Sport Shorts",
    size: "S",
    color: "Gray",
    totalQuantity: 25,
    availableQuantity: 5,
    onHold: 20,
    status: "Low Stock",
  },
  {
    id: "STK004",
    productId: "P004",
    name: "Casual Hoodie",
    size: "XL",
    color: "Black",
    totalQuantity: 0,
    availableQuantity: 0,
    onHold: 0,
    status: "Out of Stock",
  },
]

const dummyDesignableProducts = [
  {
    id: "STK101",
    productId: "D001",
    apparelType: "Custom T-Shirt",
    material: "Cotton",
    color: "White",
    totalQuantity: 500,
    availableQuantity: 400,
    onHold: 100,
    status: "In Stock",
  },
  {
    id: "STK102",
    productId: "D002",
    apparelType: "Custom Hoodie",
    material: "Cotton Blend",
    color: "Black",
    totalQuantity: 300,
    availableQuantity: 50,
    onHold: 250,
    status: "Low Stock",
  },
  {
    id: "STK103",
    productId: "D003",
    apparelType: "Custom Tank Top",
    material: "Polyester",
    color: "Navy",
    totalQuantity: 200,
    availableQuantity: 180,
    onHold: 20,
    status: "In Stock",
  },
  {
    id: "STK104",
    productId: "D004",
    apparelType: "Custom Sweatshirt",
    material: "Cotton Blend",
    color: "Gray",
    totalQuantity: 0,
    availableQuantity: 0,
    onHold: 0,
    status: "Out of Stock",
  },
]

export default function StockManagement() {
 // const { toast } = toast()
  const [activeTab, setActiveTab] = useState("standard")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddStock, setShowAddStock] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    // toast({
    //   title: "Refreshed",
    //   description: "Stock data has been updated",
    // })
  }

  const handleAddStock = () => {
    setShowAddStock(true)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-indigo-700">Stock Management</h1>
          <p className="text-purple-600 mt-2">Manage and track your inventory levels</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleAddStock} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="relative">
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Standard Products Analytics */}
        <Card className="bg-white shadow-lg border-2 border-indigo-100">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Standard Products Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="text-2xl font-bold text-indigo-600">{stockAnalytics.standard.total}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{stockAnalytics.standard.available}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">On Hold</p>
                <p className="text-2xl font-bold text-orange-600">{stockAnalytics.standard.onHold}</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockAnalytics.standard.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="stock" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Designable Products Analytics */}
        <Card className="bg-white shadow-lg border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Designable Products Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="text-2xl font-bold text-purple-600">{stockAnalytics.designable.total}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{stockAnalytics.designable.available}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">On Hold</p>
                <p className="text-2xl font-bold text-orange-600">{stockAnalytics.designable.onHold}</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockAnalytics.designable.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock Management Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="standard">Standard Products</TabsTrigger>
            <TabsTrigger value="designable">Designable Products</TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <StockTable
              type="standard"
              data={dummyStandardProducts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </TabsContent>

          <TabsContent value="designable">
            <StockTable
              type="designable"
              data={dummyDesignableProducts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add Stock Dialog */}
      <AddStockDialog open={showAddStock} onClose={() => setShowAddStock(false)} />
    </div>
  )
}

function StockTable({ type, data, searchTerm, setSearchTerm }) {
  const [filterStatus, setFilterStatus] = useState("all")
  const filteredData = data.filter((item) => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      const name = type === "standard" ? item.name : item.apparelType
      if (!name.toLowerCase().includes(searchTermLower)) {
        return false
      }
    }

    if (filterStatus !== "all") {
      const status = item.status.toLowerCase().replace(" ", "-")
      return status === filterStatus
    }

    return true
  })

  return (
    <Card className="bg-white shadow-lg border-2 border-indigo-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>{type === "standard" ? "Name" : "Apparel Type"}</TableHead>
                <TableHead>{type === "standard" ? "Size/Color" : "Material/Color"}</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>On Hold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell>{type === "standard" ? item.name : item.apparelType}</TableCell>
                  <TableCell>
                    {type === "standard" ? `${item.size} / ${item.color}` : `${item.material} / ${item.color}`}
                  </TableCell>
                  <TableCell>{item.totalQuantity}</TableCell>
                  <TableCell>{item.availableQuantity}</TableCell>
                  <TableCell>{item.onHold}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "secondary" : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

