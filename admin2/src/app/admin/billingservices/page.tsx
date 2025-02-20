"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Calendar,
  CreditCard,
  TrendingUp,
  Search,
  Loader2,
  AlertCircle,
  Percent,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateDiscount from "@/app/hooks/discounts/useCreateDiscount";

interface BillingRecord {
  id: string;
  vendor_name: string;
  current_bill: number;
  paid_amount: number;
  due_date: string;
  status: "paid" | "pending" | "overdue";
  projected_bill: number;
}

// This would come from your actual API
const mockBillingData: BillingRecord[] = [
  {
    id: "1",
    vendor_name: "Tech Solutions Inc",
    current_bill: 299.99,
    paid_amount: 299.99,
    due_date: "2024-02-15",
    status: "paid",
    projected_bill: 325.5,
  },
  {
    id: "2",
    vendor_name: "Digital Services Co",
    current_bill: 499.99,
    paid_amount: 0,
    due_date: "2024-02-28",
    status: "pending",
    projected_bill: 550.0,
  },
  {
    id: "3",
    vendor_name: "Cloud Systems Ltd",
    current_bill: 199.99,
    paid_amount: 0,
    due_date: "2024-01-31",
    status: "overdue",
    projected_bill: 199.99,
  },
];

const BillingServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("february");
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [isDiscountLoading, setIsDiscountLoading] = useState(false);
  const [discountFetchError, setDiscountFetchError] = useState(null);
  const {
    createDiscount,
    loading: discountLoading,
    error: discountError,
  } = useCreateDiscount();

  const isLoading = false;
  const error = null;
  const data = mockBillingData;

  // Fetch discount details when dialog opens
  useEffect(() => {
    if (isDiscountDialogOpen) {
      const fetchDiscount = async () => {
        setIsDiscountLoading(true);
        setDiscountFetchError(null);
        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/discount",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Add any required auth headers if needed
              },
            }
          );

          const data = await response.json();
          setDiscountData(data);
        } catch (err: any) {
          setDiscountFetchError(err.message);
          setDiscountData(null);
        } finally {
          setIsDiscountLoading(false);
        }
      };

      fetchDiscount();
    }
  }, [isDiscountDialogOpen]);

  const filteredBilling =
    data?.filter((record) =>
      record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalCurrentBills = filteredBilling.reduce(
    (sum, record) => sum + record.current_bill,
    0
  );
  const totalPaidAmount = filteredBilling.reduce(
    (sum, record) => sum + record.paid_amount,
    0
  );
  const totalProjected = filteredBilling.reduce(
    (sum, record) => sum + record.projected_bill,
    0
  );
  const pendingPayments = filteredBilling.filter(
    (record) => record.status === "pending" || record.status === "overdue"
  ).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading billing data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">
          Error fetching billing data
        </p>
      </div>
    );
  }

  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    const formData = {
      base_discount_threshold:
        parseFloat(e.target.baseDiscountThreshold.value) || 0,
      high_discount_threshold:
        parseFloat(e.target.highDiscountThreshold.value) || 0,
      base_discount_rate: parseFloat(e.target.baseDiscountRate.value) || 0,
      high_discount_rate: parseFloat(e.target.highDiscountRate.value) || 0,
    };

    await createDiscount(formData);
    if (!discountError) {
      setIsDiscountDialogOpen(false);
      // Optionally refetch discount data after save
      const response = await fetch("http://localhost:5000/api/admin/discount");
      const updatedData = await response.json();
      setDiscountData(updatedData);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="text-3xl font-bold">Billing Services</CardTitle>
          <CardDescription>
            Track and manage vendor billing and payments
          </CardDescription>
          <button
            onClick={() => setIsDiscountDialogOpen(true)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <Percent className="h-6 w-6" />
          </button>
        </CardHeader>
        <CardContent>
          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <DollarSign className="h-6 w-6 text-blue-700 dark:text-blue-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Bills
                    </p>
                    <h3 className="text-2xl font-bold">
                      ${totalCurrentBills.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <CreditCard className="h-6 w-6 text-green-700 dark:text-green-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Paid
                    </p>
                    <h3 className="text-2xl font-bold">
                      ${totalPaidAmount.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Projected Next Month
                    </p>
                    <h3 className="text-2xl font-bold">
                      ${totalProjected.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <Calendar className="h-6 w-6 text-orange-700 dark:text-orange-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Payments
                    </p>
                    <h3 className="text-2xl font-bold">{pendingPayments}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search vendors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Billing Table */}
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Current Bill</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projected Next Bill</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBilling.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {record.vendor_name}
                    </TableCell>
                    <TableCell>${record.current_bill.toFixed(2)}</TableCell>
                    <TableCell>${record.paid_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(record.due_date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>${record.projected_bill.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Discount Dialog */}
      {isDiscountDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {discountData ? "Edit Discount" : "Create Discount"}
            </h2>

            {isDiscountLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : discountFetchError ? (
              <p className="text-red-500 text-sm mb-4">
                Error: {discountFetchError}
              </p>
            ) : (
              <form onSubmit={handleSaveDiscount}>
                {discountError && (
                  <p className="text-red-500 text-sm mb-4">{discountError}</p>
                )}
                <div className="mb-4">
                  <label
                    htmlFor="baseDiscountThreshold"
                    className="block text-sm font-medium"
                  >
                    Base Discount Threshold
                  </label>
                  <input
                    type="number"
                    id="baseDiscountThreshold"
                    name="baseDiscountThreshold"
                    defaultValue={discountData?.base_discount_threshold || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="highDiscountThreshold"
                    className="block text-sm font-medium"
                  >
                    High Discount Threshold
                  </label>
                  <input
                    type="number"
                    id="highDiscountThreshold"
                    name="highDiscountThreshold"
                    defaultValue={discountData?.high_discount_threshold || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="baseDiscountRate"
                    className="block text-sm font-medium"
                  >
                    Base Discount Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="baseDiscountRate"
                    name="baseDiscountRate"
                    defaultValue={discountData?.base_discount_rate || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="highDiscountRate"
                    className="block text-sm font-medium"
                  >
                    High Discount Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="highDiscountRate"
                    name="highDiscountRate"
                    defaultValue={discountData?.high_discount_rate || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsDiscountDialogOpen(false)}
                    className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={discountLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {discountLoading
                      ? "Saving..."
                      : discountData
                      ? "Update"
                      : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function StatusBadge({ status }: { status: BillingRecord["status"] }) {
  const variants = {
    paid: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800",
    pending:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800",
    overdue:
      "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800",
  };

  const statusText = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
  };

  return (
    <Badge variant="outline" className={`font-semibold ${variants[status]}`}>
      {statusText[status]}
    </Badge>
  );
}

export default BillingServicesPage;
