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
} from "@medusajs/ui";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { BackButton } from "@/app/utils/backButton";
import { useParams } from "next/navigation";
import { useUpdateSalesChannel } from "@/app/hooks/saleschannel/useUpdateSalesChannel";

// Mock API call to update the store (replace with actual API call)
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const EditStore = () => {
  const { data: storesData, error, isLoading } = useGetStores();
  const { id } = useParams();
  const { mutate: updateSalesChannel } = useUpdateSalesChannel(id as string);
  const [isSalesChannelUpdated, setIsSalesChannelUpdated] = useState(false); // Track if sales channel is created
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
  });

  const [loading, setLoading] = useState(false);

  // Load initial store data (if available)
  useEffect(() => {
    if (storesData) {
      setFormData({
        title: storesData.title || "",
        description: storesData.description || "",
        storeName: storesData.storeName || "",
        swapLinkTemplate: storesData.swapLinkTemplate || "",
        paymentLinkTemplate: storesData.paymentLinkTemplate || "",
        inviteLinkTemplate: storesData.inviteLinkTemplate || "",
      });
    }
  }, [storesData]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First API call to update the Sales Channel details
      updateSalesChannel(storesData, {
        onSuccess: () => {
          toast.success("Success", {
            description: "Sales Channel updated successfully",
            duration: 1000,
          });
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to update sales channel",
            duration: 1000,
          });
        },
      });

      // Second API call to update the Store details
      const storeDetailsResponse = await fetch(`${baseUrl}/vendor/store`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          storeName: formData.storeName,
          swapLinkTemplate: formData.swapLinkTemplate,
          paymentLinkTemplate: formData.paymentLinkTemplate,
          inviteLinkTemplate: formData.inviteLinkTemplate,
        }),
      });

      if (!storeDetailsResponse.ok) {
        throw new Error("Failed to update Store Details");
      }

      // Optionally, handle success response
    } catch (error: any) {
      return error.message || "Failed to update store details";
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <BackButton name="store" />
      <Container>
        <Heading level="h2" className="text-xl sm:text-2xl font-semibold mb-4">
          {isSalesChannelUpdated
            ? "Update Store & Sales Channel"
            : "Update Sales Channel"}
        </Heading>

        <hr />
        {!isSalesChannelUpdated? (
              // Sales Channel form
              <>
                <Heading
                  level="h2"
                  className="text-lg sm:text-xl font-semibold mt-4"
                >
                  Sales Channel Details
                </Heading>
                <Text className="text-lg font-semibold pt-4">General info</Text>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Apparel Design, Grocery Store, Paper Design Printing"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Description
                      </Label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Available products at our website, app..."
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="submit"
                      variant="transparent"
                      className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              // Store form
              <>
                <Heading
                  level="h2"
                  className="text-lg sm:text-xl font-semibold mt-4"
                >
                  Store Details
                </Heading>
                <Text className="text-sm text-gray-600 pt-2 font-semibold">
                  Manage your business details
                </Text>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                    <div className="pt-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        Store name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="storeName"
                        placeholder="Store name"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Swap link template
                      </Label>
                      <Input
                        type="text"
                        name="swapLinkTemplate"
                        placeholder="https://acme.inc/swap={swap_id}"
                        value={formData.swapLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Draft order link template
                      </Label>
                      <Input
                        type="text"
                        name="paymentLinkTemplate"
                        placeholder="https://acme.inc/payment={payment_id}"
                        value={formData.paymentLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="pt-3">
                      <Label className="block text-sm font-medium text-gray-700">
                        Invite link template
                      </Label>
                      <Input
                        type="text"
                        name="inviteLinkTemplate"
                        placeholder="https://acme.inc/invite?token={invite_token}"
                        value={formData.inviteLinkTemplate}
                        onChange={handleChange}
                        className="mt-1 py-3 block w-full border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>  
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="secondary"  >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="transparent"
                      className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </form>
              </>
            )}
      </Container>
    </div>
  );
};

export default EditStore;
