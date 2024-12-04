"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Text,
  toast,
  Toaster,
} from "@medusajs/ui";
import { useGetStore } from "@/app/hooks/store/useGetStore";
import { BackButton } from "@/app/utils/backButton";
import { useParams } from "next/navigation";
import { Spinner } from "@medusajs/icons";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const backendManagementUrl = "http://localhost:3000"; // Backend store management server

const EditStore = () => {
  const { id } = useParams();
  const { data: storeData, error, isLoading, refetch } = useGetStore(id as string);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    swap_link_template: "",
    payment_link_template: "",
    invite_link_template: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeData) {
      setFormData({
        name: storeData.name || "",
        swap_link_template: storeData.swap_link_template || "",
        payment_link_template: storeData.payment_link_template || "",
        invite_link_template: storeData.invite_link_template || "",
      });
    }
  }, [storeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, update store details in the database
      const storeUpdateResponse = await fetch(`${baseUrl}/vendor/store/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
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
          name: formData.name
        }),
      });

      if (!backendUpdateResponse.ok) {
        // Loging the backend update error, 
        console.error("Failed to update store in backend management system");
        toast.warning("Warning", {
          description: "Store updated, but there was an issue with backend store management",
          duration: 5000,
        });
      }

      toast.success("Success", {
        description: "Store details updated successfully.",
        duration: 5000,
      });

      refetch();
      router.push(`/vendor/store`);
      return storeResult;
      
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to update store details",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
 

  return (
    <div>
      <Toaster position="top-right" />
      <BackButton name="store" />
      <Container>
        <Heading level="h2" className="text-xl sm:text-2xl font-semibold mb-4">
          Update Store Details
        </Heading>

        <hr />
        <Heading level="h2" className="text-lg sm:text-xl font-semibold mt-4">
          Store Details
        </Heading>
        <Text className="text-sm text-gray-600 pt-2 font-semibold">
          Manage your business details
        </Text>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
            <div className="pt-2">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Store name <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Store name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="pt-3">
              <Label htmlFor="swap_link_template" className="block text-sm font-medium text-gray-700">
                Swap link template
              </Label>
              <Input
                type="text"
                id="swap_link_template"
                name="swap_link_template"
                placeholder="https://acme.inc/swap={swap_id}"
                value={formData.swap_link_template}
                onChange={handleChange}
                className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="pt-3">
              <Label htmlFor="payment_link_template" className="block text-sm font-medium text-gray-700">
                Draft order link template
              </Label>
              <Input
                type="text"
                id="payment_link_template"
                name="payment_link_template"
                placeholder="https://acme.inc/payment={payment_id}"
                value={formData.payment_link_template}
                onChange={handleChange}
                className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="pt-3">
              <Label htmlFor="invite_link_template" className="block text-sm font-medium text-gray-700">
                Invite link template
              </Label>
              <Input
                type="text"
                id="invite_link_template"
                name="invite_link_template"
                placeholder="https://acme.inc/invite?token={invite_token}"
                value={formData.invite_link_template}
                onChange={handleChange}
                className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>  
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default EditStore;

