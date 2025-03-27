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
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th>Invoice ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-base-200">
              <td className="font-medium">{invoice.id}</td>
              <td>${invoice.amount.toFixed(2)}</td>
              <td>
                <span className={`badge ${
                  invoice.status === "Paid" 
                    ? "badge-success badge-outline" 
                    : "badge-warning badge-outline"
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="text-base-content/70">{invoice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}