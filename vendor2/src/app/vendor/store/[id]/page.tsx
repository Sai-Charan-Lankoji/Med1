"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetStore } from "@/app/hooks/store/useGetStore";
import { BackButton } from "@/app/utils/backButton";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Next_server } from "@/constant";

const baseUrl = Next_server;
const backendManagementUrl = "http://localhost:3000"; // Backend store management server

interface StoreFormData {
  name: string;
  swap_link_template: string;
  payment_link_template: string;
  invite_link_template: string;
}

const EditStore = () => {
  const { id } = useParams();
  const { data: storeData, error, isLoading, refetch } = useGetStore(id as string);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreFormData>();

  useEffect(() => {
    if (storeData) {
      reset({
        name: storeData.name || "",
        swap_link_template: storeData.swap_link_template || "",
        payment_link_template: storeData.payment_link_template || "",
        invite_link_template: storeData.invite_link_template || "",
      });
    }
  }, [storeData, reset]);

  const onSubmit = async (data: StoreFormData) => {
    setLoading(true);

    try {
      const storeUpdateResponse = await fetch(`${baseUrl}/vendor/store/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!storeUpdateResponse.ok) {
        throw new Error("Failed to update Store Details");
      }

      const storeResult = await storeUpdateResponse.json();

      const backendUpdateResponse = await fetch(`${backendManagementUrl}/update-store`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store_id: id,
          name: data.name,
        }),
      });

      if (!backendUpdateResponse.ok) {
        console.error("Failed to update store in backend management system");
        toast.error("Store updated, but there was an issue with backend store management", {
          duration: 5000,
        });
      }
      toast.success("Store details updated successfully.", { duration: 5000 });
      router.push(`/vendor/store`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update store details", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <BackButton name="store" />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Update Store Details</h2>
        <hr className="mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold">Store Details</h3>
        <p className="text-sm text-gray-600 pt-2 font-semibold">Manage your business details</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">
                  Store name <span className="text-red-600">*</span>
                </span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Store name"
                className="input input-bordered w-full"
                {...register("name", { required: "Store name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="swap_link_template" className="label">
                <span className="label-text">Swap link template</span>
              </label>
              <input
                type="text"
                id="swap_link_template"
                placeholder="https://acme.inc/swap={swap_id}"
                className="input input-bordered w-full"
                {...register("swap_link_template")}
              />
            </div>
            <div className="form-control">
              <label htmlFor="payment_link_template" className="label">
                <span className="label-text">Draft order link template</span>
              </label>
              <input
                type="text"
                id="payment_link_template"
                placeholder="https://acme.inc/payment={payment_id}"
                className="input input-bordered w-full"
                {...register("payment_link_template")}
              />
            </div>
            <div className="form-control">
              <label htmlFor="invite_link_template" className="label">
                <span className="label-text">Invite link template</span>
              </label>
              <input
                type="text"
                id="invite_link_template"
                placeholder="https://acme.inc/invite?token={invite_token}"
                className="input input-bordered w-full"
                {...register("invite_link_template")}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStore;