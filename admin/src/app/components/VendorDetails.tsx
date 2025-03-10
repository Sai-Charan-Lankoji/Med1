// components/VendorDetails.tsx
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

type Store = {
  id: string;
  name: string;
  default_currency_code: string;
  swap_link_template: string;
  payment_link_template: string;
  invite_link_template: string;
  store_type: string;
  publishableapikey: string;
  store_url: string;
  vendor_id: string;
  default_sales_channel_id: string;
  default_location_id: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function VendorDetails({
  stores,
  error,
  vendorId,
}: {
  stores: Store[];
  error: string | null;
  vendorId: string;
}) {
  return (
    <div className="min-h-screen bg-base-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8 animate-slide-in-left">
        <h1 className="text-3xl font-bold text-base-content">
          Vendor Stores ({vendorId})
        </h1>
        <div className="transform transition-all duration-300 hover:scale-105">
          <BackButton />
        </div>
      </div>

      {error ? (
        <div className="alert alert-error animate-shake">
          <span>{error}</span>
        </div>
      ) : stores.length === 0 ? (
        <p className="text-base-content text-lg animate-fade-in">
          No stores found for this vendor.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-in-up">
          {stores.map((store) => (
            <div
              key={store.id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
            >
              <div className="card-body">
                <h2 className="card-title text-base-content text-xl">
                  {store.name}
                  <span className="badge badge-primary ml-2">{store.store_type}</span>
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>Currency:</strong>{" "}
                    <span className="badge badge-outline uppercase">
                      {store.default_currency_code}
                    </span>
                  </p>
                  <p>
                    <strong>Store URL:</strong>{" "}
                    <Link href={store.store_url} className="link link-hover text-primary" target="_blank">
                      {store.store_url}
                    </Link>
                  </p>
                  <p>
                    <strong>API Key:</strong>{" "}
                    <code className="text-sm bg-base-300 p-1 rounded">{store.publishableapikey}</code>
                  </p>
                  <p>
                    <strong>Sales Channel:</strong>{" "}
                    <span className="text-sm">{store.default_sales_channel_id}</span>
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(store.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Updated:</strong>{" "}
                    {new Date(store.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-outline btn-info hover:scale-105 transition-all duration-300">
                    Edit Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}