"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import withAuth from "@/lib/withAuth";
import { BackButton } from "../../../utils/backButton";

const StoreDetails = () => {
  const { data: stores } = useGetStores();
  const [formData, setFormData] = useState({
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();

  return (
    <div>
      <BackButton name="Settings" />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="p-2 mb-4">
          <h1 className="text-2xl font-semibold">Store Details</h1>
          <p className="text-sm text-gray-500 font-semibold">
            Manage your business details
          </p>
        </div>
        <hr className="border border-gray-200 mb-4" />
        <form>
          {stores?.map((store) => (
            <React.Fragment key={store.id}>
              <div className="my-4">
                <h2 className="text-gray-700 font-semibold">General</h2>
                <div className="form-control">
                  <label htmlFor="siteName" className="label">
                    <span className="label-text text-xs text-gray-500 font-semibold">
                      Store Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName || store.name}
                    onChange={handleChange}
                    placeholder="Medusa Store"
                    className="input input-bordered w-full bg-gray-50 hover:border-violet-600 focus:border-violet-600"
                    id="siteName"
                  />
                </div>
              </div>

              <div className="my-4">
                <h2 className="text-gray-700 font-semibold">Advanced settings</h2>
                <div className="form-control">
                  <label htmlFor="swapLinkTemplate" className="label">
                    <span className="label-text text-xs text-gray-500 font-semibold">
                      Swap link template
                    </span>
                  </label>
                  <input
                    type="text"
                    name="swapLinkTemplate"
                    value={formData.swapLinkTemplate || store.swap_link_template}
                    onChange={handleChange}
                    placeholder="https://acme.inc/swap={swap_id}"
                    className="input input-bordered w-full bg-gray-50 hover:border-violet-600 focus:border-violet-600"
                    id="swapLinkTemplate"
                  />
                </div>

                <div className="form-control mt-4">
                  <label htmlFor="paymentLinkTemplate" className="label">
                    <span className="label-text text-xs text-gray-500 font-semibold">
                      Draft order link template
                    </span>
                  </label>
                  <input
                    type="text"
                    name="paymentLinkTemplate"
                    value={formData.paymentLinkTemplate || store.payment_link_template}
                    onChange={handleChange}
                    placeholder="https://acme.inc/payment={payment_id}"
                    className="input input-bordered w-full bg-gray-50 hover:border-violet-600 focus:border-violet-600"
                    id="paymentLinkTemplate"
                  />
                </div>

                <div className="form-control mt-4">
                  <label htmlFor="inviteLinkTemplate" className="label">
                    <span className="label-text text-xs text-gray-500 font-semibold">
                      Invite link template
                    </span>
                  </label>
                  <input
                    type="text"
                    name="inviteLinkTemplate"
                    value={formData.inviteLinkTemplate || store.invite_link_template}
                    onChange={handleChange}
                    placeholder="https://acme.inc/invite={invite_token}"
                    className="input input-bordered w-full bg-gray-50 hover:border-violet-600 focus:border-violet-600"
                    id="inviteLinkTemplate"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </form>
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            onClick={() => router.push("/vendor/settings")}
            className="btn btn-secondary px-6 py-2 text-sm font-semibold text-black border border-gray-300"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary px-6 py-2 bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(StoreDetails);