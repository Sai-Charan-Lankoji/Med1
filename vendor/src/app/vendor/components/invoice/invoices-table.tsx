import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const invoices = [
  {
    id: "INV001",
    amount: 1000,
    status: "Pending",
    date: "2023-06-01",
  },
  {
    id: "INV002",
    amount: 1500,
    status: "Paid",
    date: "2023-05-15",
  },
  {
    id: "INV003",
    amount: 800,
    status: "Pending",
    date: "2023-06-10",
  },
  {
    id: "INV004",
    amount: 2000,
    status: "Paid",
    date: "2023-05-01",
  },
]

export function InvoicesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

