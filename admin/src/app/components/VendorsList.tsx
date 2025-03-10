// components/VendorsList.tsx
import Link from "next/link";

type Vendor = {
  id: string;
  company_name: string;
  contact_name: string;
  registered_number: string;
  status: string;
  contact_email: string;
  contact_phone_number: string;
  tax_number: string;
  plan: string;
  plan_id: string;
  next_billing_date: string;
  business_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    vendor_address_id: string;
  }[];
};

export default function VendorsList({ vendors, error }: { vendors: Vendor[]; error: string | null }) {
  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-base-content">Vendors</h1>
      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-base-content">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Next Billing</th>
                <th>Business Type</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-base-200 transition-colors cursor-pointer">
                  <td>
                    <Link href={`/admin/vendors/${vendor.id}`} className="block">
                      <div className="font-semibold">{vendor.company_name}</div>
                      <div className="text-sm text-gray-500">{vendor.registered_number || "N/A"}</div>
                    </Link>
                  </td>
                  <td>
                    <div>{vendor.contact_name}</div>
                    <div className="text-sm">
                      <a href={`mailto:${vendor.contact_email}`} className="link link-hover">
                        {vendor.contact_email}
                      </a>
                    </div>
                    <div className="text-sm">{vendor.contact_phone_number}</div>
                  </td>
                  <td>
                  <Link href={`/admin/vendors/${vendor.id}`} className="block">

                    <span
                      className={`badge ${
                        vendor.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {vendor.status}
                    </span>
                    </Link>
                  </td>
                  <td>
                  <Link href={`/admin/vendors/${vendor.id}`} className="block">

                    {vendor.plan}
                    </Link>
                    </td>
                    
                  <td>{new Date(vendor.next_billing_date).toLocaleDateString()}</td>
                  <td>{vendor.business_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}