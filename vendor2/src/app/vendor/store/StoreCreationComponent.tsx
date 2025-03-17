"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateStore } from "@/app/hooks/store/useCreateStore";
import { useCreateSalesChannel } from "@/app/hooks/saleschannel/useCreateSalesChannel";
import { useCreatePublishableApiKey } from "@/app/hooks/publishableapikey/useCreatepublishablekey";
import { useToast } from "@/hooks/use-toast";
import { useGetPlan } from "@/app/hooks/plan/useGetPlan";
import { plan_id, vendor_id } from "@/app/utils/constant"; // Import vendor_id

const getStoreLimitFromPlan = (plan) => {
  if (!plan || !Array.isArray(plan.features)) return 0;
  const limitFeature = plan.features.find((feature) =>
    feature.toLowerCase().includes("store")
  );
  if (!limitFeature) return 0;

  if (limitFeature.toLowerCase().includes("unlimited")) {
    return Infinity;
  }

  const match = limitFeature.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const StoreCreationComponent = ({ onStoreCreated, storesData }) => {
  const { toast } = useToast();
  const { data: currentPlan } = useGetPlan(plan_id);
  const { createStore } = useCreateStore();
  const { createSalesChannel } = useCreateSalesChannel();
  const { createPublishableApiKey } = useCreatePublishableApiKey();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    storeName: "",
    store_type: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
    vendor_id: vendor_id ?? "", // Initialize vendor_id from constant
    salesChannelId: "",
    publishableapikey: "",
  });
  const [isSalesChannelCreated, setIsSalesChannelCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");

  const canCreateStore = () => {
    if (!currentPlan) return false;
    const storeLimit = currentPlan?.no_stores || 0;
    return (
      storeLimit === "unlimited" || storesData.length < parseInt(storeLimit, 10)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSalesChannelCreated && !canCreateStore()) {
      toast({
        title: "Limit Reached",
        description: "You've reached your store limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!isSalesChannelCreated) {
        setLoadingStage("Creating sales channel...");
        const response = await createSalesChannel({
          name: formData.title,
          description: formData.description,
          vendor_id: formData.vendor_id, // Pass vendor_id explicitly
        });
        toast({ title: "Success", description: "Sales Channel Created" });
        setFormData((prev) => ({ ...prev, salesChannelId: response.id }));
        const apiKeyResponse = await createPublishableApiKey({
          title: response.name,
          created_by: response.vendor_id, // Assuming response includes vendor_id
        });
        toast({ title: "Success", description: "API Key Created" });
        setFormData((prev) => ({ ...prev, publishableapikey: apiKeyResponse.id }));
        setIsSalesChannelCreated(true);
      } else {
        setLoadingStage("Creating store...");
        const domainResponse = await fetch(
          "http://localhost:5000/api/stores/add-domain",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeName: formData.storeName }),
          }
        );

        if (!domainResponse.ok) {
          const errorData = await domainResponse.json();
          throw new Error(errorData.message || "Error creating domain");
        }

        const domainData = await domainResponse.json();
        const domain = domainData.domain ? `https://${domainData.domain}` : "";

        const storeData = {
          name: formData.storeName,
          store_url: domain,
          default_sales_channel_id: formData.salesChannelId,
          swap_link_template: formData.swapLinkTemplate,
          payment_link_template: formData.paymentLinkTemplate,
          invite_link_template: formData.inviteLinkTemplate,
          vendor_id: formData.vendor_id, // Ensure vendor_id is included
          store_type: formData.store_type,
          publishableapikey: formData.publishableapikey,
        };

        await createStore(storeData);
        toast({ title: "Success", description: "Store Created" });
        setIsModalOpen(false);
        setIsSalesChannelCreated(false);
        setFormData({
          title: "",
          description: "",
          storeName: "",
          store_type: "",
          swapLinkTemplate: "",
          paymentLinkTemplate: "",
          inviteLinkTemplate: "",
          vendor_id: vendor_id ?? "", // Reset vendor_id to constant
          salesChannelId: "",
          publishableapikey: "",
        });
        onStoreCreated();
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast({
        title: "Error",
        description: (error as any).message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <>
      <button
        className="btn btn-primary mb-4"
        onClick={() => {
          if (!canCreateStore()) {
            toast({
              title: "Limit Reached",
              description: "Upgrade your plan to create more stores.",
              variant: "destructive",
            });
            return;
          }
          setIsModalOpen(true);
        }}
      >
        <Plus className="mr-2 h-4 w-4" /> New Store
      </button>

      <input
        type="checkbox"
        id="create-modal"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-primary">
            {isSalesChannelCreated ? "Create Store" : "Create Sales Channel"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {!isSalesChannelCreated ? (
              <>
                <div className="form-control">
                  <label htmlFor="title" className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="description" className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-control">
                  <label htmlFor="storeName" className="label">
                    <span className="label-text">Store Name</span>
                  </label>
                  <input
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="store_type" className="label">
                    <span className="label-text">Store Type</span>
                  </label>
                  <select
                    name="store_type"
                    value={formData.store_type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select store type
                    </option>
                    <option value="design_ui">Design UI store</option>
                    <option value="grocery">Pick And Buy Grocery store</option>
                  </select>
                </div>
                <div className="form-control">
                  <label htmlFor="swapLinkTemplate" className="label">
                    <span className="label-text">Swap Link Template</span>
                  </label>
                  <input
                    id="swapLinkTemplate"
                    name="swapLinkTemplate"
                    value={formData.swapLinkTemplate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="paymentLinkTemplate" className="label">
                    <span className="label-text">Payment Link Template</span>
                  </label>
                  <input
                    id="paymentLinkTemplate"
                    name="paymentLinkTemplate"
                    value={formData.paymentLinkTemplate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="inviteLinkTemplate" className="label">
                    <span className="label-text">Invite Link Template</span>
                  </label>
                  <input
                    id="inviteLinkTemplate"
                    name="inviteLinkTemplate"
                    value={formData.inviteLinkTemplate}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            )}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>{" "}
                    {loadingStage}
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StoreCreationComponent;