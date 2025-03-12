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
    <div className="card bg-base-100 shadow-xl p-6 border border-base-200">
      {error ? (
        <div className="alert alert-error text-error-content shadow-md">
          <span>{error}</span>
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-base-content/60 text-center">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr className="text-base-content/80">
                <th className="text-sm font-semibold">Company</th>
                <th className="text-sm font-semibold">Contact</th>
                <th className="text-sm font-semibold">Status</th>
                <th className="text-sm font-semibold">Plan</th>
                <th className="text-sm font-semibold">Next Billing</th>
                <th className="text-sm font-semibold">Business Type</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-base-200 transition-colors cursor-pointer text-base-content"
                >
                  <td>
                    <Link href={`/admin/vendors/${vendor.id}`} className="block">
                      <div className="font-semibold text-base-content">{vendor.company_name}</div>
                      <div className="text-sm text-base-content/70">
                        {vendor.registered_number || "N/A"}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div className="text-base-content">{vendor.contact_name}</div>
                    <div className="text-sm">
                      <a
                        href={`mailto:${vendor.contact_email}`}
                        className="link link-hover text-primary hover:text-primary-focus"
                      >
                        {vendor.contact_email}
                      </a>
                    </div>
                    <div className="text-sm text-base-content/70">{vendor.contact_phone_number}</div>
                  </td>
                  <td>
                    <Link href={`/admin/vendors/${vendor.id}`} className="block">
                      <span
                        className={`badge ${
                          vendor.status === "active"
                            ? "bg-success text-success-content"
                            : "bg-error text-error-content"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/admin/vendors/${vendor.id}`} className="block">
                      <span className="text-base-content">{vendor.plan}</span>
                    </Link>
                  </td>
                  <td className="text-base-content">
                    {new Date(vendor.next_billing_date).toLocaleDateString()}
                  </td>
                  <td className="text-base-content">{vendor.business_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}